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
  const hasMultipleVariants = variants.length > 1;
  const oldPrice = selectedVariant.oldPrice ? Number(selectedVariant.oldPrice) : undefined;
  const discount =
    oldPrice && oldPrice > Number(selectedVariant.price)
      ? Math.round((1 - Number(selectedVariant.price) / oldPrice) * 100)
      : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-[#eee2d4] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,244,238,0.98))] shadow-[0_18px_46px_rgba(109,80,53,0.10)] ring-1 ring-[#f4ece3] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_64px_rgba(109,80,53,0.14)]">
      <div className="relative overflow-hidden bg-[#f7efe6]">
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-[247/264] overflow-hidden bg-white"
        >
          <Image
            src={imageUrl(product.mainImage)}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-center transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f7efe6]/55 to-transparent" />
        </Link>

        <div className="absolute left-3 top-3 z-10 flex max-w-[72%] flex-wrap gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
          {discount ? <Badge tone="red">-{discount}%</Badge> : null}
          {product.isNew ? <Badge tone="green">new</Badge> : null}
          {product.isFeatured ? <Badge tone="dark">hit</Badge> : null}
        </div>

        <div className="absolute bottom-2 left-3 z-10 rounded-full border border-white/90 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-zinc-800 shadow-sm sm:bottom-3 sm:left-4 sm:px-3 sm:text-xs">
          {hasMultipleVariants ? `${variants.length} объема` : product.volume}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9d3f30] sm:text-xs">
          {product.brand?.name}
        </p>

        <h3 className="mt-2 line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-5 text-zinc-950 sm:min-h-[3rem] sm:text-[1.28rem] sm:leading-7">
          <Link href={`/products/${product.slug}`} className="transition group-hover:text-[#9d3f30]">
            {product.name}
          </Link>
        </h3>

        <div className="mt-4 rounded-[20px] bg-white/78 p-2.5 ring-1 ring-[#efe4d8] backdrop-blur sm:p-3">
          <div className="flex flex-wrap gap-2">
            {variants.slice(0, 4).map((variant) => (
              <button
                key={variant.volume}
                type="button"
                onClick={() => setSelectedVolume(variant.volume)}
                className={
                  variant.volume === selectedVariant.volume
                    ? "shrink-0 rounded-full bg-zinc-950 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm sm:px-3 sm:text-xs"
                    : "shrink-0 rounded-full border border-[#e6d8c8] bg-[#fffdfa] px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 transition hover:border-zinc-950 hover:bg-white sm:px-3 sm:text-xs"
                }
              >
                {variant.volume}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="rounded-[22px] border border-white/90 bg-white/90 p-3 shadow-[0_10px_24px_rgba(24,24,27,0.05)] sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 sm:text-[11px]">
                  Цена за {selectedVariant.volume}
                </p>
                <div className="mt-2 flex flex-wrap items-end gap-2">
                  <p className="text-[18px] font-semibold leading-none text-zinc-950 sm:text-[1.7rem]">
                    {formatPrice(selectedVariant.price)}
                  </p>
                  {oldPrice ? (
                    <p className="text-xs text-zinc-400 line-through sm:text-sm">
                      {formatPrice(oldPrice)}
                    </p>
                  ) : null}
                </div>
              </div>
              {discount ? (
                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-semibold text-rose-700 sm:text-[11px]">
                  -{discount}%
                </span>
              ) : null}
            </div>

            <Link
              href={`/products/${product.slug}`}
              className="mt-3 flex w-full items-center justify-center rounded-full bg-zinc-950 px-3 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-[#9d3f30] sm:mt-4 sm:text-sm"
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
