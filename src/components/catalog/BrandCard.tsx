"use client";

import Link from "next/link";
import { imageUrl } from "@/lib/images";
import { Brand } from "@/types/catalog";

type BrandCardProps = {
  brand: Brand;
  variant?: "compact" | "showcase";
};

export function BrandCard({ brand, variant = "compact" }: BrandCardProps) {
  const href = `/catalog?brand=${brand.slug}`;
  const logo = brand.logo || brand.name.slice(0, 2).toUpperCase();
  const description =
    brand.description || "Ընտրված բույրերի հավաքածու՝ արտահայտիչ բնավորությամբ և գեղեցիկ շլեյֆով։";
  const productCount = brand.productCount ?? brand.products?.length ?? 0;

  if (variant === "showcase") {
    return (
      <Link
        href={href}
        className="group overflow-hidden rounded-[30px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(21,24,25,0.98),rgba(29,33,34,0.94))] shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_34px_90px_rgba(0,0,0,0.36)]"
      >
        <div className="grid lg:grid-cols-[240px_1fr]">
          <div className="relative min-h-[260px] overflow-hidden bg-[var(--surface-muted)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(brand.image)}
              alt={brand.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.4))]" />
            <div className="absolute left-5 top-5 rounded-full border border-[var(--line-strong)] bg-[rgba(14,16,17,0.76)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)] shadow-sm backdrop-blur">
              {logo}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">Տուն</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-[var(--foreground)] sm:text-[2.2rem]">
                {brand.name}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text-soft)]">
                  {productCount} ապրանք
                </span>
                <span className="rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text-soft)]">
                  Լյուքս բույրեր
                </span>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] transition group-hover:text-[var(--accent-strong)]">
                Դիտել բույրերը
                <ArrowMark />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-[26px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(21,24,25,0.98)_0%,rgba(29,33,34,0.96)_100%)] shadow-[0_18px_45px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_28px_70px_rgba(0,0,0,0.32)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-muted)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl(brand.image)}
          alt={brand.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),transparent_42%,rgba(0,0,0,0.52))]" />
        <div className="absolute left-4 top-4 rounded-full border border-[var(--line-strong)] bg-[rgba(14,16,17,0.76)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)] shadow-sm">
          {logo}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/75">Լյուքս բրենդ</p>
          <p className="mt-2 font-serif text-2xl leading-none text-white">{brand.name}</p>
        </div>
      </div>

      <div className="bg-[var(--surface-elevated)] p-4 sm:p-4">
          <p className="line-clamp-2 min-h-[2.7rem] text-sm leading-6 text-[var(--text-soft)] sm:min-h-[3rem]">
            {description}
          </p>
        <div className="mt-4 flex flex-col items-start gap-3 border-t border-[var(--line)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text-soft)]">
            {productCount} ապրանք
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] transition group-hover:text-[var(--accent-strong)]">
            <span className="md:hidden">Բացել</span>
            <span className="hidden md:inline">Կատալոգ</span>
            <ArrowMark />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArrowMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
      <path
        d="M4.5 10h10m0 0-4-4m4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
