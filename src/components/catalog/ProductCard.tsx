import Image from "next/image";
import Link from "next/link";
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
  const oldPrice = lowestVariant.oldPrice ? Number(lowestVariant.oldPrice) : undefined;
  const discount =
    oldPrice && oldPrice > Number(lowestVariant.price)
      ? Math.round((1 - Number(lowestVariant.price) / oldPrice) * 100)
      : 0;

  return (
    <article className="group bg-white text-center transition duration-300 hover:-translate-y-1">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[0.94] overflow-hidden bg-[#f6f6f6]"
      >
        <div className="absolute left-6 top-6 z-10 flex flex-col items-start gap-2">
          {product.isNew ? (
            <span className="rounded-full bg-[#86c582] px-5 py-1.5 text-lg leading-none text-white">
              new
            </span>
          ) : null}
          {product.isFeatured ? (
            <span className="rounded-full bg-[#c6a988] px-5 py-1.5 text-lg leading-none text-white">
              hit
            </span>
          ) : null}
          {discount ? (
            <span className="rounded-full bg-[#de6468] px-5 py-1.5 text-lg leading-none text-white">
              sale
            </span>
          ) : null}
        </div>

        <span className="absolute right-7 top-6 z-10 text-4xl font-light leading-none text-zinc-400 transition group-hover:text-rose-700">
          ♡
        </span>

        <Image
          src={imageUrl(product.mainImage)}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-contain p-12 transition duration-700 group-hover:scale-105"
        />
      </Link>

      <div className="px-5 pb-8 pt-7">
        <p className="text-2xl text-zinc-500">
          {product.category?.name || fragranceLabels[product.fragranceType]}
        </p>

        <h3 className="mx-auto mt-4 line-clamp-3 min-h-[5.25rem] max-w-[360px] text-2xl font-bold uppercase leading-7 text-zinc-900">
          <Link href={`/products/${product.slug}`} className="hover:text-rose-800">
            {product.name}
          </Link>
        </h3>

        <div className="mt-5 text-2xl leading-none tracking-[0.08em] text-[#ff7a50]">
          ★★★★★
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {variants.slice(0, 4).map((variant) => (
            <span
              key={variant.volume}
              className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600"
            >
              {variant.volume}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-baseline justify-center gap-4">
          <p className="text-2xl font-semibold text-zinc-950">
            {formatPrice(lowestVariant.price)}
          </p>
          {oldPrice ? (
            <p className="text-xl text-zinc-400 line-through">
              {formatPrice(oldPrice)}
            </p>
          ) : null}
          {discount ? (
            <p className="text-xl font-semibold italic text-[#ff7449]">
              -{discount}%
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
