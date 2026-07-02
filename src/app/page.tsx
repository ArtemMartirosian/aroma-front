import type { Metadata } from "next";
import Link from "next/link";
import { HomeBrandCarousel } from "@/components/catalog/HomeBrandCarousel";
import { HomeHero } from "@/components/catalog/HomeHero";
import { HomeProductCarousel } from "@/components/catalog/HomeProductCarousel";
import { API_URL } from "@/lib/api";
import { accessoiresCategorySlugs, cosmeticsCategorySlugs } from "@/lib/category-groups";
import { getRequestLocale } from "@/lib/i18n";
import { getLocalizedField } from "@/lib/localized";
import { getMockBrands, getMockCategories, getMockProducts } from "@/lib/mock-catalog";
import { localizePath } from "@/lib/routing";
import { SITE_NAME, absoluteUrl, buildMetadata } from "@/lib/seo";
import { getTranslations } from "@/lib/translations";
import { Brand, Category, Product, ProductsResponse } from "@/types/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getTranslations(locale);

  return buildMetadata({
    locale,
    title: messages.home.metadataTitle,
    description: messages.home.metadataDescription,
    path: "/",
  });
}

export default async function Home() {
  const locale = await getRequestLocale();
  const messages = getTranslations(locale);
  const { featured, newest, cosmetics, accessoires, brands, categories } = await loadHomeData();
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(localizePath(locale, "/")),
    logo: absoluteUrl("/images/aroma-logo.png"),
    sameAs: ["https://instagram.com/aroma___parfumee"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+37433696009",
        contactType: "customer service",
        areaServed: "AM",
        availableLanguage: ["am", "ru", "en"],
      },
    ],
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(localizePath(locale, "/")),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl(localizePath(locale, "/catalog"))}?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="bg-transparent">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <HomeHero />

        <Section title={messages.home.categories} href={localizePath(locale, "/catalog")} viewAllLabel={messages.home.viewAll}>
            <div className="grid gap-4 md:grid-cols-4">
                {categories.map((category) => (
                    <Link
                        href={localizePath(locale, `/catalog?category=${category.slug}`)}
                        key={category.id}
                        className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-elevated)] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_26px_60px_rgba(0,0,0,0.34)]"
                    >
                        <p className="text-lg font-semibold text-[var(--foreground)]">
                          {getLocalizedField(category, "name", locale) || category.name}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                          {getLocalizedField(category, "description", locale) || category.description}
                        </p>
                    </Link>
                ))}
            </div>
            {!categories.length ? <EmptyState text={messages.home.categoriesEmpty} /> : null}
        </Section>


        <Section title={messages.home.featured} href={localizePath(locale, "/catalog")} viewAllLabel={messages.home.viewAll}>
        {featured.length ? (
          <HomeProductCarousel products={featured} />
        ) : (
          <EmptyState text={messages.home.featuredEmpty} />
        )}
      </Section>

      <Section title={messages.home.newest} href={localizePath(locale, "/catalog")} viewAllLabel={messages.home.viewAll}>
        {newest.length ? (
          <HomeProductCarousel products={newest} />
        ) : (
          <EmptyState text={messages.home.newestEmpty} />
        )}
      </Section>

      <Section title={messages.home.cosmetics} href={localizePath(locale, "/catalog?category=cosmetics")} viewAllLabel={messages.home.viewAll}>
        {cosmetics.length ? (
          <HomeProductCarousel products={cosmetics} />
        ) : (
          <EmptyState text={messages.home.cosmeticsEmpty} />
        )}
      </Section>

      <Section title={messages.home.accessoires} href={localizePath(locale, "/catalog?category=accessoires")} viewAllLabel={messages.home.viewAll}>
        {accessoires.length ? (
          <HomeProductCarousel products={accessoires} />
        ) : (
          <EmptyState text={messages.home.accessoiresEmpty} />
        )}
      </Section>

      <Section title={messages.home.brands} href={localizePath(locale, "/brands")} viewAllLabel={messages.home.viewAll}>
        {brands.length ? <HomeBrandCarousel brands={brands} /> : null}
        {!brands.length ? <EmptyState text={messages.home.brandsEmpty} /> : null}
      </Section>

      <section className="bg-transparent">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{messages.home.aboutEyebrow}</p>
            <h2 className="mt-3 text-4xl font-semibold text-[var(--foreground)]">
              {messages.home.aboutTitle}
            </h2>
          </div>
          <div className="space-y-4 text-[var(--text-soft)]">
            <p>{messages.home.aboutTextOne}</p>
            <p>{messages.home.aboutTextTwo}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

async function loadHomeData(): Promise<{
  featured: Product[];
  newest: Product[];
  cosmetics: Product[];
  accessoires: Product[];
  brands: Brand[];
  categories: Category[];
}> {
  try {
    const [
      productsResponse,
      brandsResponse,
      categoriesResponse,
      cosmeticsResponse,
      accessoiresResponse,
    ] = await Promise.all([
      fetch(`${API_URL}/products?limit=100`, { cache: "no-store", signal: AbortSignal.timeout(1500) }),
      fetch(`${API_URL}/brands`, { cache: "no-store", signal: AbortSignal.timeout(1500) }),
      fetch(`${API_URL}/categories`, { cache: "no-store", signal: AbortSignal.timeout(1500) }),
      fetch(`${API_URL}/products?category=cosmetics&limit=12`, {
        cache: "no-store",
        signal: AbortSignal.timeout(1500),
      }),
      fetch(`${API_URL}/products?category=accessoires&limit=12`, {
        cache: "no-store",
        signal: AbortSignal.timeout(1500),
      }),
    ]);

    if (
      !productsResponse.ok ||
      !brandsResponse.ok ||
      !categoriesResponse.ok ||
      !cosmeticsResponse.ok ||
      !accessoiresResponse.ok
    ) {
      throw new Error("Backend response failed");
    }

    const productsData = (await productsResponse.json()) as ProductsResponse;
    const cosmeticsData = (await cosmeticsResponse.json()) as ProductsResponse;
    const accessoiresData = (await accessoiresResponse.json()) as ProductsResponse;
    const brands = (await brandsResponse.json()) as Brand[];
    const categories = (await categoriesResponse.json()) as Category[];
    const products = productsData.items;
    const brandProductCount = new Map<string, number>();

    products.forEach((product) => {
      const brandId = product.brandId ?? product.brand?.id;
      if (!brandId) return;
      brandProductCount.set(brandId, (brandProductCount.get(brandId) ?? 0) + 1);
    });

    const brandsWithCounts = brands.map((brand) => ({
      ...brand,
      productCount: brand.productCount ?? brandProductCount.get(brand.id) ?? 0,
    }));

    return {
      featured: products.filter((product) => product.isFeatured),
      newest: products.filter((product) => product.isNew),
      cosmetics: cosmeticsData.items.filter((product) =>
        cosmeticsCategorySlugs.includes(product.category?.slug ?? ""),
      ),
      accessoires: accessoiresData.items.filter((product) =>
        accessoiresCategorySlugs.includes(product.category?.slug ?? ""),
      ),
      brands: brandsWithCounts,
      categories,
    };
  } catch {
    const products = getMockProducts();
    const brands = getMockBrands();
    const categories = getMockCategories();

    return {
      featured: products.filter((product) => product.isFeatured),
      newest: products.filter((product) => product.isNew),
      cosmetics: products.filter((product) => cosmeticsCategorySlugs.includes(product.category?.slug ?? "")),
      accessoires: products.filter((product) => accessoiresCategorySlugs.includes(product.category?.slug ?? "")),
      brands,
      categories,
    };
  }
}

function Section({
  title,
  href,
  viewAllLabel,
  children,
}: {
  title: string;
  href: string;
  viewAllLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-2 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="text-3xl font-semibold text-[var(--foreground)]">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)]">
          {viewAllLabel}
        </Link>
      </div>
      {children}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface-elevated)] p-8 text-center text-sm font-medium text-[var(--text-muted)]">
      {text}
    </div>
  );
}
