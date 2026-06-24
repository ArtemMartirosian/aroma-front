import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { fragranceLabels, formatPrice } from "@/lib/dictionaries";
import { imageUrl } from "@/lib/images";
import { Product } from "@/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const variants = product.variants?.length
    ? product.variants
    : [
        {
          volume: product.volume,
          price: product.price,
          oldPrice: product.oldPrice,
          isAvailable: product.isAvailable,
        },
      ];
  const lowestVariant = [...variants].sort((a, b) => Number(a.price) - Number(b.price))[0];
  const hasMultipleVariants = variants.length > 1;
  const oldPrice = lowestVariant.oldPrice ? Number(lowestVariant.oldPrice) : undefined;
  const discount =
    oldPrice && oldPrice > Number(lowestVariant.price)
      ? Math.round((1 - Number(lowestVariant.price) / oldPrice) * 100)
      : 0;

  return (
    <article className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(24,24,27,0.12)]">
      <Link
        href={`/products/${product.slug}`}
        className="relative m-3 block aspect-[1.08] overflow-hidden rounded-lg bg-[#f5f3ef]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_32%,rgba(255,255,255,0.98),rgba(245,243,239,0.52)_48%,rgba(224,216,203,0.45)_100%)]" />
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          {product.isNew ? <Badge tone="green">new</Badge> : null}
          {product.isFeatured ? <Badge tone="dark">hit</Badge> : null}
          {discount ? <Badge tone="red">-{discount}%</Badge> : null}
        </div>
        <span className="absolute right-4 top-3 z-10 text-3xl font-light leading-none text-zinc-400 transition group-hover:text-rose-700">
          ♡
        </span>
        <Image
          src={imageUrl(product.mainImage)}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-contain p-8 transition duration-700 group-hover:scale-105"
        />
      </Link>

      <div className="px-5 pb-5 pt-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-rose-800">
            {product.brand?.name}
          </p>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-600">
            {hasMultipleVariants ? `${variants.length} объема` : product.volume}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 min-h-[3.5rem] text-xl font-semibold leading-7 text-zinc-950">
          <Link href={`/products/${product.slug}`} className="hover:text-rose-800">
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="truncate text-sm text-zinc-500">
            {product.category?.name || fragranceLabels[product.fragranceType]}
          </p>
          <span className="shrink-0 text-sm text-[#ff7a50]">★★★★★</span>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto">
          {variants.slice(0, 4).map((variant) => (
            <span
              key={variant.volume}
              className={
                variant.volume === lowestVariant.volume
                  ? "shrink-0 rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white"
                  : "shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700"
              }
            >
              {variant.volume}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-zinc-100 pt-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              {hasMultipleVariants ? "Цена от" : "Цена"}
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <p className="text-2xl font-semibold text-zinc-950">
                {formatPrice(lowestVariant.price)}
              </p>
              {oldPrice ? (
                <p className="text-sm text-zinc-400 line-through">
                  {formatPrice(oldPrice)}
                </p>
              ) : null}
            </div>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="shrink-0 rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800"
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
    <span className={`rounded-full px-3 py-1 text-xs font-semibold lowercase ${className}`}>
      {children}
    </span>
  );
}
