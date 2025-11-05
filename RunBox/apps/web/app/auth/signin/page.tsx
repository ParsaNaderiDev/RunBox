export const metadata = {
  title: "Sign in | RunBox"
};

export default function SignInPage() {
  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-20">
      <div className="glass rounded-2xl border border-white/10 px-8 py-10">
        <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
        <p className="text-sm text-gray-400">Use your RunBox credentials to access the admin dashboard.</p>
        <form className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-gray-300">Email</span>
            <input
              type="email"
              className="rounded-md border border-white/10 bg-transparent px-3 py-2 text-gray-100 outline-none focus:border-emerald-400"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-gray-300">Password</span>
            <input
              type="password"
              className="rounded-md border border-white/10 bg-transparent px-3 py-2 text-gray-100 outline-none focus:border-emerald-400"
              required
            />
          </label>
          <button type="submit" className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}

