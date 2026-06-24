"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/dictionaries";
import { Product, ProductVariant } from "@/types/catalog";

export function ProductVariantSelector({ product }: { product: Product }) {
  const variants = useMemo<ProductVariant[]>(
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
  const [selectedVolume, setSelectedVolume] = useState(variants[0]?.volume ?? product.volume);
  const selected = variants.find((variant) => variant.volume === selectedVolume) ?? variants[0];
  const availabilityLabel = selected?.isAvailable ? "В наличии" : "Нет в наличии";

  return (
    <div className="mt-7 border-y border-zinc-100 py-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Объем
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.volume}
                type="button"
                onClick={() => setSelectedVolume(variant.volume)}
                className={
                  selectedVolume === variant.volume
                    ? "rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-950"
                }
              >
                {variant.volume}
              </button>
            ))}
          </div>
        </div>
        <p
          className={
            selected?.isAvailable
              ? "rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
              : "rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-600"
          }
        >
          {availabilityLabel}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Цена</p>
          <div className="mt-1 flex items-baseline gap-3">
            <p className="text-4xl font-semibold tracking-tight text-zinc-950">
              {formatPrice(selected?.price ?? product.price)}
            </p>
            {selected?.oldPrice ? (
              <p className="text-lg text-zinc-400 line-through">{formatPrice(selected.oldPrice)}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
