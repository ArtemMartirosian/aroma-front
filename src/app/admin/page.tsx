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
      <div className="admin-panel w-full max-w-xl rounded-[32px] p-8 text-center shadow-[0_24px_70px_rgba(17,24,39,0.08)]">
        <p className="admin-kicker text-sm font-semibold uppercase tracking-[0.28em]">
          AROMA ADMIN
        </p>
        <h1 className="admin-title mt-4 text-3xl font-semibold sm:text-4xl">
          {hydrated
            ? token
              ? "Տեղափոխում ենք ադմին վահանակ..."
              : "Տեղափոխում ենք մուտքի էջ..."
            : "Բեռնում ենք..."}
        </h1>
        <p className="admin-muted mt-4 text-base leading-7">
          Եթե անցումը չկատարվի ավտոմատ, կարող եք շարունակել ձեռքով։
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={token ? "/admin/dashboard" : "/admin/login"}
            className="admin-button-primary rounded-full px-6 py-3 text-sm font-semibold transition"
          >
            {token ? "Բացել ադմին վահանակը" : "Բացել մուտքի էջը"}
          </Link>
          <Link
            href="/"
            className="admin-button-secondary rounded-full px-6 py-3 text-sm font-semibold transition"
          >
            Վերադառնալ գլխավոր
          </Link>
        </div>
      </div>
    </div>
  );
}
