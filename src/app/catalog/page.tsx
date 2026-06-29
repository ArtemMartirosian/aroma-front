import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Կատալոգ",
  description:
    "Դիտեք Aroma Parfume & cosmetics-ի օծանելիքի կատալոգը՝ ֆիլտրերով ըստ բրենդի, սեռի, բույրի տեսակի, ծավալի և գնի։",
  path: "/catalog",
});

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogPageFallback />}>
      <CatalogClient />
    </Suspense>
  );
}

function CatalogPageFallback() {
  return (
    <div className="relative overflow-hidden bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="rounded-[34px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(21,24,25,0.95),rgba(29,33,34,0.94))] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-7 lg:p-8">
          <div className="h-7 w-36 animate-pulse rounded-full bg-[var(--surface-muted)]" />
          <div className="mt-4 h-14 w-72 animate-pulse rounded-[20px] bg-[var(--surface-muted)]" />
          <div className="mt-5 h-6 w-full max-w-2xl animate-pulse rounded-full bg-[var(--surface-muted)]" />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[8px] border border-[var(--line)] bg-[var(--surface-elevated)] sm:rounded-[24px]"
            >
              <div className="aspect-[3.5/4] animate-pulse bg-[var(--surface-muted)] sm:aspect-[4/3]" />
              <div className="space-y-3 p-2.5 sm:p-4">
                <div className="h-3 w-20 animate-pulse rounded-full bg-[var(--surface-muted)]" />
                <div className="h-5 w-full animate-pulse rounded-full bg-[var(--surface-muted)]" />
                <div className="h-5 w-3/4 animate-pulse rounded-full bg-[var(--surface-muted)]" />
                <div className="h-px w-12 bg-[var(--line)]" />
                <div className="flex gap-2">
                  <div className="h-8 w-14 animate-pulse rounded-full bg-[var(--surface-muted)]" />
                  <div className="h-8 w-14 animate-pulse rounded-full bg-[var(--surface-muted)]" />
                </div>
                <div className="flex flex-col gap-2.5 border-t border-[var(--line)] pt-2.5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="h-8 w-28 animate-pulse rounded-full bg-[var(--surface-muted)]" />
                  <div className="h-10 w-full animate-pulse rounded-full bg-[var(--surface-muted)] sm:w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
