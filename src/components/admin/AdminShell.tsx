"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/components/admin/auth";

const links = [
  { href: "/admin/dashboard", label: "Վահանակ" },
  { href: "/admin/products", label: "Ապրանքներ" },
  { href: "/admin/brands", label: "Բրենդներ" },
  { href: "/admin/categories", label: "Կատեգորիաներ" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="admin-panel h-fit rounded-[24px] p-4">
        <p className="admin-muted px-3 text-sm font-semibold uppercase tracking-[0.18em]">
          Ադմին
        </p>
        <nav className="mt-4 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "rounded-xl border border-black bg-black px-3 py-2.5 text-sm font-semibold text-white transition"
                  : "admin-text rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-blue-50 hover:text-blue-600"
              }
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
          className="admin-button-secondary mt-4 w-full rounded-xl px-3 py-2.5 text-sm font-semibold transition"
        >
          Դուրս գալ
        </button>
      </aside>
      <section>{children}</section>
    </div>
  );
}
