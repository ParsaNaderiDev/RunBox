"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const MonacoEditor = dynamic(async () => import("@monaco-editor/react"), { ssr: false });

type EditorProps = {
  language: string;
  value: string;
  onChange: (value: string) => void;
};

const LANGUAGE_TO_MONACO: Record<string, string> = {
  python: "python",
  node: "javascript",
  go: "go",
  rust: "rust"
};

export default function CodeEditor({ language, value, onChange }: EditorProps) {
  const monacoLanguage = useMemo(() => LANGUAGE_TO_MONACO[language] ?? "plaintext", [language]);

  return (
    <MonacoEditor
      theme="vs-dark"
      height="100%"
      language={monacoLanguage}
      value={value}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "JetBrains Mono, monospace",
        smoothScrolling: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        lineNumbersMinChars: 3,
        roundedSelection: false,
        cursorSmoothCaretAnimation: "on",
        padding: { top: 16 }
      }}
      loading={<div className="flex h-full items-center justify-center text-xs text-slate-400">Booting editor...</div>}
      onChange={(next) => onChange(next ?? "")}
    />
  );
}
