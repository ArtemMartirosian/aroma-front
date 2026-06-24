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
  const [apiMode, setApiMode] = useState(false);

  useEffect(() => {
    Promise.all([getProducts({ limit: 100 }), getBrands(), getCategories()])
      .then(([productsResponse, brandsResponse, categoriesResponse]) => {
        setProducts(productsResponse.items);
        setBrands(brandsResponse);
        setCategories(categoriesResponse);
        setApiMode(true);
      })
      .catch(() => {
        setProducts(mockProducts);
        setBrands(mockBrands);
        setCategories(mockCategories);
        setApiMode(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return products
      .filter((product) => {
        const price = Number(product.price);
        return (
          (!normalizedSearch || product.name.toLowerCase().includes(normalizedSearch)) &&
          (!brand || product.brand?.slug === brand) &&
          (!category || product.category?.slug === category) &&
          (!gender || product.gender === gender) &&
          (!type || product.fragranceType === type) &&
          (!volume || product.volume === volume) &&
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

  const volumes = Array.from(new Set(products.map((product) => product.volume)));
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
    <div className="bg-[#fbfaf8]">
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <Image
          src="/images/perfume-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/78 to-zinc-950/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-200">
              curated perfume catalog
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight md:text-7xl">
              Ароматы, которые выглядят так же дорого, как звучат
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200">
              Выберите бренд, настроение, объем и бюджет. Мы поможем оформить
              заказ онлайн с бесплатной доставкой.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <Stat label="Найдено" value={filteredProducts.length} />
            <Stat label="Брендов" value={brands.length} />
            <Stat label="Категорий" value={categories.length} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="-mt-20 rounded-lg border border-white/60 bg-white p-4 shadow-2xl md:p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-zinc-100 pb-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-800">
                Найти аромат
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                {activeFilters ? `${activeFilters} фильтров активно` : "Можно искать по названию, бренду и типу"}
              </p>
            </div>
            {activeFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="w-fit rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-950"
              >
                Сбросить
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="md:col-span-2">
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
            <FilterSelect label="Сортировка" value={sort} onChange={(value) => setSort(value as Sort)}>
              <option value="new">Новые</option>
              <option value="price_asc">По цене: дешевые</option>
              <option value="price_desc">По цене: дорогие</option>
              <option value="popular">Популярные</option>
            </FilterSelect>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-800">
                Collection
              </p>
              <h2 className="mt-2 text-4xl font-semibold text-zinc-950">Витрина ароматов</h2>
              <p className="mt-2 text-zinc-600">
                {filteredProducts.length} товаров найдено
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-600">
              {apiMode ? <span className="rounded-full bg-white px-3 py-1 shadow-sm">Backend API</span> : null}
              {sort === "new" ? <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-900">Новые</span> : null}
              {sort === "popular" ? <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-900">Популярные</span> : null}
              {maxPrice ? <span className="rounded-full bg-white px-3 py-1 shadow-sm">до {maxPrice}</span> : null}
            </div>
          </div>

          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
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
