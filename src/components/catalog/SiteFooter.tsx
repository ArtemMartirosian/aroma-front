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
            Премиальный каталог оригинальной парфюмерии без онлайн-оплаты: выбирайте
            аромат и связывайтесь с нами удобным способом.
          </p>
        </div>
        <div className="text-sm text-zinc-300">
          <p className="font-semibold text-white">Навигация</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/catalog">Каталог</Link>
            <Link href="/brands">Бренды</Link>
            <Link href="/contacts">Контакты</Link>
          </div>
        </div>
        <div className="text-sm text-zinc-300">
          <p className="font-semibold text-white">Связь</p>
          <p className="mt-3">WhatsApp: +374 00 000 000</p>
          <p>Instagram: @aroma.perfume</p>
          <p>Email: hello@aroma.local</p>
        </div>
      </div>
    </footer>
  );
}
