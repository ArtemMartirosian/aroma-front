"use client";

import Image from "next/image";
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
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4 sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 flex items-center gap-6">
          <span className="text-[0.95rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] sm:text-[1.05rem]">
            Aroma
          </span>
          <Image
            src="/images/aroma-logo.png"
            alt="Aroma Parfume"
            width={280}
            height={280}
            priority
            className="h-14 w-auto scale-150 sm:h-16"
          />
          <span className="flex flex-col leading-none">
            <span className="text-[0.95rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] text-[0.95rem]">
              Parfume
            </span>
            <span className="mt-1 text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)] text-[0.95rem]">
              &amp; cosmetics
            </span>
          </span>
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
          className="md:flex hidden rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
        >
          Կապ
        </Link>
      </div>
    </header>
  );
}
