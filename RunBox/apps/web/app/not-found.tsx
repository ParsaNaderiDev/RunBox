export default function NotFound() {
  return (
    <section className="mx-auto flex h-[60vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold text-white">Page not found</h1>
      <p className="text-sm text-gray-400">
        We could not locate the project or page you were looking for. Double-check the URL or head back to the
        playground.
      </p>
      <a href="/" className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950">
        Go home
      </a>
    </section>
  );
}

