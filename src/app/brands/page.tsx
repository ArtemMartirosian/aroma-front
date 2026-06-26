import Link from "next/link";
import { BrandCard } from "@/components/catalog/BrandCard";
import { API_URL } from "@/lib/api";
import { getMockBrands } from "@/lib/mock-catalog";
import { Brand, ProductsResponse } from "@/types/catalog";

export default async function BrandsPage() {
  const brands = await loadBrands();
  const totalProducts = brands.reduce((sum, brand) => sum + (brand.productCount ?? brand.products?.length ?? 0), 0);

  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[34px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(21,24,25,0.98),rgba(29,33,34,0.96))] px-6 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.34)] sm:px-8 sm:py-10 lg:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(195,164,111,0.14),transparent_26%),radial-gradient(circle_at_84%_22%,rgba(255,255,255,0.04),transparent_24%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Բրենդների հավաքածու</p>
              <h1 className="mt-4 font-serif text-4xl leading-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                Բրենդներ՝ բնավորությամբ և գեղեցիկ շլեյֆով
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-soft)] sm:text-lg">
                Մեկ վիտրինայում հավաքել ենք սիրելի օծանելիքի տները՝ նիշային շեշտերից մինչև ճանաչելի դասականը։
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
              <StatCard label="Բրենդ" value={String(brands.length)} />
              <StatCard label="Բույր" value={String(totalProducts)} />
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} variant="showcase" />
        ))}
        </div>
        {!brands.length ? (
          <div className="mt-8 rounded-[28px] border border-dashed border-[var(--line)] bg-[var(--surface-elevated)] p-10 text-center text-[var(--text-muted)] shadow-[0_16px_36px_rgba(0,0,0,0.24)]">
            Բրենդները դեռ չեն բեռնվել backend-ից։
          </div>
        ) : null}

        <div className="mt-10 flex justify-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] shadow-[0_10px_24px_rgba(0,0,0,0.24)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            Բացել ամբողջ կատալոգը
            <span aria-hidden="true">/</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

async function loadBrands(): Promise<Brand[]> {
  try {
    const [brandsResponse, productsResponse] = await Promise.all([
      fetch(`${API_URL}/brands`, { cache: "no-store", signal: AbortSignal.timeout(1500) }),
      fetch(`${API_URL}/products?limit=100`, { cache: "no-store", signal: AbortSignal.timeout(1500) }),
    ]);

    if (brandsResponse.ok && productsResponse.ok) {
      const brands = (await brandsResponse.json()) as Brand[];
      const productsData = (await productsResponse.json()) as ProductsResponse;
      const brandProductCount = new Map<string, number>();

      productsData.items.forEach((product) => {
        const brandId = product.brandId ?? product.brand?.id;
        if (!brandId) return;
        brandProductCount.set(brandId, (brandProductCount.get(brandId) ?? 0) + 1);
      });

      return brands.map((brand) => ({
        ...brand,
        productCount: brand.productCount ?? brandProductCount.get(brand.id) ?? 0,
      }));
    }
  } catch {
    return getMockBrands();
  }

  return getMockBrands();
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(21,24,25,0.72)] px-5 py-4 shadow-[0_16px_36px_rgba(0,0,0,0.24)] backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{value}</p>
    </div>
  );
}
