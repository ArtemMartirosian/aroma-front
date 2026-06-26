"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { fragranceOptions, genderOptions } from "@/lib/dictionaries";
import { getBrands, getCategories, getProducts } from "@/lib/api";
import { Brand, Category, FragranceType, Gender, Product } from "@/types/catalog";

type Sort = "new" | "price_asc" | "price_desc" | "popular";
const PRODUCTS_BATCH_SIZE = 12;

export function CatalogClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlState = useMemo(() => readCatalogQuery(searchParams), [searchParams]);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState(urlState.search);
  const [brand, setBrand] = useState(urlState.brand);
  const [category, setCategory] = useState(urlState.category);
  const [gender, setGender] = useState<Gender | "">(urlState.gender);
  const [type, setType] = useState<FragranceType | "">(urlState.type);
  const [volume, setVolume] = useState(urlState.volume);
  const [maxPrice, setMaxPrice] = useState(urlState.maxPrice);
  const [sort, setSort] = useState<Sort>(urlState.sort);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_BATCH_SIZE);

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

  useEffect(() => {
    setSearch(urlState.search);
    setBrand(urlState.brand);
    setCategory(urlState.category);
    setGender(urlState.gender);
    setType(urlState.type);
    setVolume(urlState.volume);
    setMaxPrice(urlState.maxPrice);
    setSort(urlState.sort);
  }, [urlState]);

  useEffect(() => {
    setVisibleCount(PRODUCTS_BATCH_SIZE);
  }, [search, brand, category, gender, type, volume, maxPrice, sort]);

  useEffect(() => {
    const nextQuery = buildCatalogQuery({
      search,
      brand,
      category,
      gender,
      type,
      volume,
      maxPrice,
      sort,
    });
    const currentQuery = searchParams.toString();

    if (nextQuery === currentQuery) {
      return;
    }

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [brand, category, gender, maxPrice, pathname, router, search, searchParams, sort, type, volume]);

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
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = filteredProducts.length > visibleCount;

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

  function showMoreProducts() {
    setVisibleCount((current) => current + PRODUCTS_BATCH_SIZE);
  }

  const filterPanel = (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
            Ֆիլտրեր
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            {activeFilters ? `${activeFilters} ակտիվ` : "Ընտրեք պարամետրերը"}
          </p>
        </div>
        {activeFilters ? (
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            Զրոյացնել
          </button>
        ) : null}
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-[var(--foreground)]">Որոնում</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Dior, Chanel, Oud..."
            className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
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
          <span className="text-sm font-semibold text-[var(--foreground)]">Գինը մինչև</span>
          <input
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            type="number"
            placeholder="50000"
            className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
          />
        </label>
      </div>
    </>
  );

  return (
    <div className="relative overflow-hidden bg-transparent">
      <Image
        src="/images/perfume-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-12"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,11,12,0.95),rgba(10,11,12,0.84),rgba(10,11,12,0.96))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_left,rgba(195,164,111,0.14),transparent_48%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent to-black/30" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8 lg:py-10">
        <aside className="hidden h-fit rounded-[32px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(21,24,25,0.95),rgba(29,33,34,0.92))] p-6 shadow-[0_26px_70px_rgba(0,0,0,0.32)] backdrop-blur lg:sticky lg:top-8 lg:block">
          {filterPanel}
        </aside>

        <main className="min-w-0">
          <div className="relative overflow-hidden rounded-[34px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(21,24,25,0.95),rgba(29,33,34,0.94))] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(195,164,111,0.14),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(255,255,255,0.04),transparent_24%)]" />
            <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
                  Aroma Parfume
                </p>
                <h1 className="mt-4 font-serif text-4xl leading-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                  Բույրերի կատալոգ
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--text-soft)] sm:text-lg">
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

                <label className="block min-w-[240px]">
                  <span className="text-sm font-semibold text-[var(--foreground)]">Տեսակավորում</span>
                  <div className="relative mt-2">
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value as Sort)}
                      className="w-full appearance-none rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 pr-12 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
                    >
                      <option value="new">Նորերը</option>
                      <option value="price_asc">Ըստ գնի՝ էժանից</option>
                      <option value="price_desc">Ըստ գնի՝ թանկից</option>
                      <option value="popular">Հանրաճանաչ</option>
                    </select>
                    <SelectChevron />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 lg:hidden">
            <button
              type="button"
              aria-expanded={isFiltersOpen}
              onClick={() => setIsFiltersOpen((current) => !current)}
              className="flex w-full items-center justify-between rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(21,24,25,0.95),rgba(29,33,34,0.92))] px-5 py-4 text-left font-semibold text-[var(--foreground)] shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur"
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
                  className={`h-5 w-5 text-[var(--text-muted)] transition-transform duration-200 ${
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
              <div className="mt-3 rounded-[28px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(21,24,25,0.95),rgba(29,33,34,0.92))] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.28)] backdrop-blur">
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
              <div className="mb-6 rounded-[24px] border border-[var(--line)] bg-[rgba(21,24,25,0.78)] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--text-soft)]">
                  {brand ? <ActiveChip>{brands.find((item) => item.slug === brand)?.name}</ActiveChip> : null}
                  {category ? <ActiveChip>{categories.find((item) => item.slug === category)?.name}</ActiveChip> : null}
                  {gender ? <ActiveChip>{genderOptions.find(([value]) => value === gender)?.[1]}</ActiveChip> : null}
                  {type ? <ActiveChip>{fragranceOptions.find(([value]) => value === type)?.[1]}</ActiveChip> : null}
                  {volume ? <ActiveChip>{volume}</ActiveChip> : null}
                  {search ? <ActiveChip>“{search}”</ActiveChip> : null}
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
                  >
                    Զրոյացնել բոլորը
                  </button>
                </div>
              </div>
            ) : null}

            <div>
              <section className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                {isLoading ? (
                  Array.from({ length: PRODUCTS_BATCH_SIZE }).map((_, index) => <ProductCardSkeleton key={index} />)
                ) : filteredProducts.length ? (
                  visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)
                ) : (
                  <div className="col-span-full rounded-[28px] border border-dashed border-[var(--line)] bg-[var(--surface-elevated)] p-12 text-center shadow-[0_16px_40px_rgba(0,0,0,0.24)]">
                    <p className="text-xl font-semibold text-[var(--foreground)]">Ոչինչ չի գտնվել</p>
                    <p className="mt-2 text-[var(--text-soft)]">
                      Փորձեք փոխել ֆիլտրերը կամ զրոյացնել որոնումը։
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-5 rounded-full border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#171717] transition hover:border-[var(--accent-strong)] hover:bg-[var(--accent-strong)]"
                    >
                      Զրոյացնել ֆիլտրերը
                    </button>
                  </div>
                )}
              </section>
              {!isLoading && hasMoreProducts ? (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={showMoreProducts}
                    className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#171717] transition hover:border-[var(--accent-strong)] hover:bg-[var(--accent-strong)]"
                  >
                      Տեսնել ավելին
                  </button>
                </div>
              ) : null}
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
      <span className="text-sm font-semibold text-[var(--foreground)]">{label}</span>
      <div className="relative mt-2">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 pr-12 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
        >
          <option value="">Բոլորը</option>
          {children}
        </select>
        <SelectChevron />
      </div>
    </label>
  );
}

function SelectChevron() {
  return (
    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[var(--text-soft)]">
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
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
  );
}

function CatalogMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(21,24,25,0.74)] px-4 py-3 shadow-[0_16px_36px_rgba(0,0,0,0.24)] backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function ActiveChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-1.5 shadow-sm">
      {children}
    </span>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[var(--line)] bg-[var(--surface-elevated)] sm:rounded-[24px]">
      <div className="aspect-[3.5/4] animate-pulse bg-[var(--surface-muted)] sm:aspect-[4/3]" />
      <div className="space-y-3 p-2.5 sm:p-4">
        <div className="h-3 w-20 animate-pulse rounded-full bg-[var(--surface-muted)]" />
        <div className="space-y-2">
          <div className="h-5 w-full animate-pulse rounded-full bg-[var(--surface-muted)]" />
          <div className="h-5 w-3/4 animate-pulse rounded-full bg-[var(--surface-muted)]" />
        </div>
        <div className="h-px w-12 bg-[var(--line)]" />
        <div className="flex gap-2">
          <div className="h-8 w-14 animate-pulse rounded-full bg-[var(--surface-muted)]" />
          <div className="h-8 w-14 animate-pulse rounded-full bg-[var(--surface-muted)]" />
          <div className="h-8 w-16 animate-pulse rounded-full bg-[var(--surface-muted)]" />
        </div>
        <div className="flex flex-col gap-2.5 border-t border-[var(--line)] pt-2.5 sm:flex-row sm:items-end sm:justify-between">
          <div className="h-8 w-28 animate-pulse rounded-full bg-[var(--surface-muted)]" />
          <div className="h-10 w-full animate-pulse rounded-full bg-[var(--surface-muted)] sm:w-28" />
        </div>
      </div>
    </div>
  );
}

function readCatalogQuery(searchParams: { get: (key: string) => string | null }) {
  const genderValue = searchParams.get("gender");
  const typeValue = searchParams.get("type");
  const sortValue = searchParams.get("sort");

  return {
    search: searchParams.get("search") ?? "",
    brand: searchParams.get("brand") ?? "",
    category: searchParams.get("category") ?? "",
    gender: (isGender(genderValue) ? genderValue : "") as Gender | "",
    type: (isFragranceType(typeValue) ? typeValue : "") as FragranceType | "",
    volume: searchParams.get("volume") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    sort: isSort(sortValue) ? sortValue : "new",
  };
}

function buildCatalogQuery({
  search,
  brand,
  category,
  gender,
  type,
  volume,
  maxPrice,
  sort,
}: {
  search: string;
  brand: string;
  category: string;
  gender: Gender | "";
  type: FragranceType | "";
  volume: string;
  maxPrice: string;
  sort: Sort;
}) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (brand) params.set("brand", brand);
  if (category) params.set("category", category);
  if (gender) params.set("gender", gender);
  if (type) params.set("type", type);
  if (volume) params.set("volume", volume);
  if (maxPrice) params.set("maxPrice", maxPrice);
  if (sort !== "new") params.set("sort", sort);

  return params.toString();
}

function isGender(value: string | null): value is Gender {
  return value === "male" || value === "female" || value === "unisex";
}

function isFragranceType(value: string | null): value is FragranceType {
  return (
    value === "woody" ||
    value === "floral" ||
    value === "citrus" ||
    value === "oriental" ||
    value === "fresh" ||
    value === "sweet" ||
    value === "spicy"
  );
}

function isSort(value: string | null): value is Sort {
  return value === "new" || value === "price_asc" || value === "price_desc" || value === "popular";
}
