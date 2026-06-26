"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { formatPrice, fragranceLabels, genderLabels } from "@/lib/dictionaries";
import { imageUrl } from "@/lib/images";
import { fallbackProductImage, normalizeProductVariants } from "@/lib/product-variants";
import { Product, ProductVariant } from "@/types/catalog";

export function ProductDetails({ product }: { product: Product }) {
  const variants = useMemo<ProductVariant[]>(() => normalizeProductVariants(product), [product]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedVariant = variants[selectedVariantIndex] ?? variants[0];
  const images = selectedVariant?.images?.length ? selectedVariant.images : [fallbackProductImage];
  const selectedImage = images[selectedImageIndex] ?? images[0] ?? fallbackProductImage;
  const oldPrice = selectedVariant?.oldPrice ? Number(selectedVariant.oldPrice) : undefined;
  const discount =
    oldPrice && selectedVariant && oldPrice > Number(selectedVariant.price)
      ? Math.round((1 - Number(selectedVariant.price) / oldPrice) * 100)
      : 0;

  useEffect(() => {
    setSelectedVariantIndex(0);
    setSelectedImageIndex(0);
  }, [product.id, variants.length]);

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
          <Link href="/" className="transition hover:text-[var(--accent-strong)]">
            Գլխավոր
          </Link>
          <BreadcrumbArrow />
          <Link href="/catalog" className="transition hover:text-[var(--accent-strong)]">
            Կատալոգ
          </Link>
          {product.category?.name && product.category?.slug ? (
            <>
              <BreadcrumbArrow />
              <Link
                href={`/catalog?category=${encodeURIComponent(product.category.slug)}`}
                className="transition hover:text-[var(--accent-strong)]"
              >
                {product.category.name}
              </Link>
            </>
          ) : null}
          {product.brand?.name ? (
            <>
              <BreadcrumbArrow />
              <Link
                href={
                  product.brand?.slug
                    ? `/catalog?brand=${encodeURIComponent(product.brand.slug)}`
                    : "/brands"
                }
                className="transition hover:text-[var(--accent-strong)]"
              >
                {product.brand.name}
              </Link>
            </>
          ) : null}
          <BreadcrumbArrow />
          <span className="text-[var(--foreground)]">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <div className="relative aspect-[1/1.02] overflow-hidden rounded-[30px] border border-[var(--line)] bg-[var(--surface-muted)] shadow-[0_24px_65px_rgba(0,0,0,0.3)]">
              <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                {product.isNew ? <Badge>նոր</Badge> : null}
                {product.isFeatured ? <Badge tone="dark">հիթ</Badge> : null}
                {discount ? <Badge tone="sale">-{discount}%</Badge> : null}
              </div>
              <Image
                key={selectedImage}
                src={imageUrl(selectedImage)}
                alt={product.name}
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
                    alt={`${product.name} ${index + 1}`}
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
              {product.brand?.name ?? "Aroma Parfume"}
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.02] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-soft)] sm:text-lg">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[var(--accent-strong)]">
              <span className="rounded-full border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-1.5">{genderLabels[product.gender]}</span>
              <span className="rounded-full border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-1.5">
                {fragranceLabels[product.fragranceType]}
              </span>
              <span className="rounded-full border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-1.5">
                {product.concentration || "Eau de Parfum"}
              </span>
            </div>

            <div className="mt-8 border-y border-[var(--line)] py-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">Ընտրեք ծավալը</p>
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
                    {variant.volume}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">Գին</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-3">
                  <p className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
                    {formatPrice(selectedVariant?.price ?? product.price)}
                  </p>
                  {oldPrice ? (
                    <p className="text-lg text-[var(--text-muted)] line-through">{formatPrice(oldPrice)}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a
                href={`https://wa.me/37433696009?text=${encodeURIComponent(
                  `Բարև ձեզ, հետաքրքրում է ${product.name} ${selectedVariant.volume}`,
                )}`}
                className="inline-flex justify-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[#171717] transition hover:border-[var(--accent-strong)] hover:bg-[var(--accent-strong)]"
              >
                Գրել WhatsApp-ով
              </a>
              <a
                href="https://instagram.com/aroma__parfume"
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-6 py-3.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
              >
                Գրել Instagram-ում
              </a>
            </div>
            <p className="mt-4 text-sm text-[var(--text-muted)]">Օնլայն պատվեր։ Անվճար առաքում՝ համաձայնությամբ։</p>
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
