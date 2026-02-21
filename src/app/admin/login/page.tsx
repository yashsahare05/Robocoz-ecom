"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/providers/session-provider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAdmin, ready } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && isAdmin) {
      router.replace("/admin");
    }
  }, [ready, isAdmin, router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error ?? "Login failed.");
      return;
    }
    setError(null);
    router.replace("/admin");
  };

  return (
    <section className="section-container flex min-h-[70vh] items-center justify-center py-12">
      <div className="card w-full max-w-md space-y-4 p-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-dark">
            Admin Access
          </p>
          <h1 className="text-2xl font-heading font-semibold text-zinc-900">
            Sign in to Dashboard
          </h1>
          <p className="text-sm text-zinc-600">
            Use your admin credentials to manage operations.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-zinc-700">
            Work email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@robocoz.com"
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
              required
            />
          </label>
          <label className="text-sm font-medium text-zinc-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2"
              required
            />
          </label>
          {error ? (
            <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"
          >
            Continue
          </button>
        </form>
        <p className="text-xs text-zinc-500">
          Configure `NEXT_PUBLIC_ADMIN_EMAIL` and
          `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local` to change the default
          admin credentials.
        </p>
      </div>
    </section>
  );
}
