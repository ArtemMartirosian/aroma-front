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
            Онлайн-каталог оригинальной парфюмерии без онлайн-оплаты: выбирайте
            аромат, связывайтесь с нами и получайте бесплатную доставку.
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
          <p className="mt-3">WhatsApp: +374 33 69 60 09</p>
          <p>Телефон: +374 33 69 60 09</p>
          <p>Instagram: @aroma__parfume</p>
          <p>Доставка: бесплатно</p>
        </div>
      </div>
    </footer>
  );
}
