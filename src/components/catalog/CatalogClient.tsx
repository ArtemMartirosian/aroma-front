"use client";

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-rose-800">Perfume catalog</p>
          <h1 className="mt-2 text-4xl font-semibold text-zinc-950">Каталог ароматов</h1>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Поиск, фильтры и сортировка работают сразу. Если backend запущен, данные
            берутся из API; иначе показывается демо-каталог.
          </p>
        </div>
        <span className="rounded-full bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm">
          {apiMode ? "API connected" : "Demo data"} · {filteredProducts.length} товаров
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Поиск</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Dior, rose..."
                className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-rose-700"
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
              <span className="text-sm font-medium text-zinc-700">Цена до</span>
              <input
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                type="number"
                placeholder="50000"
                className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-rose-700"
              />
            </label>
            <FilterSelect label="Сортировка" value={sort} onChange={(value) => setSort(value as Sort)}>
              <option value="new">Новые</option>
              <option value="price_asc">По цене: дешевые</option>
              <option value="price_desc">По цене: дорогие</option>
              <option value="popular">Популярные</option>
            </FilterSelect>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setBrand("");
                setCategory("");
                setGender("");
                setType("");
                setVolume("");
                setMaxPrice("");
                setSort("new");
              }}
              className="w-full rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-950"
            >
              Сбросить фильтры
            </button>
          </div>
        </aside>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {!filteredProducts.length ? (
            <div className="col-span-full rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600">
              Ничего не найдено. Попробуйте изменить фильтры.
            </div>
          ) : null}
        </section>
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
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:border-rose-700"
      >
        <option value="">Все</option>
        {children}
      </select>
    </label>
  );
}
