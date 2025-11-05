import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Code2, Play } from "lucide-react";
import { findProjectBySlug } from "../../../lib/projects";

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: ProjectPageProps) {
  const project = findProjectBySlug(params.slug);
  if (!project) {
    return { title: "Project Not Found | RunBox" };
  }

  return {
    title: `${project.title} | RunBox`,
    description: project.description
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = findProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <Link href="/projects" className="text-xs uppercase tracking-[0.35em] text-slate-500 transition hover:text-slate-300">
        ← Back
      </Link>
      <article className="surface overflow-hidden">
        <div className="relative h-72 w-full">
          <Image
            src={project.coverUrl}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
        <div className="grid gap-8 px-8 py-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">{project.title}</h1>
              <p className="text-sm text-slate-300">{project.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="rounded-full border border-emerald-400/40 px-3 py-1 uppercase text-emerald-200">
                {project.language}
              </span>
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-3 py-1">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/?project=${project.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                <Play className="h-4 w-4" /> Run snapshot
              </Link>
              <Link
                href={`/?project=${project.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20"
              >
                <Code2 className="h-4 w-4" /> Open playground
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-400">
              <Code2 className="h-3.5 w-3.5" /> Snapshot source
            </span>
            <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-slate-950/70 p-4 text-xs text-slate-200">
              <code>{project.code ?? "Snapshot code will appear here soon."}</code>
            </pre>
            {project.runCmd && (
              <div className="mt-4 text-xs text-slate-400">
                <p className="font-semibold text-slate-200">Run command</p>
                <code className="mt-1 inline-block rounded bg-white/5 px-2 py-1 text-[0.7rem] text-slate-200">{project.runCmd}</code>
              </div>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}
