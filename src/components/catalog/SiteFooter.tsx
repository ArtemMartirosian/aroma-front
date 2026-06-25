"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="text-xl font-semibold tracking-[0.18em]">AROMA</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-300">
            Օրիգինալ օծանելիքի օնլայն կատալոգ առանց օնլայն վճարման․ ընտրեք
            բույրը, կապվեք մեզ հետ և ստացեք անվճար առաքում։
          </p>
        </div>
        <div className="text-sm text-zinc-300">
          <p className="font-semibold text-white">Նավիգացիա</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/catalog">Կատալոգ</Link>
            <Link href="/brands">Բրենդներ</Link>
            <Link href="/contacts">Կոնտակտներ</Link>
          </div>
        </div>
        <div className="text-sm text-zinc-300">
          <p className="font-semibold text-white">Կապ</p>
          <p className="mt-3">WhatsApp: +374 33 69 60 09</p>
          <p>Հեռախոս՝ +374 33 69 60 09</p>
          <p>Instagram: @aroma__parfume</p>
          <p>Առաքում՝ անվճար</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-zinc-400 sm:px-6 sm:text-sm lg:px-8">
          <p>
            Կայքի մշակումը՝{" "}
            <a
              href="https://digitalize.am"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-white transition hover:text-zinc-300"
            >
              Digitalize
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
