"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearToken } from "@/components/admin/auth";

const links = [
  { href: "/admin/dashboard", label: "Վահանակ" },
  { href: "/admin/products", label: "Ապրանքներ" },
  { href: "/admin/brands", label: "Բրենդներ" },
  { href: "/admin/categories", label: "Կատեգորիաներ" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <p className="px-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Ադմին
        </p>
        <nav className="mt-4 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => {
            clearToken();
            router.replace("/admin/login");
          }}
          className="mt-4 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950"
        >
          Դուրս գալ
        </button>
      </aside>
      <section>{children}</section>
    </div>
  );
}
