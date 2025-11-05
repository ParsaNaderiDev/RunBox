"use client";

import { useEffect, useRef } from "react";

if (typeof globalThis !== "undefined" && typeof (globalThis as typeof globalThis & { self?: unknown }).self === "undefined") {
  (globalThis as typeof globalThis & { self?: unknown }).self = globalThis;
}

type TerminalViewProps = {
  lines: string[];
};

export default function TerminalView({ lines }: TerminalViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<any | null>(null);
  const termReadyRef = useRef(false);
  const linesRef = useRef<string[]>(lines);

  useEffect(() => {
    linesRef.current = lines;
    if (!termReadyRef.current || !terminalRef.current) {
      return;
    }

    const term = terminalRef.current;
    term.clear();
    lines.forEach((line) => term.writeln(line));
  }, [lines]);

  useEffect(() => {
    let disposed = false;
    let termInstance: any | null = null;

    async function init() {
      const { Terminal } = await import("xterm");
      await import("xterm/css/xterm.css");

      if (!containerRef.current || disposed) {
        return;
      }

      termInstance = new Terminal({
        convertEol: true,
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 13,
        rows: 20,
        cols: 80,
        theme: {
          background: "#030712",
          foreground: "#f9fafb"
        }
      });
      termInstance.open(containerRef.current);
      terminalRef.current = termInstance;
      termReadyRef.current = true;
      linesRef.current.forEach((line) => termInstance.writeln(line));
    }

    init();

    return () => {
      disposed = true;
      termReadyRef.current = false;
      termInstance?.dispose();
      terminalRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="flex-1 overflow-hidden bg-terminal-bg text-terminal-fg" />;
}
