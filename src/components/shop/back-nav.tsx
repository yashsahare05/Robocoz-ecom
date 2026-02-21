"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  label?: string;
  fallbackHref?: string;
};

export const BackNav = ({
  label = "Back",
  fallbackHref = "/shop",
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? undefined;
  const safeReturnTo =
    returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : undefined;

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    if (safeReturnTo) {
      router.replace(safeReturnTo);
      return;
    }
    router.replace(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="text-sm font-semibold text-brand-dark hover:text-orange-500"
    >
      &larr; {label}
    </button>
  );
};
