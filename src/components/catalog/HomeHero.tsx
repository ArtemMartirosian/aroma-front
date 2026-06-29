"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const heroSlides = [
  "/images/perfume-hero.png",
  "/images/perfume-hero-women.png",
  "/images/perfume-hero-men-1.png",
  "/images/perfume-hero-men-2.png",
];

export function HomeHero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative min-h-[680px] overflow-hidden bg-[var(--background)]">
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <Image
            key={slide}
            src={slide}
            alt=""
            aria-hidden="true"
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover transition-all duration-1000 ease-out ${
              index === activeSlide ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,11,12,0.96),rgba(10,11,12,0.84),rgba(10,11,12,0.32))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(195,164,111,0.12),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Օծանելիք, կոսմետիկա և աքսեսուարներ
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight text-[var(--foreground)] md:text-7xl">
            Գտեք ձեր սիրելի գեղեցկության ընտրանին
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text-soft)]">
            Ժամանակակից օնլայն կատալոգ՝ օծանելիք, կոսմետիկա և աքսեսուարներ
            մեկ վայրում։ Համեմատեք բրենդները, տարբերակներն ու գները և արագ
            կապ հաստատեք պատվերի համար։
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#171717] transition hover:border-[var(--accent-strong)] hover:bg-[var(--accent-strong)]"
            >
              Դիտել կատալոգը
            </Link>
            <Link
              href="/contacts"
              className="rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
            >
              Կապ
            </Link>
          </div>

          <div className="mt-8 flex gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={`${slide}-dot`}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeSlide ? "w-8 bg-[var(--accent)]" : "w-2.5 bg-white/35 hover:bg-white/50"
                }`}
                aria-label={`Սլայդ ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
