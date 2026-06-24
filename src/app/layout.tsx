import type { Metadata } from "next";
import { SiteFooter } from "@/components/catalog/SiteFooter";
import { SiteHeader } from "@/components/catalog/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aroma Perfume",
  description: "Perfume catalog with admin panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
