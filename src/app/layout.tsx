import { MobileTabBar } from "@/components/catalog/MobileTabBar";
import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/catalog/SiteFooter";
import { SiteHeader } from "@/components/catalog/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aroma Perfume",
  description: "Օծանելիքի կատալոգ ադմին վահանակով",
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
