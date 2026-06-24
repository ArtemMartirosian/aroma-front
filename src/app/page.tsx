import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/catalog/ProductCard";
import { mockBrands, mockCategories, mockProducts } from "@/lib/mock-data";

export default function Home() {
  const featured = mockProducts.filter((product) => product.isFeatured).slice(0, 3);
  const newest = mockProducts.filter((product) => product.isNew).slice(0, 3);

  return (
    <div>
      <section className="relative min-h-[680px] overflow-hidden bg-white">
        <Image
          src="/images/perfume-hero.png"
          alt="Premium perfume bottles"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/5" />
        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-800">
              Premium perfume catalog
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-tight text-zinc-950 md:text-7xl">
              Discover your signature fragrance
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-700">
              Современный каталог оригинальной парфюмерии: бренды, ноты,
              фильтры, наличие и быстрый контакт без корзины и онлайн-оплаты.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
              >
                Смотреть каталог
              </Link>
              <Link
                href="/contacts"
                className="rounded-full border border-zinc-300 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
              >
                Связаться
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section title="Популярные товары" href="/catalog">
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      <Section title="Новые поступления" href="/catalog">
        <div className="grid gap-6 md:grid-cols-3">
          {newest.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      <Section title="Категории" href="/catalog">
        <div className="grid gap-4 md:grid-cols-4">
          {mockCategories.map((category) => (
            <Link
              href={`/catalog?category=${category.slug}`}
              key={category.id}
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-lg font-semibold text-zinc-950">{category.name}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Бренды" href="/brands">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {mockBrands.map((brand) => (
            <Link
              href={`/catalog?brand=${brand.slug}`}
              key={brand.id}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-white text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] bg-zinc-100">
                <Image
                  src={brand.image || "/images/perfume-hero.png"}
                  alt={brand.name}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-zinc-950 shadow-sm">
                  {brand.logo}
                </div>
              </div>
              <p className="p-5 font-semibold text-zinc-950">{brand.name}</p>
            </Link>
          ))}
        </div>
      </Section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-rose-800">О нас</p>
            <h2 className="mt-3 text-4xl font-semibold text-zinc-950">
              Подбираем аромат по характеру, сезону и настроению
            </h2>
          </div>
          <div className="space-y-4 text-zinc-600">
            <p>
              AROMA помогает быстро найти нужный флакон: по бренду, полу, типу
              аромата, цене, объему и статусу наличия.
            </p>
            <p>
              В первой версии покупки нет: карточка товара ведет к контакту в
              WhatsApp, где можно уточнить наличие и оформить бесплатную доставку.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="text-3xl font-semibold text-zinc-950">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-rose-800 hover:text-zinc-950">
          Смотреть все
        </Link>
      </div>
      {children}
    </section>
  );
}
