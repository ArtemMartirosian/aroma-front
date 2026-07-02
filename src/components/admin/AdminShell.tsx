"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/components/admin/auth";
import { adminMessages } from "@/lib/admin-copy";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const messages = adminMessages;
  const links = [
    { href: "/admin/dashboard", label: messages.shell.dashboard },
    { href: "/admin/products", label: messages.shell.products },
    { href: "/admin/brands", label: messages.shell.brands },
    { href: "/admin/categories", label: messages.shell.categories },
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="admin-panel h-fit rounded-[24px] p-4">
        <p className="admin-muted px-3 text-sm font-semibold uppercase tracking-[0.18em]">
          {messages.shell.title}
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
          {messages.shell.logout}
        </button>
      </aside>
      <section>{children}</section>
    </div>
  );
}
