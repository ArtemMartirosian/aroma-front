"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Product } from "@/types/catalog";
import { ProductCard } from "./ProductCard";

export function HomeProductCarousel({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(2);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    function updateVisibleCount() {
      setVisibleCount(window.innerWidth >= 1024 ? 3 : 2);
    }

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const maxIndex = useMemo(
    () => Math.max(products.length - visibleCount, 0),
    [products.length, visibleCount],
  );

  useEffect(() => {
    setCurrentIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    function syncIndex() {
      const currentContainer = containerRef.current;
      if (!currentContainer) {
        return;
      }
      const step = currentContainer.clientWidth / visibleCount;
      if (!step) {
        return;
      }

      const nextIndex = Math.max(0, Math.min(Math.round(currentContainer.scrollLeft / step), maxIndex));
      setCurrentIndex(nextIndex);
    }

    syncIndex();
    container.addEventListener("scroll", syncIndex, { passive: true });
    window.addEventListener("resize", syncIndex);

    return () => {
      container.removeEventListener("scroll", syncIndex);
      window.removeEventListener("resize", syncIndex);
    };
  }, [maxIndex, visibleCount]);

  function scrollToIndex(index: number) {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const safeIndex = Math.max(0, Math.min(index, maxIndex));
    const currentContainer = containerRef.current;
    if (!currentContainer) {
      return;
    }
    const step = currentContainer.clientWidth / visibleCount;

    currentContainer.scrollTo({
      left: step * safeIndex,
      behavior: "smooth",
    });
    setCurrentIndex(safeIndex);
  }

  function goTo(direction: "prev" | "next") {
    scrollToIndex(direction === "prev" ? currentIndex - 1 : currentIndex + 1);
  }

  function handleArrowPointerUp(direction: "prev" | "next") {
    return (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse") {
        return;
      }
      goTo(direction);
    };
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => goTo("prev")}
          onPointerUp={handleArrowPointerUp("prev")}
          disabled={currentIndex === 0}
          className="relative z-10 inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] text-[var(--foreground)] shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Նախորդ ապրանքները"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={() => goTo("next")}
          onPointerUp={handleArrowPointerUp("next")}
          disabled={currentIndex >= maxIndex}
          className="relative z-10 inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent)] text-[#171717] shadow-sm transition hover:border-[var(--accent-strong)] hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Հաջորդ ապրանքները"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="no-scrollbar overflow-x-auto scroll-smooth snap-x snap-mandatory"
      >
        <div className="flex">
          {products.map((product) => (
            <div key={product.id} className="w-1/2 shrink-0 snap-start px-1.5 sm:px-2 lg:w-1/3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 ${direction === "left" ? "" : "rotate-180"}`}
    >
      <path
        d="M12.5 4.5 7 10l5.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
