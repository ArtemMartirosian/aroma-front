"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { formatPrice } from "@/lib/dictionaries";
import { imageUrl } from "@/lib/images";
import { fallbackProductImage, normalizeProductVariants } from "@/lib/product-variants";
import { Product } from "@/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const variants = useMemo(() => normalizeProductVariants(product), [product]);
  const lowestVariant = useMemo(
    () => [...variants].sort((a, b) => Number(a.price) - Number(b.price))[0],
    [variants],
  );
  const [selectedVolume, setSelectedVolume] = useState(lowestVariant.volume);
  const selectedVariant = variants.find((variant) => variant.volume === selectedVolume) ?? lowestVariant;
  const selectedImage = selectedVariant.images?.[0] ?? fallbackProductImage;
  const oldPrice = selectedVariant.oldPrice ? Number(selectedVariant.oldPrice) : undefined;
  const discount =
    oldPrice && oldPrice > Number(selectedVariant.price)
      ? Math.round((1 - Number(selectedVariant.price) / oldPrice) * 100)
      : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_14px_36px_rgba(71,58,44,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(71,58,44,0.12)] sm:rounded-[24px]">
      <div className="relative overflow-hidden bg-[var(--surface-muted)]">
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-[3.5/4] overflow-hidden sm:aspect-[4/3]"
        >
          <Image
            src={imageUrl(selectedImage)}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent_30%,rgba(28,20,14,0.08)_100%)]" />
        </Link>

        <div className="absolute left-2.5 top-2.5 z-10 flex max-w-[75%] flex-wrap gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
          {product.isFeatured ? <Badge tone="dark">հիթ</Badge> : null}
          {product.isNew ? <Badge tone="green">նոր</Badge> : null}
          {discount ? <Badge tone="red">-{discount}%</Badge> : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-[9px] font-semibold uppercase tracking-[0.26em] text-[var(--accent)] sm:text-[11px]">
            {product.brand?.name}
          </p>
        </div>

        <h3 className="mt-1.5 line-clamp-3 font-serif text-[14px] leading-[1.28] text-zinc-950 sm:mt-2.5 sm:min-h-[2.8rem] sm:text-[1.22rem] sm:leading-6">
          <Link href={`/products/${product.slug}`} className="transition group-hover:text-[var(--accent)]">
            {product.name}
          </Link>
        </h3>

        <div className="mt-2.5 h-px w-12 bg-[var(--line-strong)]" />

        <div className="mt-2.5 flex flex-wrap gap-2">
          {variants.slice(0, 4).map((variant, index) => (
            <button
              key={`${variant.volume}-${variant.price}-${index}`}
              type="button"
              onClick={() => setSelectedVolume(variant.volume)}
              className={
                variant.volume === selectedVariant.volume
                  ? "shrink-0 rounded-full bg-zinc-950 px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm sm:px-3 sm:text-xs"
                  : "shrink-0 rounded-full border border-[var(--line)] bg-[#fbf8f4] px-3 py-1.5 text-[10px] font-semibold text-zinc-700 transition hover:border-zinc-950 hover:bg-white sm:px-3 sm:text-xs"
              }
            >
              {variant.volume}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-3">
          <div className="flex flex-col gap-2.5 border-t border-[var(--line)] pt-2.5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              {oldPrice ? (
                <p className="text-[10px] text-zinc-400 line-through sm:text-[11px]">
                  {formatPrice(oldPrice)}
                </p>
              ) : null}
              <p className="mt-1 text-[17px] font-semibold leading-none tracking-tight text-zinc-950 sm:text-[1.45rem]">
                {formatPrice(selectedVariant.price)}
              </p>
            </div>

            <Link
              href={`/products/${product.slug}`}
              className="inline-flex h-10 w-full items-center justify-center rounded-full bg-zinc-950 px-3.5 text-[11px] font-semibold text-white transition hover:bg-[var(--accent)] sm:h-11 sm:w-auto sm:px-4 sm:text-xs"
            >
              Դիտել
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
      ? "bg-[var(--sage-soft)] text-[var(--sage-strong)]"
      : tone === "red"
        ? "bg-[var(--sale-soft)] text-[var(--sale-strong)]"
        : "bg-zinc-950/95 text-white";

  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold lowercase shadow-sm sm:px-3 sm:text-xs ${className}`}>
      {children}
    </span>
  );
}
