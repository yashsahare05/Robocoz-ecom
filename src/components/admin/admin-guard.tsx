"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/providers/session-provider";

type Props = {
  children: ReactNode;
};

export const AdminGuard = ({ children }: Props) => {
  const router = useRouter();
  const { isAdmin, ready } = useAdminAuth();

  useEffect(() => {
    if (ready && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [ready, isAdmin, router]);

  if (!ready) {
    return (
      <section className="section-container flex min-h-[60vh] items-center justify-center py-12">
        <div className="card card-static w-full max-w-md space-y-3 p-6 text-sm text-zinc-600">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Admin Access
          </p>
          <p>Checking admin session...</p>
        </div>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="section-container flex min-h-[60vh] items-center justify-center py-12">
        <div className="card card-static w-full max-w-md space-y-4 p-6 text-sm text-zinc-600">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Admin Access
          </p>
          <p>Please sign in to view the admin dashboard.</p>
        </div>
      </section>
    );
  }

  return <>{children}</>;
};
