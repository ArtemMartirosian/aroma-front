import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeProductCarousel } from "@/components/catalog/HomeProductCarousel";
import { ProductDetails } from "@/components/catalog/ProductDetails";
import { API_URL } from "@/lib/api";
import { isAccessoiresCategory, isParfumeProduct } from "@/lib/category-groups";
import { longevityLabels, sillageLabels } from "@/lib/dictionaries";
import { getMockProductBySlug } from "@/lib/mock-catalog";
import { SITE_NAME, absoluteUrl, buildMetadata } from "@/lib/seo";
import { Product } from "@/types/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);

  if (!product) {
    return buildMetadata({
      title: "Ապրանք չի գտնվել",
      description: "Պահանջվող ապրանքը չի գտնվել Aroma Parfume, կոսմետիկա և աքսեսուարներ-ի կատալոգում։",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  const image = product.variants?.[0]?.images?.[0] ?? "/images/perfume-hero.png";

  return buildMetadata({
    title: product.name,
    description: product.description,
    path: `/products/${product.slug}`,
    image,
  });
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string | string[] }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const product = await loadProduct(slug);
  if (!product) notFound();
  const initialVariant =
    typeof resolvedSearchParams.variant === "string"
      ? resolvedSearchParams.variant
      : resolvedSearchParams.variant?.[0];

  const related = product.relatedProducts?.slice(0, 3) ?? [];
  const perfumeProduct = isParfumeProduct(product);
  const isAccessoiresProduct = isAccessoiresCategory(product.category?.slug);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: (product.variants?.flatMap((variant) => variant.images) ?? ["/images/perfume-hero.png"]).map((image) =>
      absoluteUrl(image),
    ),
    brand: {
      "@type": "Brand",
      name: product.brand?.name ?? SITE_NAME,
    },
    category: product.category?.name,
    offers: (product.variants?.length ? product.variants : [{ volume: product.volume, price: product.price, images: [] }]).map((variant, index) => ({
      "@type": "Offer",
      priceCurrency: "AMD",
      price: Number(variant.price),
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/products/${product.slug}`),
      itemCondition: "https://schema.org/NewCondition",
      sku: isAccessoiresProduct || !variant.volume ? `${product.slug}-${index + 1}` : `${product.slug}-${variant.volume}`,
      description: isAccessoiresProduct || !variant.volume ? product.name : `${product.name} ${variant.volume}`,
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Գլխավոր", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Կատալոգ", item: absoluteUrl("/catalog") },
      { "@type": "ListItem", position: 3, name: product.name, item: absoluteUrl(`/products/${product.slug}`) },
    ],
  };

  return (
    <div className="bg-transparent">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ProductDetails product={product} initialVariant={initialVariant} />

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.86fr]">
          {perfumeProduct ? (
            <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-elevated)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Բույրի նոտաներ</p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Բույրի կառուցվածք</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <NoteCard label="Վերին նոտաներ" value={product.topNotes || "Նշված չէ"} />
                <NoteCard label="Միջին նոտաներ" value={product.middleNotes || "Նշված չէ"} />
                <NoteCard label="Բազային նոտաներ" value={product.baseNotes || "Նշված չէ"} />
              </div>
            </div>
          ) : (
            <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-elevated)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Ապրանքի մասին</p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Նկարագրություն</h2>
              <p className="mt-6 text-base leading-8 text-[var(--text-soft)]">
                {product.description}
              </p>
            </div>
          )}

          <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-elevated)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Մանրամասներ</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Բնութագրեր</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {perfumeProduct ? (
                <>
                  <Info label="Երկարակեցություն" value={product.longevity ? longevityLabels[product.longevity] : "Միջին"} />
                  <Info label="Շլեյֆ" value={product.sillage ? sillageLabels[product.sillage] : "Միջին"} />
                </>
              ) : null}
              <Info label="Երկիր" value={product.country || "Նշված չէ"} />
              <Info label="Տարի" value={product.releaseYear ? String(product.releaseYear) : "Նշված չէ"} />
            </div>
          </div>
        </section>

        {related.length ? (
          <section className="py-14">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Ձեզ կարող է դուր գալ նաև</p>
                <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Նման ապրանքներ</h2>
              </div>
            </div>
            <HomeProductCarousel products={related} />
          </section>
        ) : null}
      </div>
    </div>
  );
}

async function loadProduct(slug: string): Promise<Product | undefined> {
  try {
    const response = await fetch(`${API_URL}/products/${slug}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (response.ok) {
      return response.json();
    }
  } catch {
    return getMockProductBySlug(slug);
  }

  return getMockProductBySlug(slug);
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface-muted)] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function NoteCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-muted)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-3 text-lg font-semibold leading-7 text-[var(--foreground)]">{value}</p>
    </div>
  );
}
