"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/catalog/LanguageSwitcher";
import { useLocale } from "@/components/catalog/LocaleProvider";
import { localizePath } from "@/lib/routing";

export function SiteHeader() {
  const pathname = usePathname();
  const { locale, messages } = useLocale();

  const links = [
    { href: localizePath(locale, "/catalog"), label: messages.nav.catalog },
    { href: localizePath(locale, "/brands"), label: messages.nav.brands },
    { href: localizePath(locale, "/about"), label: messages.nav.about },
    { href: localizePath(locale, "/contacts"), label: messages.nav.contacts },
  ];

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(14,16,17,0.84)] backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center  px-4 md:pl-6 pl-8 py-5 sm:justify-between sm:px-6 lg:px-8">
        <Link href={localizePath(locale, "/")} className="shrink-0 flex items-center gap-7 sm:gap-6">
          <Image
            src="/images/aroma-logo.png"
            alt="Aroma Parfume"
            width={280}
            height={280}
            priority
            className="h-14 w-auto scale-200 sm:scale-150 sm:h-16"
          />
          <span className="flex flex-col leading-none">
            <span className="text-[0.95rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] text-[0.95rem]">
              Parfume
            </span>
            <span className="mt-1 text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)] text-[0.95rem]">
              &amp; cosmetics
            </span>
               <span className="mt-1 text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)] text-[0.95rem]">
              &amp; accessoires
            </span>
          </span>
        </Link>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 md:hidden">
          <LanguageSwitcher />
        </div>
        <div className="ml-auto hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-8 text-sm font-medium text-[var(--text-soft)]">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[var(--accent-strong)]">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
              {/*<Link*/}
              {/*    href={localizePath(locale, "/contacts")}*/}
              {/*    className="rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"*/}
              {/*>*/}
              {/*    {messages.nav.contactShort}*/}
              {/*</Link>*/}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
