import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/catalog/ProductDetails";
import { ProductCard } from "@/components/catalog/ProductCard";
import { API_URL } from "@/lib/api";
import { longevityLabels, sillageLabels } from "@/lib/dictionaries";
import { Product } from "@/types/catalog";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const related = product.relatedProducts?.slice(0, 3) ?? [];

  return (
    <div className="bg-[linear-gradient(180deg,#fbf2e9_0%,#fffaf5_34%,#fbfaf8_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ProductDetails product={product} />

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.86fr]">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-800">Fragrance notes</p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950">Пирамида аромата</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <NoteCard label="Верхние ноты" value={product.topNotes || "Не указано"} />
              <NoteCard label="Средние ноты" value={product.middleNotes || "Не указано"} />
              <NoteCard label="Базовые ноты" value={product.baseNotes || "Не указано"} />
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-800">Details</p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950">Характеристики</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Info label="Стойкость" value={product.longevity ? longevityLabels[product.longevity] : "Средняя"} />
              <Info label="Шлейф" value={product.sillage ? sillageLabels[product.sillage] : "Средний"} />
              <Info label="Страна" value={product.country || "France"} />
              <Info label="Год" value={product.releaseYear ? String(product.releaseYear) : "Не указан"} />
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-800">You may also like</p>
              <h2 className="mt-2 text-3xl font-semibold text-zinc-950">Похожие товары</h2>
            </div>
          </div>
          {related.length ? (
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
              Похожие товары пока не загружены из backend.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

async function loadProduct(slug: string): Promise<Product | undefined> {
  try {
    const response = await fetch(`${API_URL}/products/${slug}`, {
      cache: "no-store",
    });
    if (response.ok) {
      return response.json();
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

function NoteCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-[#fbfaf8] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-lg font-semibold leading-7 text-zinc-950">{value}</p>
    </div>
  );
}
