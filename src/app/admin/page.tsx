"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminSession } from "@/components/admin/auth";

export default function AdminEntryPage() {
  const router = useRouter();
  const { hydrated, token } = useAdminSession();

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    router.replace(token ? "/admin/dashboard" : "/admin/login");
  }, [hydrated, router, token]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl rounded-[32px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(249,251,249,0.96),rgba(223,230,225,0.96))] p-8 text-center shadow-[0_24px_70px_rgba(35,56,49,0.1)]">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          AROMA ADMIN
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
          {hydrated
            ? token
              ? "Տեղափոխում ենք ադմին վահանակ..."
              : "Տեղափոխում ենք մուտքի էջ..."
            : "Բեռնում ենք..."}
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--text-soft)]">
          Եթե անցումը չկատարվի ավտոմատ, կարող եք շարունակել ձեռքով։
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={token ? "/admin/dashboard" : "/admin/login"}
            className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#171717] transition hover:border-[var(--accent-strong)] hover:bg-[var(--accent-strong)]"
          >
            {token ? "Բացել ադմին վահանակը" : "Բացել մուտքի էջը"}
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            Վերադառնալ գլխավոր
          </Link>
        </div>
      </div>
    </div>
  );
}
