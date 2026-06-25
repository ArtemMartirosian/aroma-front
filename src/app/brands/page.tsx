import Image from "next/image";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { imageUrl } from "@/lib/images";
import { Brand } from "@/types/catalog";

export default async function BrandsPage() {
  const brands = await loadBrands();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.2em] text-rose-800">Brands</p>
      <h1 className="mt-2 text-4xl font-semibold text-zinc-950">Бренды</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/catalog?brand=${brand.slug}`}
            className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="grid sm:grid-cols-[190px_1fr]">
              <div className="relative min-h-44 bg-zinc-100">
                <Image
                  src={imageUrl(brand.image)}
                  alt={brand.name}
                  fill
                  sizes="(min-width: 768px) 190px, 100vw"
                  className="object-cover"
                />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-zinc-950 shadow-sm">
                  {brand.logo || brand.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-zinc-950">{brand.name}</h2>
                <p className="mt-2 leading-7 text-zinc-600">{brand.description}</p>
                <p className="mt-4 text-sm font-semibold text-rose-800">{brand.products?.length ?? 0} товаров</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {!brands.length ? (
        <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
          Бренды пока не загружены из backend.
        </div>
      ) : null}
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
