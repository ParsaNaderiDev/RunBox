"use client";

import { useEffect, useState } from "react";
import { Loader2, MailPlus, Trash2 } from "lucide-react";
import { apiDelete, apiGet, apiPost } from "../../../lib/api-client";

type UserRecord = {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_login: string | null;
};

type InvitePayload = {
  email: string;
  role: string;
};

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "owner", label: "Owner" }
];

export default function UserManagement() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invite, setInvite] = useState<InvitePayload>({ email: "", role: "admin" });
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      setLoading(true);
      const data = await apiGet<UserRecord[]>("/admin/users");
      setUsers(data);
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Failed to load users" });
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!invite.email.trim()) {
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      await apiPost("/admin/users", { ...invite, email: invite.email.trim() });
      setFeedback({ type: "success", message: "Invitation created" });
      setInvite({ email: "", role: invite.role });
      await refresh();
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Unable to invite user" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(user: UserRecord) {
    if (!confirm(`Remove ${user.email}?`)) {
      return;
    }
    try {
      await apiDelete(`/admin/users/${user.id}`);
      setFeedback({ type: "success", message: "User removed" });
      await refresh();
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Failed to remove user" });
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-white">User Management</h1>
        <p className="text-sm text-slate-300">Invite administrators and keep your workspace secure.</p>
      </header>

      {feedback && (
        <div
          className={
            feedback.type === "success"
              ? "rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
              : "rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          }
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleInvite} className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            Email
            <input
              type="email"
              required
              value={invite.email}
              onChange={(event) => setInvite((prev) => ({ ...prev, email: event.target.value }))}
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/60"
            />
          </label>
          <label className="flex w-full flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-400 sm:w-40">
            Role
            <select
              value={invite.role}
              onChange={(event) => setInvite((prev) => ({ ...prev, role: event.target.value }))}
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/60"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-900">
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailPlus className="h-4 w-4" />}
            {submitting ? "Sending" : "Invite admin"}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/5 text-sm text-slate-200">
          <thead className="bg-white/5 uppercase tracking-[0.3em] text-xs text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Joined</th>
              <th className="px-4 py-3 text-left font-medium">Last login</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  <span className="inline-flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading users…
                  </span>
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No administrators yet. Use the form above to invite your first teammate.
                </td>
              </tr>
            )}
            {!loading &&
              users.map((user) => {
                const created = new Date(user.created_at).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short"
                });
                const lastLogin = user.last_login
                  ? new Date(user.last_login).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })
                  : "Never";

                return (
                  <tr key={user.id} className="hover:bg-white/5">
                    <td className="px-4 py-4 text-white">{user.email}</td>
                    <td className="px-4 py-4 capitalize text-slate-300">{user.role}</td>
                    <td className="px-4 py-4 text-xs text-slate-400">{created}</td>
                    <td className="px-4 py-4 text-xs text-slate-400">{lastLogin}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemove(user)}
                        className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-red-400/60 hover:text-red-300"
                        aria-label={`Remove ${user.email}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
