"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { localeLabels, SUPPORTED_LOCALES } from "@/lib/locale-config";
import { useLocale } from "@/components/catalog/LocaleProvider";
import { replaceLocaleInPathname } from "@/lib/routing";

const localeFlags = {
  am: "🇦🇲",
  ru: "🇷🇺",
  en: "🇺🇸",
} as const;

export function LanguageSwitcher() {
  const { locale, messages, setLocale, isPending } = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const search = searchParams.toString();
  const nextLocalePath = (nextLocale: (typeof SUPPORTED_LOCALES)[number]) => {
    const localizedPath = replaceLocaleInPathname(pathname || "/", nextLocale);
    return search ? `${localizedPath}?${search}` : localizedPath;
  };

  return (
    <div ref={containerRef} className="relative">
      <span className="sr-only">{messages.language.label}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        disabled={isPending}
        className="inline-flex h-10 min-w-[72px] items-center justify-between gap-2 rounded-full border border-white/8 bg-[linear-gradient(180deg,rgba(29,32,33,0.98),rgba(23,25,26,0.98))] px-3 text-sm font-semibold text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_14px_34px_rgba(0,0,0,0.28)] transition hover:border-[var(--line-strong)] disabled:opacity-70 sm:min-w-[118px] sm:gap-3 sm:px-4"
      >
        <span className="flex items-center gap-2.5">
          <span className="text-base leading-none">{localeFlags[locale]}</span>
          <span className="hidden tracking-[0.08em] sm:inline">{localeLabels[locale]}</span>
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 text-[var(--text-soft)] transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M5 7.5 10 12.5 15 7.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-[84px] overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(29,32,33,0.99),rgba(21,23,24,0.99))] p-2 shadow-[0_22px_44px_rgba(0,0,0,0.34)] backdrop-blur sm:min-w-[158px]"
        >
          {SUPPORTED_LOCALES.map((item) => (
            <button
              key={item}
              type="button"
              role="option"
              aria-selected={item === locale}
              onClick={() => {
                setLocale(item, nextLocalePath(item));
                setOpen(false);
              }}
              disabled={isPending}
              className={
                item === locale
                  ? "flex w-full items-center justify-center gap-3 rounded-[18px] bg-[var(--accent)] px-3 py-3 text-sm font-semibold text-[#171717] shadow-[0_8px_18px_rgba(195,164,111,0.26)] sm:justify-start sm:px-4"
                  : "flex w-full items-center justify-center gap-3 rounded-[18px] px-3 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-white/5 disabled:opacity-70 sm:justify-start sm:px-4"
              }
            >
              <span className="text-base leading-none">{localeFlags[item]}</span>
              <span className="hidden tracking-[0.08em] sm:inline">{localeLabels[item]}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
