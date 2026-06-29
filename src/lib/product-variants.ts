import { Product, ProductVariant } from "@/types/catalog";

export const fallbackProductImage = "/images/products/perfume-card-1.png";

export function normalizeProductVariants(product: Product): ProductVariant[] {
  const rawVariants = product.variants?.length
    ? product.variants
    : [
        {
          volume: product.volume,
          price: product.price,
          oldPrice: product.oldPrice,
          images: [fallbackProductImage],
        },
      ];

  const uniqueVariants = new Map<string, ProductVariant>();

  rawVariants.forEach((variant) => {
    const normalizedVolume = variant.volume?.trim() ?? "";
    const key = normalizedVolume || "__default__";
    if (uniqueVariants.has(key)) return;

    uniqueVariants.set(key, {
      ...variant,
      volume: normalizedVolume,
      images: variant.images?.length ? variant.images : [fallbackProductImage],
    });
  });

  return Array.from(uniqueVariants.values());
}
