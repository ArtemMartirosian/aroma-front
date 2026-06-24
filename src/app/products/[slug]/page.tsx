import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductVariantSelector } from "@/components/catalog/ProductVariantSelector";
import { API_URL } from "@/lib/api";
import {
  fragranceLabels,
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
  const variantsCount = product.variants?.length ?? 0;

  return (
    <div className="bg-[#fbfaf8]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <span>Каталог</span>
          <span>/</span>
          <span>{product.brand?.name}</span>
          <span>/</span>
          <span className="font-medium text-zinc-950">{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
                {product.isNew ? (
                  <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-rose-800 shadow-sm">
                    Новинка
                  </span>
                ) : null}
                {product.isFeatured ? (
                  <span className="rounded-full bg-zinc-950/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    Популярный
                  </span>
                ) : null}
              </div>
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
              {(product.galleryImages.length
                ? product.galleryImages
                : [product.mainImage || "/images/perfume-hero.png"]
              ).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg border border-zinc-200 bg-white"
                  >
                    <Image
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

          <section className="h-fit rounded-lg border border-zinc-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-800">
              {product.brand?.name}
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-zinc-950 lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-zinc-700">
              <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-900">
                {variantsCount > 1 ? `${variantsCount} объема` : product.volume}
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">{genderLabels[product.gender]}</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">
                {fragranceLabels[product.fragranceType]}
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">
                {product.concentration || "Eau de Parfum"}
              </span>
            </div>

            <p className="mt-5 text-lg leading-8 text-zinc-600">{product.description}</p>

            <ProductVariantSelector product={product} />

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
            <p className="mt-4 text-center text-sm text-zinc-500">
              Онлайн-заказ без корзины. Доставка бесплатно.
            </p>
          </section>
        </div>

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
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
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
    return mockProducts.find((item) => item.slug === slug);
  }

  return mockProducts.find((item) => item.slug === slug);
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
