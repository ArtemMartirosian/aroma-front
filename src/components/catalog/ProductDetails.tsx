"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { formatPrice, fragranceLabels, genderLabels } from "@/lib/dictionaries";
import { imageUrl } from "@/lib/images";
import { Product, ProductVariant } from "@/types/catalog";

const fallbackImage = "/images/products/perfume-card-1.png";

export function ProductDetails({ product }: { product: Product }) {
  const variants = useMemo<ProductVariant[]>(
    () =>
      product.variants?.length
        ? product.variants
        : [
            {
              volume: product.volume,
              price: product.price,
              oldPrice: product.oldPrice,
              images: [fallbackImage],
            },
          ],
    [product],
  );
  const [selectedVolume, setSelectedVolume] = useState(variants[0]?.volume ?? product.volume);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedVariant = variants.find((variant) => variant.volume === selectedVolume) ?? variants[0];
  const images = selectedVariant?.images?.length ? selectedVariant.images : [fallbackImage];
  const selectedImage = images[selectedImageIndex] ?? images[0] ?? fallbackImage;
  const oldPrice = selectedVariant?.oldPrice ? Number(selectedVariant.oldPrice) : undefined;
  const discount =
    oldPrice && selectedVariant && oldPrice > Number(selectedVariant.price)
      ? Math.round((1 - Number(selectedVariant.price) / oldPrice) * 100)
      : 0;

  function selectVariant(volume: string) {
    setSelectedVolume(volume);
    setSelectedImageIndex(0);
  }

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/80 bg-[#fffaf5] p-4 shadow-[0_28px_80px_rgba(99,64,32,0.12)] sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(190,115,74,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.86),rgba(250,241,232,0.76))]" />
      <div className="relative">
        <nav className="mb-7 flex flex-wrap items-center gap-2 text-sm font-medium text-zinc-500">
          <Link href="/" className="transition hover:text-zinc-950">
            Главная
          </Link>
          <BreadcrumbArrow />
          <Link href="/catalog" className="transition hover:text-zinc-950">
            Каталог
          </Link>
          {product.brand?.name ? (
            <>
              <BreadcrumbArrow />
              <Link href="/brands" className="transition hover:text-zinc-950">
                {product.brand.name}
              </Link>
            </>
          ) : null}
          <BreadcrumbArrow />
          <span className="text-zinc-950">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="relative aspect-[1/1.02] overflow-hidden rounded-[30px] border border-[#eadaca] bg-white shadow-[0_24px_65px_rgba(80,52,24,0.12)]">
              <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                {product.isNew ? <Badge>new</Badge> : null}
                {product.isFeatured ? <Badge tone="dark">hit</Badge> : null}
                {discount ? <Badge tone="sale">-{discount}%</Badge> : null}
              </div>
              <Image
                src={imageUrl(selectedImage)}
                alt={product.name}
                fill
                priority
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
                  className={
                    index === selectedImageIndex
                      ? "relative aspect-square overflow-hidden rounded-2xl border border-zinc-950 bg-white shadow-sm"
                      : "relative aspect-square overflow-hidden rounded-2xl border border-[#eadaca] bg-white opacity-75 transition hover:opacity-100"
                  }
                >
                  <Image
                    src={imageUrl(image)}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/90 bg-white/86 p-5 shadow-[0_22px_60px_rgba(80,52,24,0.08)] backdrop-blur sm:p-7 lg:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#9b123f]">
              {product.brand?.name ?? "Aroma Parfume"}
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.02] text-zinc-950 sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-zinc-700">
              <span className="rounded-full bg-[#f6eee5] px-3 py-1.5">{genderLabels[product.gender]}</span>
              <span className="rounded-full bg-[#f6eee5] px-3 py-1.5">
                {fragranceLabels[product.fragranceType]}
              </span>
              <span className="rounded-full bg-[#f6eee5] px-3 py-1.5">
                {product.concentration || "Eau de Parfum"}
              </span>
            </div>

            <div className="mt-8 border-y border-[#eadaca] py-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">Выберите объем</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.volume}
                    type="button"
                    onClick={() => selectVariant(variant.volume)}
                    className={
                      variant.volume === selectedVariant.volume
                        ? "rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
                        : "rounded-full border border-[#dfcebc] bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-950"
                    }
                  >
                    {variant.volume}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">Цена</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-3">
                  <p className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
                    {formatPrice(selectedVariant?.price ?? product.price)}
                  </p>
                  {oldPrice ? (
                    <p className="text-lg text-zinc-400 line-through">{formatPrice(oldPrice)}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a
                href={`https://wa.me/37433696009?text=${encodeURIComponent(
                  `Здравствуйте, интересует ${product.name} ${selectedVariant.volume}`,
                )}`}
                className="inline-flex justify-center rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#9b123f]"
              >
                Написать в WhatsApp
              </a>
              <a
                href="https://instagram.com/aroma__parfume"
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center rounded-full border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
              >
                Написать в Instagram
              </a>
            </div>
            <p className="mt-4 text-sm text-zinc-500">Онлайн-заказ. Бесплатная доставка по договоренности.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BreadcrumbArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 text-zinc-300">
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
      ? "bg-zinc-950 text-white"
      : tone === "sale"
        ? "bg-rose-100 text-rose-800"
        : "bg-emerald-100 text-emerald-800";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold lowercase shadow-sm ${className}`}>
      {children}
    </span>
  );
}
