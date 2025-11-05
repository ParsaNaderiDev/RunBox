import Image from "next/image";
import Link from "next/link";
import { MOCK_PROJECTS } from "../../lib/projects";

export const metadata = {
  title: "Projects | RunBox"
};

export default function ProjectsPage() {
  const published = MOCK_PROJECTS.filter((project) => project.status === "published");
  const drafts = MOCK_PROJECTS.filter((project) => project.status !== "published");

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-[0.35em] text-slate-500">Showcase</span>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Snapshots ready to replay</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Each project is wired to the same sandbox flow you get in the playground. Open a card to inspect the README,
          or jump straight into the snapshot and rerun its build + run commands.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {published.map((project) => (
          <article key={project.id} className="glass group flex flex-col overflow-hidden border border-white/5">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={project.coverUrl}
                alt={project.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70" />
            </div>
            <div className="flex flex-1 flex-col gap-4 px-5 py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">{project.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-300">{project.description}</p>
                </div>
                <span className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs uppercase text-emerald-200">
                  {project.language}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-[0.7rem] text-slate-400">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-3 py-1">#{tag}</span>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap gap-3">
                <Link
                  href={`/?project=${project.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500 px-4 py-2 text-xs font-medium text-slate-950 transition hover:bg-emerald-400"
                >
                  Run snapshot
                </Link>
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200 transition hover:border-white/20"
                >
                  Details
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {drafts.length > 0 && (
        <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-5 text-sm text-amber-200">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">Drafts</h2>
          <p className="mt-2 text-xs text-amber-100/80">
            These demos are still under review and visible to admins only. Publish them from the dashboard when ready.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {drafts.map((project) => (
              <span key={project.id} className="rounded-full border border-amber-400/40 px-3 py-1">
                {project.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
