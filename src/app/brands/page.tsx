import Link from "next/link";
import { BrandCard } from "@/components/catalog/BrandCard";
import { API_URL } from "@/lib/api";
import { Brand } from "@/types/catalog";

export default async function BrandsPage() {
  const brands = await loadBrands();
  const totalProducts = brands.reduce((sum, brand) => sum + (brand.products?.length ?? 0), 0);

  return (
    <div className="bg-[linear-gradient(180deg,#f4f1ec_0%,#fbf8f3_32%,#fffdf9_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(243,238,231,0.96))] px-6 py-8 shadow-[0_28px_80px_rgba(71,58,44,0.08)] sm:px-8 sm:py-10 lg:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(116,101,86,0.12),transparent_26%),radial-gradient(circle_at_84%_22%,rgba(221,212,201,0.55),transparent_24%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Բրենդների հավաքածու</p>
              <h1 className="mt-4 font-serif text-4xl leading-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                Բրենդներ՝ բնավորությամբ և գեղեցիկ շլեյֆով
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
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
          <div className="mt-8 rounded-[28px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500 shadow-sm">
            Բրենդները դեռ չեն բեռնվել backend-ից։
          </div>
        ) : null}

        <div className="mt-10 flex justify-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-full border border-[#deccb9] bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-sm transition hover:border-zinc-950"
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
    const response = await fetch(`${API_URL}/brands`, { cache: "no-store" });
    if (response.ok) {
      return response.json();
    }
  } catch {
    return [];
  }

  return [];
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/82 px-5 py-4 shadow-[0_16px_36px_rgba(99,64,32,0.08)] backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">{value}</p>
    </div>
  );
}
