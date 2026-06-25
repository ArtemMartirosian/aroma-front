"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { fragranceLabels, formatPrice } from "@/lib/dictionaries";
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
  const categoryLabel = product.category?.name || fragranceLabels[product.fragranceType];
  const oldPrice = selectedVariant.oldPrice ? Number(selectedVariant.oldPrice) : undefined;
  const discount =
    oldPrice && oldPrice > Number(selectedVariant.price)
      ? Math.round((1 - Number(selectedVariant.price) / oldPrice) * 100)
      : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white/95 shadow-[0_18px_44px_rgba(120,88,58,0.12)] ring-1 ring-zinc-950/4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(120,88,58,0.16)]">
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),rgba(246,238,230,0.95))]">
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#f5eee7]/55 via-transparent to-white/12" />
        </Link>

        <div className="absolute left-3 top-3 z-10 flex max-w-[72%] flex-wrap gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
          {discount ? <Badge tone="red">-{discount}%</Badge> : null}
          {product.isNew ? <Badge tone="green">new</Badge> : null}
          {product.isFeatured ? <Badge tone="dark">hit</Badge> : null}
        </div>

        <div className="absolute bottom-2 left-3 z-10 rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-zinc-800 shadow-sm sm:bottom-3 sm:left-4 sm:px-3 sm:text-xs">
          {hasMultipleVariants ? `${variants.length} объема` : product.volume}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <div className="flex items-center gap-2">
          <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-800 sm:text-xs">
            {product.brand?.name}
          </p>
          <span className="h-1 w-1 shrink-0 rounded-full bg-zinc-300" />
          <p className="truncate text-[11px] font-medium text-zinc-500 sm:text-xs">{categoryLabel}</p>
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-5 text-zinc-950 sm:min-h-[3.25rem] sm:text-[1.35rem] sm:leading-7">
          <Link href={`/products/${product.slug}`} className="hover:text-rose-800">
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-zinc-500 sm:text-sm">
          {product.shortDescription || product.description}
        </p>

        <div className="mt-4 rounded-[20px] bg-[#faf6f1] p-2.5 ring-1 ring-[#efe5da] sm:p-3">
          <div className="flex flex-wrap gap-2">
          {variants.slice(0, 4).map((variant) => (
            <button
              key={variant.volume}
              type="button"
              onClick={() => setSelectedVolume(variant.volume)}
              className={
                variant.volume === selectedVariant.volume
                  ? "shrink-0 rounded-full bg-zinc-950 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm sm:px-3 sm:text-xs"
                  : "shrink-0 rounded-full border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 transition hover:border-zinc-950 hover:bg-white sm:px-3 sm:text-xs"
              }
            >
              {variant.volume}
            </button>
          ))}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="rounded-[20px] border border-zinc-200/80 bg-white p-3 shadow-[0_12px_30px_rgba(24,24,27,0.05)] sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 sm:text-[11px]">
                  Выбранный объем
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-900 sm:text-base">
                  {selectedVariant.volume}
                </p>
              </div>
              {discount ? (
                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-semibold text-rose-700 sm:text-[11px]">
                  Экономия {discount}%
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-end gap-2">
              <p className="text-[18px] font-semibold leading-none text-zinc-950 sm:text-[1.7rem]">
                {formatPrice(selectedVariant.price)}
              </p>
              {oldPrice ? (
                <p className="text-xs text-zinc-400 line-through sm:text-sm">
                  {formatPrice(oldPrice)}
                </p>
              ) : null}
            </div>

            <Link
              href={`/products/${product.slug}`}
              className="mt-3 flex w-full items-center justify-center rounded-full bg-zinc-950 px-3 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-rose-800 sm:mt-4 sm:text-sm"
            >
              Смотреть товар
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
      ? "bg-emerald-100 text-emerald-800"
      : tone === "red"
        ? "bg-rose-100 text-rose-800"
        : "bg-zinc-950 text-white";

  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold lowercase shadow-sm sm:px-3 sm:text-xs ${className}`}>
      {children}
    </span>
  );
}
