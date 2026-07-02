"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocale } from "@/components/catalog/LocaleProvider";
import { formatPrice, getFragranceLabels, getGenderLabels } from "@/lib/dictionaries";
import { isAccessoiresCategory, isParfumeProduct } from "@/lib/category-groups";
import { imageUrl } from "@/lib/images";
import { getLocalizedField } from "@/lib/localized";
import { fallbackProductImage, normalizeProductVariants } from "@/lib/product-variants";
import { localizePath } from "@/lib/routing";
import { Product, ProductVariant } from "@/types/catalog";

export function ProductDetails({
  product,
  initialVariant,
}: {
  product: Product;
  initialVariant?: string;
}) {
  const { locale, messages } = useLocale();
  const variants = useMemo<ProductVariant[]>(() => normalizeProductVariants(product), [product]);
  const genderLabels = useMemo(() => getGenderLabels(locale), [locale]);
  const fragranceLabels = useMemo(() => getFragranceLabels(locale), [locale]);
  const initialVariantIndex = useMemo(() => {
    if (!initialVariant?.trim()) {
      return 0;
    }

    const matchedIndex = variants.findIndex(
      (variant) => variant.volume?.trim().toLowerCase() === initialVariant.trim().toLowerCase(),
    );

    return matchedIndex >= 0 ? matchedIndex : 0;
  }, [initialVariant, variants]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(initialVariantIndex);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedVariant = variants[selectedVariantIndex] ?? variants[0];
  const images = selectedVariant?.images?.filter(Boolean)?.length
    ? selectedVariant.images.filter(Boolean)
    : variants.flatMap((variant) => variant.images ?? []).filter(Boolean).length
      ? variants.flatMap((variant) => variant.images ?? []).filter(Boolean)
      : [fallbackProductImage];
  const selectedImage = images[selectedImageIndex] ?? images[0] ?? fallbackProductImage;
  const perfumeProduct = isParfumeProduct(product);
  const isAccessoiresProduct = isAccessoiresCategory(product.category?.slug);
  const productName = getLocalizedField(product, "name", locale) || product.name;
  const productDescription = getLocalizedField(product, "description", locale) || product.description;
  const brandName = product.brand ? getLocalizedField(product.brand, "name", locale) || product.brand.name : "Aroma Parfume";
  const categoryName = product.category ? getLocalizedField(product.category, "name", locale) || product.category.name : "";
  const topNotes = getLocalizedField(product, "topNotes", locale);
  const middleNotes = getLocalizedField(product, "middleNotes", locale);
  const baseNotes = getLocalizedField(product, "baseNotes", locale);
  const concentration = getLocalizedField(product, "concentration", locale) || product.concentration;
  const selectedVolumeLabel = selectedVariant?.volume?.trim();
  const hasVariantChoices = !isAccessoiresProduct && variants.length > 1;
  const shouldShowVolume = !isAccessoiresProduct && Boolean(selectedVolumeLabel);
  const oldPrice = selectedVariant?.oldPrice ? Number(selectedVariant.oldPrice) : undefined;
  const discount =
    oldPrice && selectedVariant && oldPrice > Number(selectedVariant.price)
      ? Math.round((1 - Number(selectedVariant.price) / oldPrice) * 100)
      : 0;

  useEffect(() => {
    setSelectedVariantIndex(initialVariantIndex);
    setSelectedImageIndex(0);
  }, [initialVariantIndex, product.id, variants.length]);

  function selectVariant(index: number) {
    setSelectedVariantIndex(index);
    setSelectedImageIndex(0);
  }

  function handleVariantPointerUp(index: number) {
    return (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse") {
        return;
      }
      selectVariant(index);
    };
  }

  function handleImagePointerUp(index: number) {
    return (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse") {
        return;
      }
      setSelectedImageIndex(index);
    };
  }

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(195,164,111,0.12),transparent_28%),linear-gradient(135deg,rgba(21,24,25,0.92),rgba(29,33,34,0.84))]" />
      <div className="relative">
        <nav className="mb-7 flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
          <Link href={localizePath(locale, "/")} className="transition hover:text-[var(--accent-strong)]">
            {messages.product.breadcrumbHome}
          </Link>
          <BreadcrumbArrow />
          <Link href={localizePath(locale, "/catalog")} className="transition hover:text-[var(--accent-strong)]">
            {messages.product.breadcrumbCatalog}
          </Link>
          {product.category?.name && product.category?.slug ? (
            <>
              <BreadcrumbArrow />
              <Link
                href={localizePath(locale, `/catalog?category=${encodeURIComponent(product.category.slug)}`)}
                className="transition hover:text-[var(--accent-strong)]"
              >
                {categoryName}
              </Link>
            </>
          ) : null}
          {product.brand?.name ? (
            <>
              <BreadcrumbArrow />
              <Link
                href={
                  product.brand?.slug
                    ? localizePath(locale, `/catalog?brand=${encodeURIComponent(product.brand.slug)}`)
                    : localizePath(locale, "/brands")
                }
                className="transition hover:text-[var(--accent-strong)]"
              >
                {brandName}
              </Link>
            </>
          ) : null}
          <BreadcrumbArrow />
          <span className="text-[var(--foreground)]">{productName}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <div className="relative aspect-[1/1.02] overflow-hidden rounded-[30px] border border-[var(--line)] bg-[var(--surface-muted)] shadow-[0_24px_65px_rgba(0,0,0,0.3)]">
              <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                {product.isNew ? <Badge>{messages.product.new}</Badge> : null}
                {product.isFeatured ? <Badge tone="dark">{messages.product.hit}</Badge> : null}
                {discount ? <Badge tone="sale">-{discount}%</Badge> : null}
              </div>
              <Image
                key={selectedImage}
                src={imageUrl(selectedImage)}
                alt={productName}
                fill
                priority
                unoptimized
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/18 to-transparent" />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  onPointerUp={handleImagePointerUp(index)}
                  className={
                    index === selectedImageIndex
                      ? "relative aspect-square touch-manipulation overflow-hidden rounded-2xl border border-[var(--accent)] bg-[var(--surface-muted)] shadow-sm"
                      : "relative aspect-square touch-manipulation overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] opacity-75 transition hover:opacity-100"
                  }
                >
                  <Image
                    src={imageUrl(image)}
                    alt={`${productName} ${index + 1}`}
                    fill
                    unoptimized
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-[var(--line)] bg-[rgba(24,28,29,0.88)] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur sm:p-7 lg:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-[var(--accent)]">
              {brandName}
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.02] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              {productName}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-soft)] sm:text-lg">
              {productDescription}
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[var(--accent-strong)]">
              {product.gender ? (
                <span className="rounded-full border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-1.5">
                  {genderLabels[product.gender]}
                </span>
              ) : null}
              {perfumeProduct && product.fragranceType ? (
                <span className="rounded-full border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-1.5">
                  {fragranceLabels[product.fragranceType]}
                </span>
              ) : null}
              {perfumeProduct && product.concentration ? (
                <span className="rounded-full border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-1.5">
                  {concentration}
                </span>
              ) : null}
            </div>

            {hasVariantChoices ? (
              <div className="mt-8 border-y border-[var(--line)] py-6">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                  {perfumeProduct ? messages.product.chooseVolume : messages.product.chooseVariant}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {variants.map((variant, index) => (
                    <button
                      key={`${variant.volume}-${variant.price}-${index}`}
                      type="button"
                      onClick={() => selectVariant(index)}
                      onPointerUp={handleVariantPointerUp(index)}
                      className={
                        index === selectedVariantIndex
                          ? "touch-manipulation rounded-full border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#171717] shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
                          : "touch-manipulation rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-5 py-2.5 text-sm font-semibold text-[var(--text-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
                      }
                    >
                      {variant.volume?.trim() || messages.product.variant(index)}
                    </button>
                  ))}
                </div>
              </div>
            ) : shouldShowVolume ? (
              <div className="mt-8 border-y border-[var(--line)] py-6">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                  {perfumeProduct ? messages.product.volume : messages.product.variantLabel}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#171717] shadow-[0_12px_28px_rgba(0,0,0,0.2)]">
                    {selectedVolumeLabel}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">{messages.product.price}</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-3">
                  <p className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
                    {formatPrice(selectedVariant?.price ?? product.price, locale)}
                  </p>
                  {oldPrice ? (
                    <p className="text-lg text-[var(--text-muted)] line-through">{formatPrice(oldPrice, locale)}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a
                href={`https://wa.me/37433696009?text=${encodeURIComponent(
                  messages.product.inquiry(productName, selectedVariant.volume),
                )}`}
                className="inline-flex justify-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[#171717] transition hover:border-[var(--accent-strong)] hover:bg-[var(--accent-strong)]"
              >
                {messages.product.whatsapp}
              </a>
              <a
                href="https://instagram.com/aroma___parfumee"
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-6 py-3.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
              >
                {messages.product.instagram}
              </a>
            </div>
            <p className="mt-4 text-sm text-[var(--text-muted)]">{messages.product.contactDelivery}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BreadcrumbArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[var(--line-strong)]">
      <path
        d="M6 3.5 10.5 8 6 12.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function Badge({ children, tone = "soft" }: { children: ReactNode; tone?: "soft" | "dark" | "sale" }) {
  const className =
    tone === "dark"
      ? "bg-[rgba(14,16,17,0.95)] text-[var(--foreground)]"
      : tone === "sale"
        ? "bg-[var(--sale-soft)] text-[var(--sale-strong)]"
        : "bg-[var(--sage-soft)] text-[var(--sage-strong)]";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold lowercase shadow-sm ${className}`}>
      {children}
    </span>
  );
}
