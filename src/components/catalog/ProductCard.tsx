import Image from "next/image";
import Link from "next/link";
import { fragranceLabels, formatPrice, genderLabels } from "@/lib/dictionaries";
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
          stockStatus: product.stockStatus,
        },
      ];
  const lowestVariant = [...variants].sort((a, b) => Number(a.price) - Number(b.price))[0];

  return (
    <article className="group relative min-h-[560px] overflow-hidden rounded-lg bg-zinc-950 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(24,24,27,0.22)]">
      <Link href={`/products/${product.slug}`} className="absolute inset-0">
        <Image
          src={product.mainImage || "/images/perfume-hero.png"}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />
      </Link>

      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-white/5" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5">
        <div className="flex flex-wrap gap-2">
          {product.isNew ? (
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-800 shadow-sm">
              New
            </span>
          ) : null}
          {product.isFeatured ? (
            <span className="rounded-full bg-zinc-950/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm ring-1 ring-white/20">
              Popular
            </span>
          ) : null}
        </div>
        <div className="rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-zinc-950 shadow-sm">
          {variants.length > 1 ? `${variants.length} объема` : product.volume}
        </div>
      </div>

      <div className="absolute left-5 top-24 hidden origin-left -rotate-90 text-[11px] font-semibold uppercase tracking-[0.38em] text-white/70 sm:block">
        {product.brand?.name}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="rounded-lg border border-white/25 bg-white/92 p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-800">
                {product.brand?.name}
              </p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight text-zinc-950">
                {product.name}
              </h3>
            </div>
            <span
              className={
                product.isAvailable
                  ? "mt-1 h-3 w-3 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.12)]"
                  : "mt-1 h-3 w-3 shrink-0 rounded-full bg-zinc-300"
              }
              aria-label={product.stockStatus}
            />
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
            {product.shortDescription}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
            <span className="rounded-full bg-zinc-100 px-3 py-1">{genderLabels[product.gender]}</span>
            <span className="rounded-full bg-zinc-100 px-3 py-1">
              {fragranceLabels[product.fragranceType]}
            </span>
          </div>

          <div className="mt-4 flex gap-2">
            {variants.slice(0, 4).map((variant) => (
              <span
                key={variant.volume}
                className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-800 shadow-sm"
              >
                {variant.volume}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-end justify-between gap-4 border-t border-zinc-200 pt-4">
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold tracking-tight text-zinc-950">
                  {variants.length > 1 ? `от ${formatPrice(lowestVariant.price)}` : formatPrice(product.price)}
                </p>
                {lowestVariant.oldPrice ? (
                  <p className="text-sm text-zinc-400 line-through">{formatPrice(lowestVariant.oldPrice)}</p>
                ) : null}
              </div>
              <p className={product.isAvailable ? "mt-1 text-sm text-emerald-700" : "mt-1 text-sm text-zinc-500"}>
                {product.stockStatus}
              </p>
            </div>
            <Link
              href={`/products/${product.slug}`}
              className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
            >
              Смотреть
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10 transition group-hover:ring-white/35" />
    </article>
  );
}
