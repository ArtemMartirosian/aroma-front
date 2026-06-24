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
    <article className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_22px_60px_rgba(24,24,27,0.13)]">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/4.6] overflow-hidden bg-[#f4f1ed]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.95),rgba(244,241,237,0.18)_45%,rgba(24,24,27,0.08)_100%)]" />
        <Image
          src={imageUrl(product.mainImage)}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover mix-blend-multiply transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          <div className="flex flex-wrap gap-2">
            {product.isNew ? (
              <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-800 shadow-sm">
                New
              </span>
            ) : null}
            {product.isFeatured ? (
              <span className="rounded-full bg-zinc-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm">
                Hit
              </span>
            ) : null}
          </div>
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-zinc-950 shadow-sm">
            {hasMultipleVariants ? `${variants.length} объема` : product.volume}
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4 translate-y-3 rounded-lg bg-white/90 px-4 py-3 opacity-0 shadow-xl backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Быстрый просмотр
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-900">
            Открыть аромат и выбрать объем
          </p>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-800">
              {product.brand?.name}
            </p>
            <h3 className="mt-2 line-clamp-2 min-h-[3.5rem] text-xl font-semibold leading-7 text-zinc-950">
              {product.name}
            </h3>
          </div>
          <span
            className={
              product.isAvailable
                ? "mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.12)]"
                : "mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-zinc-300"
            }
            aria-label={availabilityLabel}
          />
        </div>

        <p className="mt-3 line-clamp-2 min-h-[3rem] text-sm leading-6 text-zinc-600">
          {product.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
            {genderLabels[product.gender]}
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
            {fragranceLabels[product.fragranceType]}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {variants.slice(0, 4).map((variant) => (
            <span
              key={variant.volume}
              className={
                variant.volume === lowestVariant.volume
                  ? "rounded-md border border-zinc-950 bg-zinc-950 px-2.5 py-1 text-xs font-semibold text-white"
                  : "rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700"
              }
            >
              {variant.volume}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-zinc-100 pt-4">
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-2xl font-semibold tracking-tight text-zinc-950">
                {hasMultipleVariants ? `от ${formatPrice(lowestVariant.price)}` : formatPrice(product.price)}
              </p>
              {lowestVariant.oldPrice ? (
                <p className="text-sm text-zinc-400 line-through">
                  {formatPrice(lowestVariant.oldPrice)}
                </p>
              ) : null}
            </div>
            <p className={product.isAvailable ? "mt-1 text-sm text-emerald-700" : "mt-1 text-sm text-zinc-500"}>
              {availabilityLabel}
            </p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="shrink-0 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
          >
            Смотреть
          </Link>
        </div>
      </div>

    </article>
  );
}
