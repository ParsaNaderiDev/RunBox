import Link from "next/link";
import { ArrowUpRight, Github, Play } from "lucide-react";
import PlaygroundShell from "../components/playground/playground-shell";

const highlights = [
  "Real containers per run",
  "Shareable snapshots",
  "Admin-controlled showcases"
];

export default function HomePage() {
  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
            RunBox
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Code faster with a <span className="text-gradient">minimal live workspace</span>.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Compose multi-language snippets, fire up isolated sandboxes, and ship polish-ready demos without touching a
            terminal. Save or share snapshots, preload curated projects, and manage everything from a focused dashboard.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#playground"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500 text-sm font-medium text-slate-950 shadow-glow transition hover:bg-emerald-400"
            >
              <span className="rounded-full bg-black/20 p-3">
                <Play className="h-4 w-4" />
              </span>
              <span className="pr-4">Open playground</span>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:text-white"
            >
              Explore projects <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/ParsaNaderiDev"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:text-white"
            >
              <Github className="h-4 w-4" /> Star on GitHub
            </Link>
          </div>
          <ul className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
            {highlights.map((feature) => (
              <li key={feature} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="surface relative overflow-hidden p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_55%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-slate-300">Snapshot Preview</h2>
              <p className="mt-2 text-sm text-slate-400">
                Preload curated templates or import your own archives. Execute them against isolated containers with a
                single tap.
              </p>
            </div>
            <div className="mt-8 rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-slate-300">
              <p className="font-mono text-slate-100">docker run --rm runbox/python:latest</p>
              <p className="mt-2 text-slate-400">
                Mirrors production container security — read-only base layers, ephemeral temp space, and tight CPU/mem
                budgets.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="playground" className="relative rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-glow">
        <PlaygroundShell />
      </section>
      <section className="grid gap-4 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur sm:grid-cols-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Ephemeral by design</h3>
          <p className="mt-2 text-xs text-slate-300">
            Every run gets a fresh container with seccomp profiles, no egress, and predictable resources.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Snapshots that execute</h3>
          <p className="mt-2 text-xs text-slate-300">
            Link to prefilled projects or export read-only demos in seconds. No stubbing — real commands, real output.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Deploy-ready</h3>
          
          <p className="mt-2 text-xs text-slate-300">
            Next.js on Vercel, FastAPI for orchestration, and a Celery runner grid, wired through Redis and MinIO.
          </p>
        </div>
      </section>
    </div>
  );
}
