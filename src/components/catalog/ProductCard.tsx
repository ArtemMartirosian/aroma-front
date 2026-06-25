"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { formatPrice } from "@/lib/dictionaries";
import { imageUrl } from "@/lib/images";
import { Product } from "@/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const variants = useMemo(
    () =>
      product.variants?.length
        ? product.variants
        : [
            {
              volume: product.volume,
              price: product.price,
              oldPrice: product.oldPrice,
              isAvailable: product.isAvailable,
            },
          ],
    [product],
  );
  const lowestVariant = useMemo(
    () => [...variants].sort((a, b) => Number(a.price) - Number(b.price))[0],
    [variants],
  );
  const [selectedVolume, setSelectedVolume] = useState(lowestVariant.volume);
  const selectedVariant = variants.find((variant) => variant.volume === selectedVolume) ?? lowestVariant;
  const oldPrice = selectedVariant.oldPrice ? Number(selectedVariant.oldPrice) : undefined;
  const discount =
    oldPrice && oldPrice > Number(selectedVariant.price)
      ? Math.round((1 - Number(selectedVariant.price) / oldPrice) * 100)
      : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#e9ddcf] bg-white shadow-[0_14px_36px_rgba(83,56,30,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(83,56,30,0.12)]">
      <div className="relative overflow-hidden bg-[#f4ece4]">
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-[4/3] overflow-hidden"
        >
          <Image
            src={imageUrl(product.mainImage)}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent_30%,rgba(28,20,14,0.08)_100%)]" />
        </Link>

        <div className="absolute left-3 top-3 z-10 flex max-w-[75%] flex-wrap gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
          {product.isFeatured ? <Badge tone="dark">hit</Badge> : null}
          {product.isNew ? <Badge tone="green">new</Badge> : null}
          {discount ? <Badge tone="red">-{discount}%</Badge> : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8f3b2d] sm:text-[11px]">
            {product.brand?.name}
          </p>
          <span className="shrink-0 rounded-full border border-[#e7dbce] bg-[#fbf7f2] px-2.5 py-1 text-[10px] font-semibold text-zinc-700 sm:text-[11px]">
            {selectedVariant.volume}
          </span>
        </div>

        <h3 className="mt-2.5 line-clamp-2 min-h-[2.55rem] font-serif text-[15px] leading-5 text-zinc-950 sm:min-h-[2.8rem] sm:text-[1.22rem] sm:leading-6">
          <Link href={`/products/${product.slug}`} className="transition group-hover:text-[#8f3b2d]">
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 h-px w-10 bg-[#d9c8b8]" />

        <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
          {variants.slice(0, 4).map((variant) => (
            <button
              key={variant.volume}
              type="button"
              onClick={() => setSelectedVolume(variant.volume)}
              className={
                variant.volume === selectedVariant.volume
                  ? "shrink-0 rounded-full bg-zinc-950 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm sm:px-3 sm:text-xs"
                  : "shrink-0 rounded-full border border-[#ded2c4] bg-[#fbf8f4] px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 transition hover:border-zinc-950 hover:bg-white sm:px-3 sm:text-xs"
              }
            >
              {variant.volume}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3 border-t border-[#eadfce] pt-3">
            <div className="min-w-0">
              {oldPrice ? (
                <p className="text-[10px] text-zinc-400 line-through sm:text-[11px]">
                  {formatPrice(oldPrice)}
                </p>
              ) : null}
              <p className="mt-1 text-[18px] font-semibold leading-none tracking-tight text-zinc-950 sm:text-[1.45rem]">
                {formatPrice(selectedVariant.price)}
              </p>
            </div>

            <Link
              href={`/products/${product.slug}`}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 px-3.5 text-[11px] font-semibold text-white transition hover:bg-[#8f3b2d] sm:h-11 sm:px-4 sm:text-xs"
            >
              Смотреть
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function Badge({ children, tone }: { children: ReactNode; tone: "green" | "dark" | "red" }) {
  const className =
    tone === "green"
      ? "bg-emerald-100/95 text-emerald-800"
      : tone === "red"
        ? "bg-rose-100/95 text-rose-800"
        : "bg-zinc-950/95 text-white";

  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold lowercase shadow-sm sm:px-3 sm:text-xs ${className}`}>
      {children}
    </span>
  );
}
