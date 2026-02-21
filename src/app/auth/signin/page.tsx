"use client";

export default function SignInPage() {
  return (
    <section className="section-container flex min-h-[70vh] items-center justify-center py-12">
      <div className="card w-full max-w-md space-y-4 p-8">
        <h1 className="text-2xl font-heading font-semibold text-zinc-900">
          Sign in
        </h1>
        <p className="text-sm text-zinc-600">
          Frontend-only preview. Sign-in is disabled in this build.
        </p>
        <label className="text-sm font-medium text-zinc-700">
          Work email
          <input
            type="email"
            placeholder="you@company.com"
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Password
          <input
            type="password"
            placeholder="••••••••"
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
          />
        </label>
        <button className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white">
          Continue
        </button>
      </div>
    </section>
  );
}

