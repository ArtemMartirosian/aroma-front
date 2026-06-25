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
  const oldPrice = selectedVariant.oldPrice ? Number(selectedVariant.oldPrice) : undefined;
  const discount =
    oldPrice && oldPrice > Number(selectedVariant.price)
      ? Math.round((1 - Number(selectedVariant.price) / oldPrice) * 100)
      : 0;

  return (
    <article className="group overflow-hidden rounded-[22px] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_52px_rgba(24,24,27,0.14)]">
      <div className="relative">
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
        </Link>

        <div className="absolute left-3 top-3 z-10 flex max-w-[72%] flex-wrap gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
          {discount ? <Badge tone="red">-{discount}%</Badge> : null}
          {product.isNew ? <Badge tone="green">new</Badge> : null}
          {product.isFeatured ? <Badge tone="dark">hit</Badge> : null}
        </div>

        <div className="absolute bottom-2 left-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-zinc-800 shadow-sm sm:bottom-3 sm:left-4 sm:px-3 sm:text-xs">
          {hasMultipleVariants ? `${variants.length} объема` : product.volume}
        </div>
      </div>

      <div className="p-3.5 sm:p-5">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-800 sm:text-xs">
            {product.brand?.name}
          </p>
          <p className="truncate text-[11px] font-medium text-zinc-500 sm:shrink-0 sm:text-xs">
            {product.category?.name || fragranceLabels[product.fragranceType]}
          </p>
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-5 text-zinc-950 sm:min-h-[3.25rem] sm:text-lg sm:leading-6">
          <Link href={`/products/${product.slug}`} className="hover:text-rose-800">
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {variants.slice(0, 4).map((variant) => (
            <button
              key={variant.volume}
              type="button"
              onClick={() => setSelectedVolume(variant.volume)}
              className={
                variant.volume === selectedVariant.volume
                  ? "shrink-0 rounded-full bg-zinc-950 px-2.5 py-1.5 text-[11px] font-semibold text-white sm:px-3 sm:text-xs"
                  : "shrink-0 rounded-full border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 transition hover:border-zinc-950 sm:px-3 sm:text-xs"
              }
            >
              {variant.volume}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-[17px] font-semibold leading-none text-zinc-950 sm:text-2xl">
                {formatPrice(selectedVariant.price)}
              </p>
              {oldPrice ? (
                <p className="text-xs text-zinc-400 line-through sm:text-sm">
                  {formatPrice(oldPrice)}
                </p>
              ) : null}
            </div>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="w-full rounded-full border border-zinc-950 px-3 py-2 text-center text-xs font-semibold text-zinc-950 transition hover:bg-zinc-950 hover:text-white sm:w-auto sm:shrink-0 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            Смотреть
          </Link>
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
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold lowercase sm:px-3 sm:text-xs ${className}`}>
      {children}
    </span>
  );
}
