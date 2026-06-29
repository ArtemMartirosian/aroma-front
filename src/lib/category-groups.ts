import { Product } from "@/types/catalog";

export const cosmeticsCategorySlugs = ["cosmetics", "face-care", "decorative-cosmetics", "lip-care"];
export const accessoiresCategorySlugs = ["accessoires", "travel-accessories", "beauty-accessories"];

export function isCosmeticsCategory(slug?: string | null) {
  return Boolean(slug && cosmeticsCategorySlugs.includes(slug));
}

export function isAccessoiresCategory(slug?: string | null) {
  return Boolean(slug && accessoiresCategorySlugs.includes(slug));
}

export function isParfumeProduct(product: Pick<Product, "category" | "categoryId">) {
  const slug = product.category?.slug;
  return !isCosmeticsCategory(slug) && !isAccessoiresCategory(slug);
}
