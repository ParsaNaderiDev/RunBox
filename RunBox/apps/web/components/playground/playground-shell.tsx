"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Loader2, Share2 } from "lucide-react";
import CodeEditor from "./code-editor";
import PlaygroundToolbar from "./toolbar";
import { findProjectBySlug, type Project } from "../../lib/projects";

const TerminalView = dynamic(() => import("./terminal-view"), { ssr: false });

type LanguageKey = "python" | "node" | "go" | "rust";

type RunResponse = {
  id: string;
  status: string;
  language: string;
  output: string;
  error?: string | null;
};

const LANGUAGE_TEMPLATES: Record<LanguageKey, string> = {
  python: `print("Hello from RunBox Python sandbox!")`,
  node: `console.log("Hello from RunBox Node sandbox!")`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello from RunBox Go sandbox!")
}`,
  rust: `fn main() {
    println!("Hello from RunBox Rust sandbox!");
}`
};

const FILE_EXTENSIONS: Record<LanguageKey, string> = {
  python: "py",
  node: "mjs",
  go: "go",
  rust: "rs"
};

function asLanguageKey(language: string): LanguageKey {
  if (["python", "node", "go", "rust"].includes(language)) {
    return language as LanguageKey;
  }
  return "python";
}

export default function PlaygroundShell() {
  const searchParams = useSearchParams();

  const [language, setLanguage] = useState<LanguageKey>("python");
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.python);
  const [status, setStatus] = useState<"idle" | "running" | "error">("idle");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "Ready. Choose a template and run your first command."
  ]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  const appendTerminalLine = useCallback((line: string) => {
    setTerminalLines((prev) => [...prev, `› ${line}`]);
  }, []);

  const loadTemplate = useCallback(
    (nextLanguage: LanguageKey) => {
      setLanguage(nextLanguage);
      setCode(LANGUAGE_TEMPLATES[nextLanguage]);
      setActiveProject(null);
      appendTerminalLine(`Loaded ${nextLanguage} starter template.`);
    },
    [appendTerminalLine]
  );

  const loadProject = useCallback(
    (project: Project) => {
      const nextLanguage = asLanguageKey(project.language);
      setLanguage(nextLanguage);
      setCode(project.code ?? LANGUAGE_TEMPLATES[nextLanguage]);
      setActiveProject(project);
      setTerminalLines([`Snapshot "${project.title}" ready. Review the code and hit Run to replay.`]);
    },
    []
  );

  useEffect(() => {
    const slug = searchParams.get("project");
    if (!slug) {
      setActiveProject(null);
      return;
    }
    const project = findProjectBySlug(slug);
    if (!project) {
      appendTerminalLine(`Snapshot ${slug} was not found.`);
      return;
    }
    if (project.id !== activeProject?.id) {
      loadProject(project);
    }
  }, [searchParams, loadProject, activeProject, appendTerminalLine]);

  const handleLanguageChange = useCallback(
    (next: string) => {
      const nextLanguage = asLanguageKey(next);
      loadTemplate(nextLanguage);
    },
    [loadTemplate]
  );

  const handleRun = useCallback(async () => {
    setStatus("running");
    setTerminalLines([`Launching ${language} sandbox...`]);

    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
      const endpoint = apiBase ? `${apiBase}/api/runs` : "/api/runs";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          project_slug: activeProject?.slug,
          files: [{ name: `Main.${FILE_EXTENSIONS[language]}`, content: code }],
          run_cmd: activeProject?.runCmd,
          build_cmd: activeProject?.buildCmd
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to start run (${response.status})`);
      }

      const payload = (await response.json()) as RunResponse;
      const outputLines = payload.output ? payload.output.split(/\r?\n/).filter(Boolean) : [];
      if (outputLines.length === 0 && payload.error) {
        outputLines.push(payload.error);
      }
      appendTerminalLine(`Run ${payload.status} (${payload.id}).`);
      if (outputLines.length > 0) {
        outputLines.forEach((line) => appendTerminalLine(line));
      } else {
        appendTerminalLine("No output captured.");
      }
      setStatus(payload.status === "failed" ? "error" : "idle");
    } catch (error) {
      console.error(error);
      setStatus("error");
      appendTerminalLine(
        `Run failed to start. ${error instanceof Error ? error.message : "Unknown error occurred."}`
      );
      return;
    }
  }, [language, code, activeProject, appendTerminalLine]);

  const handleShare = useCallback(() => {
    if (typeof window === "undefined" || !navigator?.clipboard) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (activeProject) {
      params.set("project", activeProject.slug);
    } else {
      params.delete("project");
    }
    const query = params.toString();
    const url = query
      ? `${window.location.origin}${window.location.pathname}?${query}`
      : `${window.location.origin}${window.location.pathname}`;
    navigator.clipboard
      .writeText(url)
      .then(() => setShareState("copied"))
      .catch((error) => {
        console.error(error);
        setShareState("idle");
      })
      .finally(() => {
        setTimeout(() => setShareState("idle"), 2500);
      });
  }, [activeProject]);

  const toolbarState = useMemo(
    () => ({
      language,
      status,
      project: activeProject?.title ?? null
    }),
    [language, status, activeProject]
  );

  const handleReset = useCallback(() => {
    if (activeProject) {
      loadProject(activeProject);
    } else {
      loadTemplate(language);
    }
  }, [activeProject, loadProject, loadTemplate, language]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-glow sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1 text-sm text-slate-200">
          <span className="text-xs uppercase tracking-[0.35em] text-slate-400">Snapshot</span>
          <span className="text-sm font-medium text-white">
            {activeProject ? activeProject.title : "Blank workspace"}
          </span>
          <span className="text-xs text-slate-400">
            {status === "running"
              ? "Runner preparing container..."
              : activeProject
                ? `Preloaded from ${activeProject.language} showcase.`
                : "Switch languages or paste your own files."}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:border-white/25"
          >
            <Share2 className="h-4 w-4" />
            {shareState === "copied" ? "Link copied" : "Share snapshot"}
          </button>
          {status === "running" && <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />}
        </div>
      </div>
      <PlaygroundToolbar
        state={toolbarState}
        onRun={handleRun}
        onLanguageChange={handleLanguageChange}
        onReset={handleReset}
        hasProject={Boolean(activeProject)}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="glass flex flex-col overflow-hidden border border-white/5">
          <header className="flex items-center justify-between border-b border-white/5 px-4 py-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            <span>Editor</span>
            <span className="rounded-full border border-emerald-400/50 px-3 py-1 text-[0.7rem] lowercase text-emerald-200">
              {language}
            </span>
          </header>
          <CodeEditor language={language} value={code} onChange={setCode} />
        </div>
        <div className="glass flex flex-col overflow-hidden border border-white/5">
          <header className="flex items-center justify-between border-b border-white/5 px-4 py-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            <span>Terminal</span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[0.7rem] text-slate-300">
              {status === "running" ? "Running" : "Idle"}
            </span>
          </header>
          <TerminalView lines={terminalLines} />
        </div>
      </div>
    </div>
  );
}
