import { LocaleProvider } from "@/components/catalog/LocaleProvider";
import { MobileTabBar } from "@/components/catalog/MobileTabBar";
import type { Metadata, Viewport } from "next";
import { getRequestLocale, localeHtmlLang } from "@/lib/i18n";
import { SiteFooter } from "@/components/catalog/SiteFooter";
import { SiteHeader } from "@/components/catalog/SiteHeader";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, buildLanguageAlternates, getDefaultSeo, localizedAbsoluteUrl } from "@/lib/seo";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const defaults = getDefaultSeo(locale);

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: {
      default: defaults.title,
      template: `%s | ${SITE_NAME}`,
    },
    description: defaults.description,
    keywords: defaults.keywords,
    category: "shopping",
    alternates: {
      canonical: localizedAbsoluteUrl(locale, "/"),
      languages: buildLanguageAlternates("/"),
    },
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: localizedAbsoluteUrl(locale, "/"),
      title: defaults.title,
      description: defaults.description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaults.title,
      description: defaults.description,
      images: [DEFAULT_OG_IMAGE],
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: true,
    },
    appleWebApp: {
      capable: true,
      title: SITE_NAME,
      statusBarStyle: "black-translucent",
    },
    referrer: "origin-when-cross-origin",
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/images/aroma-logo.png",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={localeHtmlLang[locale]} className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <LocaleProvider initialLocale={locale}>
          <SiteHeader />
          <main className="flex-1 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] md:pb-0">{children}</main>
          <SiteFooter />
          <MobileTabBar />
        </LocaleProvider>
      </body>
    </html>
  );
}
