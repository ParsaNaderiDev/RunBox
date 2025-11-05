export const metadata = {
  title: "Runner Monitor | RunBox"
};

export default function AdminRunsPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-white">Sandbox Activity</h1>
        <p className="text-sm text-gray-400">
          Realtime view of active runs will appear here once the runner service is connected.
        </p>
      </header>
      <div className="glass rounded-xl border border-white/10 px-5 py-10 text-sm text-gray-400">
        <p>No active runs yet. Kick off a job from the playground to populate this dashboard.</p>
      </div>
    </section>
  );
}

