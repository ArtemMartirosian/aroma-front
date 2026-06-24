import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import { API_URL } from "@/lib/api";
import {
  fragranceLabels,
  formatPrice,
  genderLabels,
  longevityLabels,
  sillageLabels,
} from "@/lib/dictionaries";
import { mockProducts } from "@/lib/mock-data";
import { Product } from "@/types/catalog";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const related =
    product.relatedProducts?.length
      ? product.relatedProducts
      : mockProducts
          .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
          .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <Image
              src={product.mainImage || "/images/perfume-hero.png"}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.galleryImages.map((image) => (
              <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-zinc-200">
                <Image
                key={image}
                src={image}
                alt={`${product.name} gallery`}
                  fill
                  sizes="(min-width: 1024px) 16vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-rose-800">
            {product.brand?.name}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-zinc-950">{product.name}</h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600">{product.description}</p>
          <div className="mt-6 flex items-end gap-3">
            <p className="text-3xl font-semibold text-zinc-950">{formatPrice(product.price)}</p>
            {product.oldPrice ? (
              <p className="pb-1 text-lg text-zinc-400 line-through">
                {formatPrice(product.oldPrice)}
              </p>
            ) : null}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Info label="Объем" value={product.volume} />
            <Info label="Пол" value={genderLabels[product.gender]} />
            <Info label="Тип аромата" value={fragranceLabels[product.fragranceType]} />
            <Info label="Концентрация" value={product.concentration || "Eau de Parfum"} />
            <Info label="Стойкость" value={product.longevity ? longevityLabels[product.longevity] : "Средняя"} />
            <Info label="Шлейф" value={product.sillage ? sillageLabels[product.sillage] : "Средний"} />
            <Info label="Страна" value={product.country || "France"} />
            <Info label="Наличие" value={product.stockStatus} />
          </div>
          <div className="mt-6 rounded-lg bg-zinc-50 p-5">
            <h2 className="font-semibold text-zinc-950">Ноты аромата</h2>
            <div className="mt-3 space-y-2 text-sm leading-6 text-zinc-600">
              <p>
                <b className="text-zinc-950">Верхние:</b> {product.topNotes}
              </p>
              <p>
                <b className="text-zinc-950">Средние:</b> {product.middleNotes}
              </p>
              <p>
                <b className="text-zinc-950">Базовые:</b> {product.baseNotes}
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={`https://wa.me/37433696009?text=${encodeURIComponent(`Здравствуйте, интересует ${product.name}`)}`}
              className="inline-flex justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
            >
              Написать в WhatsApp
            </a>
            <a
              href="https://instagram.com/aroma__parfume"
              target="_blank"
              rel="noreferrer"
              className="inline-flex justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
            >
              Написать в Instagram
            </a>
          </div>
        </section>
      </div>

      <section className="py-14">
        <h2 className="mb-8 text-3xl font-semibold text-zinc-950">Похожие товары</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
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
    return mockProducts.find((item) => item.slug === slug);
  }

  return mockProducts.find((item) => item.slug === slug);
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold text-zinc-950">{value}</p>
    </div>
  );
}
