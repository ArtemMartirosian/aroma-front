"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/catalog", label: "Կատալոգ" },
  { href: "/brands", label: "Բրենդներ" },
  { href: "/about", label: "Մեր մասին" },
  { href: "/contacts", label: "Կոնտակտներ" },
];

export function SiteHeader() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(14,16,17,0.84)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-[0.18em] text-[var(--foreground)]">
          AROMA
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--text-soft)] md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[var(--accent-strong)]">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contacts"
          className="rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
        >
          Կապ
        </Link>
      </div>
    </header>
  );
}
