import type { MetadataRoute } from "next";
import { API_URL } from "@/lib/api";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, localeIntl } from "@/lib/locale-config";
import { getMockBrands, getMockProducts } from "@/lib/mock-catalog";
import { localizePath } from "@/lib/routing";
import { SITE_URL } from "@/lib/seo";
import { Brand, ProductsResponse } from "@/types/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, brands] = await Promise.all([loadProducts(), loadBrands()]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) => [
    {
      url: `${SITE_URL}${localizePath(locale, "/")}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: locale === "am" ? 1 : 0.9,
      alternates: buildAlternates("/"),
    },
    {
      url: `${SITE_URL}${localizePath(locale, "/catalog")}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: buildAlternates("/catalog"),
    },
    {
      url: `${SITE_URL}${localizePath(locale, "/brands")}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: buildAlternates("/brands"),
    },
    {
      url: `${SITE_URL}${localizePath(locale, "/about")}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: buildAlternates("/about"),
    },
    {
      url: `${SITE_URL}${localizePath(locale, "/contacts")}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: buildAlternates("/contacts"),
    },
  ]);

  const brandRoutes: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    brands.map((brand) => ({
      url: `${SITE_URL}${localizePath(locale, `/catalog?brand=${encodeURIComponent(brand.slug)}`)}`,
      lastModified: brand.updatedAt ? new Date(brand.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: buildAlternates(`/catalog?brand=${encodeURIComponent(brand.slug)}`),
    })),
  );

  const productRoutes: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    products.map((product) => ({
      url: `${SITE_URL}${localizePath(locale, `/products/${product.slug}`)}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: buildAlternates(`/products/${product.slug}`),
    })),
  );

  return [...staticRoutes, ...brandRoutes, ...productRoutes];
}

function buildAlternates(path: string) {
  return {
    languages: {
      ...Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [localeIntl[locale], `${SITE_URL}${localizePath(locale, path)}`]),
      ),
      "x-default": `${SITE_URL}${localizePath(DEFAULT_LOCALE, path)}`,
    },
  };
}

async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products?limit=100`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (response.ok) {
      const data = (await response.json()) as ProductsResponse;
      return data.items.filter((product) => product.isActive);
    }
  } catch {}

  return getMockProducts().filter((product) => product.isActive);
}

async function loadBrands() {
  try {
    const response = await fetch(`${API_URL}/brands`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (response.ok) {
      const data = (await response.json()) as Brand[];
      return data.filter((brand) => brand.isActive);
    }
  } catch {}

  return getMockBrands().filter((brand) => brand.isActive);
}
