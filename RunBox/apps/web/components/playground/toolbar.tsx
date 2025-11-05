"use client";

import { Loader2, Play, RefreshCcw } from "lucide-react";
import { useMemo } from "react";
import { cn } from "../../lib/utils";

type PlaygroundToolbarProps = {
  state: {
    language: string;
    status: "idle" | "running" | "error";
    project: string | null;
  };
  onRun: () => void;
  onLanguageChange: (language: string) => void;
  onReset: () => void;
  hasProject: boolean;
};

const LANGUAGES = [
  { key: "python", label: "Python" },
  { key: "node", label: "Node.js" },
  { key: "go", label: "Go" },
  { key: "rust", label: "Rust" }
];

export default function PlaygroundToolbar({ state, onRun, onLanguageChange, onReset, hasProject }: PlaygroundToolbarProps) {
  const isRunning = state.status === "running";

  const languageOptions = useMemo(
    () =>
      LANGUAGES.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onLanguageChange(option.key)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs transition",
            state.language === option.key
              ? "border border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border border-white/5 bg-white/5 text-slate-300 hover:border-white/15 hover:text-white"
          )}
        >
          {option.label}
        </button>
      )),
    [state.language, onLanguageChange]
  );

  return (
    <div className="glass flex flex-col gap-4 border border-white/10 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2 text-xs text-slate-300">
        <span className="uppercase tracking-[0.35em] text-slate-500">Language</span>
        <div className="flex flex-wrap gap-2">{languageOptions}</div>
        {state.project && (
          <span className="text-[0.72rem] text-highlight/80">Loaded snapshot: {state.project}</span>
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <button
          type="button"
          onClick={onReset}
          disabled={isRunning}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300 transition hover:border-white/25",
            hasProject && "opacity-60 hover:opacity-100",
            isRunning && "cursor-not-allowed opacity-40"
          )}
        >
          <RefreshCcw className="h-3.5 w-3.5" /> Reset editor
        </button>
        <button
          type="button"
          disabled={isRunning}
          onClick={onRun}
          className={cn(
            "inline-flex items-center gap-3 rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400",
            isRunning && "cursor-not-allowed opacity-70"
          )}
        >
          {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {isRunning ? "Running..." : hasProject ? "Run snapshot" : "Run code"}
        </button>
      </div>
    </div>
  );
}
