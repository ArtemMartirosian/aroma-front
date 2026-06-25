import Image from "next/image";
import Link from "next/link";
import { BrandCard } from "@/components/catalog/BrandCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import { API_URL } from "@/lib/api";
import { Brand, Category, Product, ProductsResponse } from "@/types/catalog";

export default async function Home() {
  const { featured, newest, brands, categories } = await loadHomeData();

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
              объемы, цены и быстрый контакт без корзины и онлайн-оплаты.
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
        {featured.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState text="Популярные товары появятся после загрузки данных из backend." />
        )}
      </Section>

      <Section title="Новые поступления" href="/catalog">
        {newest.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState text="Новые товары появятся после загрузки данных из backend." />
        )}
      </Section>

      <Section title="Категории" href="/catalog">
        <div className="grid gap-4 md:grid-cols-4">
          {categories.map((category) => (
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
        {!categories.length ? <EmptyState text="Категории пока не загружены из backend." /> : null}
      </Section>

      <Section title="Бренды" href="/brands">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
        {!brands.length ? <EmptyState text="Бренды пока не загружены из backend." /> : null}
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
              аромата, цене и объему.
            </p>
            <p>
              В первой версии покупки нет: карточка товара ведет к контакту в
              WhatsApp, где можно уточнить детали и оформить бесплатную доставку.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

async function loadHomeData(): Promise<{
  featured: Product[];
  newest: Product[];
  brands: Brand[];
  categories: Category[];
}> {
  try {
    const [productsResponse, brandsResponse, categoriesResponse] = await Promise.all([
      fetch(`${API_URL}/products?limit=100`, { cache: "no-store" }),
      fetch(`${API_URL}/brands`, { cache: "no-store" }),
      fetch(`${API_URL}/categories`, { cache: "no-store" }),
    ]);

    if (!productsResponse.ok || !brandsResponse.ok || !categoriesResponse.ok) {
      throw new Error("Backend response failed");
    }

    const productsData = (await productsResponse.json()) as ProductsResponse;
    const brands = (await brandsResponse.json()) as Brand[];
    const categories = (await categoriesResponse.json()) as Category[];
    const products = productsData.items;

    return {
      featured: products.filter((product) => product.isFeatured).slice(0, 3),
      newest: products.filter((product) => product.isNew).slice(0, 3),
      brands,
      categories,
    };
  } catch {
    return {
      featured: [],
      newest: [],
      brands: [],
      categories: [],
    };
  }
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

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm font-medium text-zinc-500">
      {text}
    </div>
  );
}
