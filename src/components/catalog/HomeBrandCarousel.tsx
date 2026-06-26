"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Brand } from "@/types/catalog";
import { BrandCard } from "./BrandCard";

const SWIPE_THRESHOLD = 40;

export function HomeBrandCarousel({ brands }: { brands: Brand[] }) {
  const [visibleCount, setVisibleCount] = useState(2);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const pointerStartXRef = useRef<number | null>(null);
  const pointerStartYRef = useRef<number | null>(null);
  const dragBlockedClickRef = useRef(false);

  useEffect(() => {
    function updateVisibleCount() {
      if (window.innerWidth >= 1024) {
        setVisibleCount(4);
        return;
      }

      setVisibleCount(2);
    }

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const maxIndex = useMemo(() => Math.max(brands.length - visibleCount, 0), [brands.length, visibleCount]);
  const safeIndex = Math.min(currentIndex, maxIndex);

  function goTo(direction: "prev" | "next") {
    setCurrentIndex((current) => {
      const baseIndex = Math.min(current, maxIndex);
      return direction === "prev" ? Math.max(baseIndex - 1, 0) : Math.min(baseIndex + 1, maxIndex);
    });
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const touchStartX = touchStartXRef.current;
    const touchStartY = touchStartYRef.current;

    if (touchStartX === null || touchStartY === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      goTo(deltaX < 0 ? "next" : "prev");
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  }

  function handleTouchCancel() {
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    pointerStartXRef.current = event.clientX;
    pointerStartYRef.current = event.clientY;
    dragBlockedClickRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const pointerStartX = pointerStartXRef.current;
    const pointerStartY = pointerStartYRef.current;

    if (event.pointerType !== "mouse" || pointerStartX === null || pointerStartY === null) {
      return;
    }

    const deltaX = event.clientX - pointerStartX;
    const deltaY = event.clientY - pointerStartY;

    if (Math.abs(deltaX) > 8) {
      dragBlockedClickRef.current = true;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
      setDragOffset(deltaX);
    }
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    const pointerStartX = pointerStartXRef.current;
    const pointerStartY = pointerStartYRef.current;

    if (event.pointerType === "mouse" && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (pointerStartX === null || pointerStartY === null) {
      setDragOffset(0);
      return;
    }

    const deltaX = event.clientX - pointerStartX;
    const deltaY = event.clientY - pointerStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      goTo(deltaX < 0 ? "next" : "prev");
    }

    pointerStartXRef.current = null;
    pointerStartYRef.current = null;
    setDragOffset(0);
  }

  function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!dragBlockedClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragBlockedClickRef.current = false;
  }

  function handleNativeDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => goTo("prev")}
          disabled={safeIndex === 0}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white text-zinc-900 shadow-sm transition hover:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Նախորդ բրենդները"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={() => goTo("next")}
          disabled={safeIndex >= maxIndex}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white shadow-sm transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:bg-zinc-300"
          aria-label="Հաջորդ բրենդները"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>

      <div
        className="touch-pan-y cursor-grab select-none overflow-hidden active:cursor-grabbing"
        onClickCapture={handleClickCapture}
        onDragStart={handleNativeDragStart}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        <div
          className={dragOffset === 0 ? "flex transition-transform duration-500 ease-out" : "flex transition-transform duration-75 ease-out"}
          style={{ transform: `translateX(calc(-${(safeIndex * 100) / visibleCount}% + ${dragOffset}px))` }}
        >
          {brands.map((brand) => (
            <div key={brand.id} className="w-1/2 shrink-0 px-1.5 sm:px-2 lg:w-1/4">
              <BrandCard brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 ${direction === "left" ? "" : "rotate-180"}`}>
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
