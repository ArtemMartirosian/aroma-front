"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "/brands", label: "Бренды" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
];

export function SiteHeader() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(255,253,249,0.9)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-[0.18em] text-zinc-950">
          AROMA
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-700 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[var(--accent)]">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contacts"
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
        >
          Связаться
        </Link>
      </div>
    </header>
  );
}
