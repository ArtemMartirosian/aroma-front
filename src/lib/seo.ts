import type { Metadata } from "next";
import { Locale, localeOgLang } from "@/lib/locale-config";
import { localizePath } from "@/lib/routing";
import { getTranslations } from "@/lib/translations";

const fallbackSiteUrl = "http://localhost:3000";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (rawSiteUrl || fallbackSiteUrl).replace(/\/$/, "");
export const SITE_NAME = "Aroma Parfume, cosmetics & accessoires";
export const DEFAULT_OG_IMAGE = "/images/perfume-hero.png";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function getDefaultSeo(locale: Locale) {
  const messages = getTranslations(locale);
  return {
    title: messages.site.defaultTitle,
    description: messages.site.defaultDescription,
    keywords: [...messages.site.keywords],
  };
}

export function buildMetadata({
  locale,
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: {
  locale: Locale;
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const defaults = getDefaultSeo(locale);
  const resolvedDescription = description ?? defaults.description;
  const fullTitle = title === defaults.title ? title : `${title} | ${SITE_NAME}`;
  const canonical = absoluteUrl(localizePath(locale, path));
  const ogImage = absoluteUrl(image);

  return {
    title: fullTitle,
    description: resolvedDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: fullTitle,
      description: resolvedDescription,
      siteName: SITE_NAME,
      locale: localeOgLang[locale],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
