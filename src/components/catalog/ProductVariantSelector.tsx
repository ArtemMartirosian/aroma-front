"use client";

import { useEffect, useMemo, useState } from "react";
import { isAccessoiresCategory } from "@/lib/category-groups";
import { formatPrice } from "@/lib/dictionaries";
import { normalizeProductVariants } from "@/lib/product-variants";
import { Product, ProductVariant } from "@/types/catalog";

export function ProductVariantSelector({ product }: { product: Product }) {
  const variants = useMemo<ProductVariant[]>(() => normalizeProductVariants(product), [product]);
  const isAccessoiresProduct = isAccessoiresCategory(product.category?.slug);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selected = variants[selectedVariantIndex] ?? variants[0];
  const hasVariantChoices = !isAccessoiresProduct && variants.length > 1;
  const shouldShowVolume = !isAccessoiresProduct && Boolean(selected?.volume?.trim());

  useEffect(() => {
    setSelectedVariantIndex(0);
  }, [product.id, variants.length]);

  function handleVariantPointerUp(index: number) {
    return (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse") {
        return;
      }
      setSelectedVariantIndex(index);
    };
  }

  return (
    <div className="mt-7 border-y border-[var(--line)] py-6">
      {hasVariantChoices ? (
        <div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Ծավալ
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {variants.map((variant, index) => (
                <button
                  key={`${variant.volume}-${variant.price}-${index}`}
                  type="button"
                  onClick={() => setSelectedVariantIndex(index)}
                  onPointerUp={handleVariantPointerUp(index)}
                  className={
                    index === selectedVariantIndex
                      ? "touch-manipulation rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#171717]"
                      : "touch-manipulation rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-semibold text-[var(--text-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
                  }
                >
                  {variant.volume}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : shouldShowVolume ? (
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Ծավալ
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#171717]">
              {selected?.volume?.trim()}
            </span>
          </div>
        </div>
      ) : null}

      <div className={`${hasVariantChoices || shouldShowVolume ? "mt-6" : "mt-0"} flex flex-wrap items-end justify-between gap-4`}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Գին</p>
          <div className="mt-1 flex items-baseline gap-3">
            <p className="text-4xl font-semibold tracking-tight text-[var(--foreground)]">
              {formatPrice(selected?.price ?? product.price)}
            </p>
            {selected?.oldPrice ? (
              <p className="text-lg text-[var(--text-muted)] line-through">{formatPrice(selected.oldPrice)}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
