"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-[var(--line)] bg-[#0b0d0e] pb-[calc(env(safe-area-inset-bottom)+5.75rem)] text-[var(--foreground)] md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[var(--line)] bg-black/90 shadow-[0_10px_28px_rgba(0,0,0,0.25)]">
              <Image
                src="/images/aroma-logo.png"
                alt=""
                aria-hidden="true"
                fill
                sizes="64px"
                className="object-cover scale-[2.15]"
                style={{ objectPosition: "50% 28%" }}
              />
            </div>
            <span className="min-w-0 text-[1.3rem] font-semibold uppercase tracking-[0.24em] text-[var(--foreground)]">
              Aroma Parfume
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--text-soft)]">
            Օրիգինալ օծանելիքի օնլայն կատալոգ առանց օնլայն վճարման․ ընտրեք
            բույրը, կապվեք մեզ հետ և ստացեք անվճար առաքում։
          </p>
        </div>
        <div className="text-sm text-[var(--text-soft)]">
          <p className="font-semibold text-[var(--foreground)]">Նավիգացիա</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/catalog">Կատալոգ</Link>
            <Link href="/brands">Բրենդներ</Link>
            <Link href="/about">Մեր մասին</Link>
            <Link href="/contacts">Կոնտակտներ</Link>
          </div>
        </div>
        <div className="text-sm text-[var(--text-soft)]">
          <p className="font-semibold text-[var(--foreground)]">Կապ</p>
          <p className="mt-3">WhatsApp: +374 33 69 60 09</p>
          <p>Հեռախոս՝ +374 33 69 60 09</p>
          <p>Instagram: @aroma__parfume</p>
          <p>Առաքում՝ անվճար</p>
        </div>
      </div>
      <div className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-[var(--text-muted)] sm:px-6 sm:text-sm lg:px-8">
          <p>
            Կայքի մշակումը՝{" "}
            <a
              href="https://digitalize.am"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[var(--accent-strong)] transition hover:text-[var(--accent)]"
            >
              Digitalize
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
