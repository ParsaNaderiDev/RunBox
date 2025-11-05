import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | RunBox"
};

const CARDS = [
  {
    title: "Projects",
    description: "Create, update, and publish RunBox showcase projects.",
    href: "/admin/projects"
  },
  {
    title: "Runs",
    description: "Monitor active sandboxes and inspect runner logs.",
    href: "/admin/runs"
  },
  {
    title: "Users",
    description: "Invite new admins and manage access levels.",
    href: "/admin/users"
  }
];

export default function AdminPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-400">
          Manage the RunBox portfolio, monitor sandbox activity, and administer user access.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="glass flex h-full flex-col justify-between gap-3 rounded-xl border border-white/10 px-5 py-4 transition hover:border-emerald-400/50"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-white">{card.title}</h2>
              <p className="text-sm text-gray-400">{card.description}</p>
            </div>
            <span className="text-sm font-medium text-emerald-300">Open →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

