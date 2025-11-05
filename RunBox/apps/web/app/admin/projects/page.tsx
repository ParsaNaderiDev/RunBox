"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { apiDelete, apiGet, apiPost, apiPut } from "../../../lib/api-client";

const LANGUAGE_OPTIONS = [
  { label: "Python", value: "python" },
  { label: "Node.js", value: "node" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" }
];

type ApiProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
  cover_url?: string | null;
  readme_md?: string | null;
  build_cmd?: string | null;
  run_cmd?: string | null;
  status: "draft" | "published";
};

type ProjectRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
  coverUrl: string;
  readmeMd: string;
  buildCmd: string;
  runCmd: string;
  status: "draft" | "published";
};

type ProjectFormState = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  language: string;
  tags: string;
  coverUrl: string;
  readmeMd: string;
  buildCmd: string;
  runCmd: string;
  status: "draft" | "published";
};

const emptyForm: ProjectFormState = {
  title: "",
  slug: "",
  description: "",
  language: "python",
  tags: "",
  coverUrl: "",
  readmeMd: "",
  buildCmd: "",
  runCmd: "",
  status: "draft"
};

function mapApiProject(project: ApiProject): ProjectRecord {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    language: project.language,
    tags: project.tags ?? [],
    coverUrl: project.cover_url ?? "",
    readmeMd: project.readme_md ?? "",
    buildCmd: project.build_cmd ?? "",
    runCmd: project.run_cmd ?? "",
    status: project.status
  };
}

function toFormState(project: ProjectRecord): ProjectFormState {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    language: project.language,
    tags: project.tags.join(", "),
    coverUrl: project.coverUrl,
    readmeMd: project.readmeMd,
    buildCmd: project.buildCmd,
    runCmd: project.runCmd,
    status: project.status
  };
}

function toPayload(form: ProjectFormState) {
  const tags = form.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    description: form.description.trim(),
    language: form.language,
    tags,
    cover_url: form.coverUrl.trim() || null,
    readme_md: form.readmeMd.trim() || null,
    build_cmd: form.buildCmd.trim() || null,
    run_cmd: form.runCmd.trim() || null,
    status: form.status
  };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<ProjectFormState | null>(null);
  const [initialSlug, setInitialSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const hasProjects = useMemo(() => projects.length > 0, [projects]);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      setLoading(true);
      const result = await apiGet<ApiProject[]>("/projects");
      setProjects(result.map(mapApiProject));
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Failed to load projects" });
    } finally {
      setLoading(false);
    }
  }

  function beginCreate() {
    setEditing({ ...emptyForm });
    setInitialSlug(null);
    setFeedback(null);
  }

  function beginEdit(project: ProjectRecord) {
    setEditing(toFormState(project));
    setInitialSlug(project.slug);
    setFeedback(null);
  }

  function cancelEditing() {
    setEditing(null);
    setInitialSlug(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) {
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const payload = toPayload(editing);
      if (initialSlug) {
        await apiPut<ApiProject>(`/projects/${initialSlug}`, payload);
        setFeedback({ type: "success", message: "Project updated" });
      } else {
        await apiPost<ApiProject>("/projects", payload);
        setFeedback({ type: "success", message: "Project created" });
      }
      await refresh();
      cancelEditing();
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Unable to save project" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(project: ProjectRecord) {
    if (!confirm(`Delete ${project.title}?`)) {
      return;
    }
    try {
      await apiDelete(`/projects/${project.slug}`);
      setFeedback({ type: "success", message: "Project deleted" });
      await refresh();
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Failed to delete project" });
    }
  }

  function updateField<K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Projects</h1>
          <p className="text-sm text-slate-300">Create, update, and publish the snapshots that power the RunBox experience.</p>
        </div>
        <button
          type="button"
          onClick={beginCreate}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
        >
          <Plus className="h-4 w-4" /> New project
        </button>
      </header>

      {feedback && (
        <div
          className={
            feedback.type === "success"
              ? "rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
              : "rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          }
        >
          {feedback.message}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/5 text-sm text-slate-200">
          <thead className="bg-white/5 uppercase tracking-[0.3em] text-xs text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Language</th>
              <th className="px-4 py-3 text-left font-medium">Tags</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  <span className="inline-flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading projects…
                  </span>
                </td>
              </tr>
            )}
            {!loading && !hasProjects && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No projects yet. Create your first snapshot to showcase in the playground.
                </td>
              </tr>
            )}
            {!loading &&
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-white/5">
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-white">{project.title}</span>
                      <span className="text-xs text-slate-400">/{project.slug}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 capitalize text-slate-300">{project.language}</td>
                  <td className="px-4 py-4 text-xs text-slate-400">
                    {project.tags.length > 0 ? project.tags.join(", ") : <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={
                        project.status === "published"
                          ? "rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
                          : "rounded-full border border-slate-400/30 bg-slate-500/10 px-3 py-1 text-xs text-slate-300"
                      }
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2 text-slate-300">
                      <button
                        type="button"
                        onClick={() => beginEdit(project)}
                        className="rounded-full border border-white/10 p-2 hover:border-white/25 hover:text-white"
                        aria-label={`Edit ${project.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project)}
                        className="rounded-full border border-white/10 p-2 hover:border-red-400/60 hover:text-red-300"
                        aria-label={`Delete ${project.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 shadow-glow">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">{initialSlug ? "Edit project" : "Create project"}</h2>
              <p className="text-xs text-slate-400">Provide metadata, default commands, and content that will appear in the playground.</p>
            </div>
            <button
              type="button"
              onClick={cancelEditing}
              className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-white/20 hover:text-white"
              aria-label="Close form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-slate-400">
              Title
              <input
                required
                value={editing.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/70"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-slate-400">
              Slug
              <input
                required
                value={editing.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/70"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-slate-400 md:col-span-2">
              Description
              <textarea
                required
                rows={3}
                value={editing.description}
                onChange={(event) => updateField("description", event.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/70"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-slate-400">
              Language
              <select
                value={editing.language}
                onChange={(event) => updateField("language", event.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/70"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-900">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-slate-400">
              Status
              <select
                value={editing.status}
                onChange={(event) => updateField("status", event.target.value as "draft" | "published")}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/70"
              >
                <option value="draft" className="bg-slate-900">
                  Draft
                </option>
                <option value="published" className="bg-slate-900">
                  Published
                </option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-slate-400">
              Tags (comma separated)
              <input
                value={editing.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/70"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-slate-400">
              Cover URL
              <input
                value={editing.coverUrl}
                onChange={(event) => updateField("coverUrl", event.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/70"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-slate-400 md:col-span-2">
              README (Markdown)
              <textarea
                rows={4}
                value={editing.readmeMd}
                onChange={(event) => updateField("readmeMd", event.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/70"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-slate-400">
              Build command
              <input
                value={editing.buildCmd}
                onChange={(event) => updateField("buildCmd", event.target.value)}
                placeholder="Optional"
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/70"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-slate-400">
              Run command
              <input
                value={editing.runCmd}
                onChange={(event) => updateField("runCmd", event.target.value)}
                placeholder="Overrides default"
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/70"
              />
            </label>
            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/25"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Saving" : initialSlug ? "Update project" : "Create project"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
