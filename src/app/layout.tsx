import { MobileTabBar } from "@/components/catalog/MobileTabBar";
import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/catalog/SiteFooter";
import { SiteHeader } from "@/components/catalog/SiteHeader";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | Օծանելիքի օնլայն կատալոգ`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Օծանելիքի օնլայն կատալոգ՝ բրենդներով, ծավալներով, գներով, արագ կապով և անվճար առաքմամբ ամբողջ Հայաստանում։",
  keywords: [
    "օծանելիք",
    "parfume",
    "perfume Armenia",
    "Aroma Parfume & cosmetics",
    "օնլայն օծանելիքի խանութ",
    "նիշային օծանելիք",
    "կանացի օծանելիք",
    "տղամարդու օծանելիք",
  ],
  category: "shopping",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "hy_AM",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Օծանելիքի օնլայն կատալոգ`,
    description: "Օծանելիքի օնլայն կատալոգ՝ բրենդներով, ծավալներով, գներով, արագ կապով և անվճար առաքմամբ ամբողջ Հայաստանում։",
    images: [
      {
        url: absoluteUrl("/images/perfume-hero.png"),
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Օծանելիքի օնլայն կատալոգ`,
    description: "Օծանելիքի օնլայն կատալոգ՝ բրենդներով, ծավալներով, գներով, արագ կապով և անվճար առաքմամբ ամբողջ Հայաստանում։",
    images: [absoluteUrl("/images/perfume-hero.png")],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] md:pb-0">{children}</main>
        <SiteFooter />
        <MobileTabBar />
      </body>
    </html>
  );
}
