import Image from "next/image";
import Link from "next/link";
import { fragranceLabels, formatPrice, genderLabels } from "@/lib/dictionaries";
import { Product } from "@/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <Image
          src={product.mainImage || "/images/perfume-hero.png"}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.isNew ? (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-rose-700 shadow">
              New
            </span>
          ) : null}
          {product.isFeatured ? (
            <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white shadow">
              Popular
            </span>
          ) : null}
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
            {product.brand?.name}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-zinc-950">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
            {product.shortDescription}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
          <span className="rounded-full bg-zinc-100 px-3 py-1">{product.volume}</span>
          <span className="rounded-full bg-zinc-100 px-3 py-1">
            {genderLabels[product.gender]}
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1">
            {fragranceLabels[product.fragranceType]}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
          <div>
            <p className="text-lg font-semibold text-zinc-950">{formatPrice(product.price)}</p>
            <p className={product.isAvailable ? "text-sm text-emerald-700" : "text-sm text-zinc-500"}>
              {product.stockStatus}
            </p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}
