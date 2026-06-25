"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/dictionaries";
import { normalizeProductVariants } from "@/lib/product-variants";
import { Product, ProductVariant } from "@/types/catalog";

export function ProductVariantSelector({ product }: { product: Product }) {
  const variants = useMemo<ProductVariant[]>(() => normalizeProductVariants(product), [product]);
  const [selectedVolume, setSelectedVolume] = useState(variants[0]?.volume ?? product.volume);
  const selected = variants.find((variant) => variant.volume === selectedVolume) ?? variants[0];

  return (
    <div className="mt-7 border-y border-zinc-100 py-6">
      <div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Ծավալ
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((variant, index) => (
              <button
                key={`${variant.volume}-${variant.price}-${index}`}
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
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Գին</p>
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
