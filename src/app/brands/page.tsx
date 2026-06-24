import Link from "next/link";
import { mockBrands, mockProducts } from "@/lib/mock-data";

export default function BrandsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.2em] text-rose-800">Brands</p>
      <h1 className="mt-2 text-4xl font-semibold text-zinc-950">Бренды</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {mockBrands.map((brand) => (
          <Link
            key={brand.id}
            href={`/catalog?brand=${brand.slug}`}
            className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-lg font-semibold text-white">
                {brand.logo}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-zinc-950">{brand.name}</h2>
                <p className="mt-2 leading-7 text-zinc-600">{brand.description}</p>
                <p className="mt-4 text-sm font-semibold text-rose-800">
                  {mockProducts.filter((product) => product.brandId === brand.id).length} товаров
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
