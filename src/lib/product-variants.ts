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
    if (!variant.volume || uniqueVariants.has(variant.volume)) return;

    uniqueVariants.set(variant.volume, {
      ...variant,
      images: variant.images?.length ? variant.images : [fallbackProductImage],
    });
  });

  return Array.from(uniqueVariants.values());
}
