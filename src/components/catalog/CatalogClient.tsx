"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { fragranceOptions, genderOptions } from "@/lib/dictionaries";
import { getBrands, getCategories, getProducts } from "@/lib/api";
import { Brand, Category, FragranceType, Gender, Product } from "@/types/catalog";

type Sort = "new" | "price_asc" | "price_desc" | "popular";

export function CatalogClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [type, setType] = useState<FragranceType | "">("");
  const [volume, setVolume] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<Sort>("new");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    Promise.all([getProducts({ limit: 100 }), getBrands(), getCategories()])
      .then(([productsResponse, brandsResponse, categoriesResponse]) => {
        setProducts(productsResponse.items);
        setBrands(brandsResponse);
        setCategories(categoriesResponse);
      })
      .catch(() => {
        setProducts([]);
        setBrands([]);
        setCategories([]);
        setLoadError("Չհաջողվեց բեռնել տվյալները backend-ից։ Ստուգեք, որ API-ն գործարկված է։");
      })
      .finally(() => setIsLoading(false));
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

  const filterPanel = (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
            Ֆիլտրեր
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {activeFilters ? `${activeFilters} ակտիվ` : "Ընտրեք պարամետրերը"}
          </p>
        </div>
        {activeFilters ? (
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full border border-[#deccb9] bg-white/90 px-3 py-1.5 text-xs font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-950"
          >
            Զրոյացնել
          </button>
        ) : null}
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-zinc-800">Որոնում</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Dior, Chanel, Oud..."
            className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] focus:bg-white"
          />
        </label>
        <FilterSelect label="Բրենդ" value={brand} onChange={setBrand}>
          {brands.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label="Կատեգորիա" value={category} onChange={setCategory}>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label="Սեռ" value={gender} onChange={(value) => setGender(value as Gender | "")}>
          {genderOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          label="Բույրի տեսակ"
          value={type}
          onChange={(value) => setType(value as FragranceType | "")}
        >
          {fragranceOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label="Ծավալ" value={volume} onChange={setVolume}>
          {volumes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>
        <label className="block">
          <span className="text-sm font-semibold text-zinc-800">Գինը մինչև</span>
          <input
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            type="number"
            placeholder="50000"
            className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] focus:bg-white"
          />
        </label>
      </div>
    </>
  );

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f4f1eb_0%,#faf7f2_28%,#fffdf9_100%)]">
      <Image
        src="/images/perfume-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-12"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,249,0.95),rgba(255,253,249,0.84),rgba(255,253,249,0.96))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),transparent_48%),radial-gradient(circle_at_top_right,rgba(220,212,202,0.44),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent to-white/85" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8 lg:py-10">
        <aside className="hidden h-fit rounded-[32px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(244,240,233,0.9))] p-6 shadow-[0_26px_70px_rgba(71,58,44,0.08)] backdrop-blur lg:sticky lg:top-8 lg:block">
          {filterPanel}
        </aside>

        <main className="min-w-0">
          <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(243,238,231,0.96))] p-5 shadow-[0_28px_80px_rgba(71,58,44,0.08)] sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(116,101,86,0.12),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(221,212,201,0.48),transparent_24%)]" />
            <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
                  Aroma Parfume
                </p>
                <h1 className="mt-4 font-serif text-4xl leading-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                  Բույրերի կատալոգ
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-zinc-600 sm:text-lg">
                  Ընտրեք սիրելի նոտաները, բրենդներն ու ծավալները։ Բոլոր պատվերները ձևակերպվում են օնլայն,
                  իսկ առաքումն անվճար է։
                </p>
              </div>

              <div className="flex flex-col gap-4 lg:min-w-[320px] lg:items-end">
                <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
                  <CatalogMetric
                    label="Ապրանքներ"
                    value={isLoading ? "..." : String(filteredProducts.length)}
                  />
                  <CatalogMetric label="Առաքում" value="Անվճար" />
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-600 lg:justify-end">
                  <span className="rounded-full border border-white/80 bg-white/88 px-3 py-1.5 shadow-sm">
                    {isLoading ? "Բեռնում..." : `${filteredProducts.length} ապրանք`}
                  </span>
                  <span className="rounded-full border border-white/80 bg-white/88 px-3 py-1.5 shadow-sm">
                    Անվճար առաքում
                  </span>
                  {activeFilters ? (
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-[var(--accent-strong)] shadow-sm">
                      {activeFilters} ֆիլտր
                    </span>
                  ) : null}
                </div>

                <label className="block min-w-[240px]">
                  <span className="text-sm font-semibold text-zinc-800">Տեսակավորում</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as Sort)}
                    className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/82 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] focus:bg-white"
                  >
                    <option value="new">Նորերը</option>
                    <option value="price_asc">Ըստ գնի՝ էժանից</option>
                    <option value="price_desc">Ըստ գնի՝ թանկից</option>
                    <option value="popular">Հանրաճանաչ</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 lg:hidden">
            <button
              type="button"
              aria-expanded={isFiltersOpen}
              onClick={() => setIsFiltersOpen((current) => !current)}
              className="flex w-full items-center justify-between rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(244,240,233,0.9))] px-5 py-4 text-left font-semibold text-zinc-950 shadow-[0_18px_44px_rgba(71,58,44,0.08)] backdrop-blur"
            >
              <span>Ֆիլտրեր</span>
              <span className="flex items-center gap-2">
                {activeFilters ? (
                  <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                    {activeFilters}
                  </span>
                ) : null}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className={`h-5 w-5 text-zinc-500 transition-transform duration-200 ${
                    isFiltersOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M5 7.5 10 12.5 15 7.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>
            </button>
            {isFiltersOpen ? (
              <div className="mt-3 rounded-[28px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(244,240,233,0.9))] p-5 shadow-[0_20px_45px_rgba(71,58,44,0.08)] backdrop-blur">
                {filterPanel}
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            {loadError ? (
              <div className="mb-5 rounded-2xl border border-[var(--line)] bg-[var(--sale-soft)] px-4 py-3 text-sm font-semibold text-[var(--sale-strong)] shadow-sm">
                {loadError}
              </div>
            ) : null}
            {activeFilters ? (
              <div className="mb-6 rounded-[24px] border border-[var(--line)] bg-white/75 p-3 shadow-[0_16px_40px_rgba(71,58,44,0.06)] backdrop-blur">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-600">
                  {brand ? <ActiveChip>{brands.find((item) => item.slug === brand)?.name}</ActiveChip> : null}
                  {category ? <ActiveChip>{categories.find((item) => item.slug === category)?.name}</ActiveChip> : null}
                  {gender ? <ActiveChip>{genderOptions.find(([value]) => value === gender)?.[1]}</ActiveChip> : null}
                  {type ? <ActiveChip>{fragranceOptions.find(([value]) => value === type)?.[1]}</ActiveChip> : null}
                  {volume ? <ActiveChip>{volume}</ActiveChip> : null}
                  {search ? <ActiveChip>“{search}”</ActiveChip> : null}
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-950"
                  >
                    Զրոյացնել բոլորը
                  </button>
                </div>
              </div>
            ) : null}

            <div>
              <section className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {!filteredProducts.length ? (
                  <div className="col-span-full rounded-[28px] border border-dashed border-zinc-300 bg-white/92 p-12 text-center shadow-[0_16px_40px_rgba(92,60,30,0.06)]">
                    <p className="text-xl font-semibold text-zinc-950">
                      {isLoading ? "Բեռնում ենք ապրանքները" : "Ոչինչ չի գտնվել"}
                    </p>
                    <p className="mt-2 text-zinc-600">
                      {isLoading ? "Տվյալները բեռնվում են backend-ից։" : "Փորձեք փոխել ֆիլտրերը կամ զրոյացնել որոնումը։"}
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                    className="mt-5 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
                    >
                      Զրոյացնել ֆիլտրերը
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
        className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] focus:bg-white"
      >
        <option value="">Բոլորը</option>
        {children}
      </select>
    </label>
  );
}

function CatalogMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/82 px-4 py-3 shadow-[0_16px_36px_rgba(99,64,32,0.08)] backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">{value}</p>
    </div>
  );
}

function ActiveChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--line)] bg-white/90 px-3 py-1.5 shadow-sm">
      {children}
    </span>
  );
}
