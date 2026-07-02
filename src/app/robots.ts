import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { SUPPORTED_LOCALES } from "@/lib/locale-config";

export default function robots(): MetadataRoute.Robots {
  const publicRoutes = SUPPORTED_LOCALES.flatMap((locale) => [
    `/${locale}`,
    `/${locale}/about`,
    `/${locale}/brands`,
    `/${locale}/catalog`,
    `/${locale}/contacts`,
    `/${locale}/products/`,
  ]);

  return {
    rules: [
      {
        userAgent: "*",
        allow: publicRoutes,
        disallow: ["/admin", "/api/", "/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
