"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { fragranceOptions, genderOptions } from "@/lib/dictionaries";
import { getBrands, getCategories, getProducts } from "@/lib/api";
import { mockBrands, mockCategories, mockProducts } from "@/lib/mock-data";
import { Brand, Category, FragranceType, Gender, Product } from "@/types/catalog";

type Sort = "new" | "price_asc" | "price_desc" | "popular";

export function CatalogClient() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [type, setType] = useState<FragranceType | "">("");
  const [volume, setVolume] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<Sort>("new");

  useEffect(() => {
    Promise.all([getProducts({ limit: 100 }), getBrands(), getCategories()])
      .then(([productsResponse, brandsResponse, categoriesResponse]) => {
        setProducts(productsResponse.items);
        setBrands(brandsResponse);
        setCategories(categoriesResponse);
      })
      .catch(() => {
        setProducts(mockProducts);
        setBrands(mockBrands);
        setCategories(mockCategories);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return products
      .filter((product) => {
        const price = Number(product.price);
        const productVolumes = product.variants?.length
          ? product.variants.map((variant) => variant.volume)
          : [product.volume];
        return (
          (!normalizedSearch || product.name.toLowerCase().includes(normalizedSearch)) &&
          (!brand || product.brand?.slug === brand) &&
          (!category || product.category?.slug === category) &&
          (!gender || product.gender === gender) &&
          (!type || product.fragranceType === type) &&
          (!volume || productVolumes.includes(volume)) &&
          (!maxPrice || price <= Number(maxPrice)) &&
          product.isActive
        );
      })
      .sort((a, b) => {
        if (sort === "price_asc") return Number(a.price) - Number(b.price);
        if (sort === "price_desc") return Number(b.price) - Number(a.price);
        if (sort === "popular") return Number(b.isFeatured) - Number(a.isFeatured);
        return Number(b.isNew) - Number(a.isNew);
      });
  }, [brand, category, gender, maxPrice, products, search, sort, type, volume]);

  const volumes = Array.from(
    new Set(
      products.flatMap((product) =>
        product.variants?.length
          ? product.variants.map((variant) => variant.volume)
          : [product.volume],
      ),
    ),
  );
  const activeFilters = [search, brand, category, gender, type, volume, maxPrice].filter(Boolean).length;

  function resetFilters() {
    setSearch("");
    setBrand("");
    setCategory("");
    setGender("");
    setType("");
    setVolume("");
    setMaxPrice("");
    setSort("new");
  }

  return (
    <div className="relative overflow-hidden bg-white">
      <Image
        src="/images/perfume-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-20"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/72" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),transparent_48%),radial-gradient(circle_at_top_right,rgba(246,233,220,0.52),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-white/80" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[285px_minmax(0,1fr)] lg:px-8 lg:py-10">
        <aside className="h-fit rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_20px_45px_rgba(132,93,63,0.08)] backdrop-blur lg:sticky lg:top-8">
          <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-800">
                Фильтры
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                {activeFilters ? `${activeFilters} активно` : "Выберите параметры"}
              </p>
            </div>
            {activeFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-900 transition hover:border-zinc-950"
              >
                Сбросить
              </button>
            ) : null}
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-zinc-800">Поиск</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Dior, Chanel, Oud..."
                className="mt-2 w-full rounded-md border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-rose-700 focus:bg-white"
              />
            </label>
            <FilterSelect label="Бренд" value={brand} onChange={setBrand}>
              {brands.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Категория" value={category} onChange={setCategory}>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Пол" value={gender} onChange={(value) => setGender(value as Gender | "")}>
              {genderOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Тип аромата"
              value={type}
              onChange={(value) => setType(value as FragranceType | "")}
            >
              {fragranceOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Объем" value={volume} onChange={setVolume}>
              {volumes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </FilterSelect>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-800">Цена до</span>
              <input
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                type="number"
                placeholder="50000"
                className="mt-2 w-full rounded-md border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-rose-700 focus:bg-white"
              />
            </label>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="rounded-[30px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(250,240,230,0.92))] p-5 shadow-[0_24px_60px_rgba(132,93,63,0.12)] sm:p-7">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-800">
                  Aroma Parfume
                </p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
                  Каталог ароматов
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                  Выбирайте любимые ноты, бренды и объемы. Все заказы оформляются онлайн,
                  а доставка бесплатная.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:self-center sm:flex-row sm:flex-wrap sm:justify-end">
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-600 sm:justify-end">
                  <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">
                    {filteredProducts.length} товаров
                  </span>
                  <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">
                    Бесплатная доставка
                  </span>
                  {activeFilters ? (
                    <span className="rounded-full bg-rose-50 px-3 py-1.5 text-rose-900">
                      {activeFilters} фильтров
                    </span>
                  ) : null}
                </div>

                <label className="block min-w-[210px]">
                  <span className="text-sm font-semibold text-zinc-800">Сортировка</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as Sort)}
                    className="mt-2 w-full rounded-md border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-rose-700 focus:bg-white"
                  >
                    <option value="new">Новые</option>
                    <option value="price_asc">По цене: дешевые</option>
                    <option value="price_desc">По цене: дорогие</option>
                    <option value="popular">Популярные</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-600">
              {brand ? <span className="rounded-full border border-white/80 bg-white/90 px-3 py-1.5 shadow-sm">{brands.find((item) => item.slug === brand)?.name}</span> : null}
              {category ? <span className="rounded-full border border-white/80 bg-white/90 px-3 py-1.5 shadow-sm">{categories.find((item) => item.slug === category)?.name}</span> : null}
              {gender ? <span className="rounded-full border border-white/80 bg-white/90 px-3 py-1.5 shadow-sm">{genderOptions.find(([value]) => value === gender)?.[1]}</span> : null}
              {type ? <span className="rounded-full border border-white/80 bg-white/90 px-3 py-1.5 shadow-sm">{fragranceOptions.find(([value]) => value === type)?.[1]}</span> : null}
              {volume ? <span className="rounded-full border border-white/80 bg-white/90 px-3 py-1.5 shadow-sm">{volume}</span> : null}
              {search ? <span className="rounded-full border border-white/80 bg-white/90 px-3 py-1.5 shadow-sm">“{search}”</span> : null}
            </div>

            <div>
              <section className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {!filteredProducts.length ? (
                  <div className="col-span-full rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
                    <p className="text-xl font-semibold text-zinc-950">Ничего не найдено</p>
                    <p className="mt-2 text-zinc-600">Попробуйте изменить фильтры или сбросить поиск.</p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-5 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800"
                    >
                      Сбросить фильтры
                    </button>
                  </div>
                ) : null}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-800">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-rose-700 focus:bg-white"
      >
        <option value="">Все</option>
        {children}
      </select>
    </label>
  );
}
