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
    <article className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_70px_rgba(24,24,27,0.14)]">
      <div className="grid min-h-[330px] grid-cols-[42%_58%]">
        <Link
          href={`/products/${product.slug}`}
          className="relative overflow-hidden bg-zinc-950"
        >
          <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(255,255,255,0.10),transparent_42%)]" />
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
            {product.isNew ? (
              <span className="w-fit rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-rose-800">
                New
              </span>
            ) : null}
            {product.isFeatured ? (
              <span className="w-fit rounded-full bg-rose-800 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                Hit
              </span>
            ) : null}
          </div>
          <p className="absolute bottom-4 left-3 z-10 origin-left -rotate-90 text-[10px] font-semibold uppercase tracking-[0.36em] text-white/45">
            Aroma
          </p>
          <div className="absolute inset-x-3 bottom-5 top-10">
            <Image
              src={imageUrl(product.mainImage)}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 16vw, (min-width: 768px) 24vw, 42vw"
              className="object-contain transition duration-700 group-hover:scale-110"
            />
          </div>
        </Link>

        <div className="flex min-w-0 flex-col p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-800">
                {product.brand?.name}
              </p>
              <h3 className="mt-2 line-clamp-3 text-xl font-semibold leading-7 text-zinc-950">
                <Link href={`/products/${product.slug}`} className="hover:text-rose-800">
                  {product.name}
                </Link>
              </h3>
            </div>
            <span className="shrink-0 rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
              {hasMultipleVariants ? `${variants.length}x` : product.volume}
            </span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
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

          <div className="mt-auto pt-5">
            <p
              className={
                product.isAvailable
                  ? "text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700"
                  : "text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500"
              }
            >
              {availabilityLabel}
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
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
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-zinc-100 bg-[#fbfaf8] p-4">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
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
        <Link
          href={`/products/${product.slug}`}
          className="shrink-0 rounded-full bg-rose-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-950"
        >
          Смотреть
        </Link>
      </div>
    </article>
  );
}
