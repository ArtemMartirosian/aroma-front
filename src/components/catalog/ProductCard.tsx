import Image from "next/image";
import Link from "next/link";
import { fragranceLabels, formatPrice, genderLabels } from "@/lib/dictionaries";
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
  const availabilityLabel = product.isAvailable ? "В наличии" : "Нет в наличии";

  return (
    <article className="group overflow-hidden rounded-lg border border-zinc-200 bg-[#fffefd] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_70px_rgba(24,24,27,0.14)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative m-3 aspect-[4/4.5] overflow-hidden rounded-lg bg-[#f5f1eb]">
          <div className="absolute inset-x-8 bottom-8 h-12 rounded-full bg-zinc-950/10 blur-2xl transition duration-500 group-hover:bg-rose-900/15" />
          <Image
            src={imageUrl(product.mainImage)}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-contain p-8 transition duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
            <div className="flex flex-wrap gap-2">
              {product.isNew ? (
                <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-800 shadow-sm">
                  New
                </span>
              ) : null}
              {product.isFeatured ? (
                <span className="rounded-full bg-zinc-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm">
                  Hit
                </span>
              ) : null}
            </div>
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-zinc-950 shadow-sm">
              {hasMultipleVariants ? `${variants.length} объема` : product.volume}
            </span>
          </div>

          <div className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-between gap-3 rounded-lg border border-white/70 bg-white/90 px-4 py-3 opacity-0 shadow-xl backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Подробнее
            </span>
            <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white">
              Выбрать
            </span>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5 pt-2">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.22em] text-rose-800">
            {product.brand?.name}
          </p>
          <span
            className={
              product.isAvailable
                ? "inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"
                : "inline-flex shrink-0 items-center rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-500"
            }
            aria-label={availabilityLabel}
          >
            {availabilityLabel}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 min-h-[3.5rem] text-xl font-semibold leading-7 text-zinc-950">
          <Link href={`/products/${product.slug}`} className="hover:text-rose-800">
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[3rem] text-sm leading-6 text-zinc-600">
          {product.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
            {genderLabels[product.gender]}
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
            {fragranceLabels[product.fragranceType]}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {variants.slice(0, 4).map((variant) => (
            <span
              key={variant.volume}
              className={
                variant.volume === lowestVariant.volume
                  ? "rounded-md border border-zinc-950 bg-zinc-950 px-2.5 py-2 text-center text-xs font-semibold text-white"
                  : "rounded-md border border-zinc-200 bg-white px-2.5 py-2 text-center text-xs font-semibold text-zinc-700"
              }
            >
              {variant.volume}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-zinc-100 pt-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              {hasMultipleVariants ? "Цена от" : "Цена"}
            </p>
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-2xl font-semibold tracking-tight text-zinc-950">
                {formatPrice(lowestVariant.price)}
              </p>
              {lowestVariant.oldPrice ? (
                <p className="text-sm text-zinc-400 line-through">
                  {formatPrice(lowestVariant.oldPrice)}
                </p>
              ) : null}
            </div>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="shrink-0 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-800 hover:shadow-lg"
          >
            Смотреть
          </Link>
        </div>
      </div>
    </article>
  );
}
