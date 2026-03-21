"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Container } from "./Container";

export type SponsorItem = {
  name: string;
  logoSrc?: string;
  logoAlt?: string;
  tagline?: string;
};

type SponsorSectionProps = {
  titleLine1?: string;
  titleLine2?: string;
  items?: SponsorItem[];
  className?: string;
};

const ORANGE = "var(--color-2, #ff7900)";
const VISIBLE_COUNT_DESKTOP = 3;

export function SponsorSection({
  titleLine1 = "Special Thanks to",
  titleLine2 = "Our Sponsors",
  items = [],
  className = "",
}: SponsorSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const list = items.length ? items : [];
  const needsCarouselMobile = list.length > 1;
  const needsCarouselDesktop = list.length > VISIBLE_COUNT_DESKTOP;
  const maxIndexDesktop = Math.max(0, list.length - VISIBLE_COUNT_DESKTOP);
  const visibleItemsDesktop = needsCarouselDesktop
    ? list.slice(index, index + VISIBLE_COUNT_DESKTOP)
    : list;

  const scrollToItem = (targetIndex: number) => {
    const el = scrollRef.current;
    if (!el || !needsCarouselMobile) return;
    const itemEl = el.querySelector(`[data-sponsor-index="${targetIndex}"]`);
    if (itemEl) {
      itemEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  const goPrev = () => {
    if (needsCarouselMobile) {
      const prev = index <= 0 ? list.length - 1 : index - 1;
      setIndex(prev);
      scrollToItem(prev);
    } else if (needsCarouselDesktop) {
      setIndex((i) => (i <= 0 ? maxIndexDesktop : i - 1));
    }
  };

  const goNext = () => {
    if (needsCarouselMobile) {
      const next = index >= list.length - 1 ? 0 : index + 1;
      setIndex(next);
      scrollToItem(next);
    } else if (needsCarouselDesktop) {
      setIndex((i) => (i >= maxIndexDesktop ? 0 : i + 1));
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const itemWidth = el.scrollWidth / list.length;
    const newIndex = Math.round(scrollLeft / itemWidth);
    setIndex(Math.min(newIndex, list.length - 1));
  };

  if (!list.length) return null;

  return (
    <div className={`bg-white py-12 md:py-16 ${className}`}>
      <Container>
        <div className="text-center mb-8 md:mb-10">
          <p className="text-base md:text-lg text-slate-700">{titleLine1}</p>
          <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            {titleLine2}
          </h2>
        </div>

        <div className="flex items-center justify-center gap-2 md:gap-4 px-4">
          {/* Left arrow */}
          {(needsCarouselMobile || needsCarouselDesktop) ? (
            <button
              type="button"
              onClick={goPrev}
              className="shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{ color: ORANGE }}
              aria-label="Previous sponsors"
            >
              <span
                className="block w-0 h-0 border-y-8 border-r-12 border-l-0 border-solid border-y-transparent border-r-current md:border-y-10 md:border-r-14"
                aria-hidden
              />
            </button>
          ) : (
            <div className="w-10 md:w-12 shrink-0" aria-hidden />
          )}

          {/* Mobile: scroll carousel (one sponsor, smooth scroll) */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="md:hidden flex-1 min-w-0 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide"
          >
            <div className="flex gap-6">
              {list.map((item, i) => (
                <div
                  key={`${item.name}-${i}`}
                  data-sponsor-index={i}
                  className="shrink-0 w-full min-w-full snap-center flex flex-col items-center justify-center text-center px-4"
                >
                  {item.logoSrc ? (
                    <div className="relative w-full max-w-[180px] aspect-2/1 mx-auto flex items-center justify-center">
                      <Image
                        src={item.logoSrc}
                        alt={item.logoAlt ?? item.name}
                        width={180}
                        height={90}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-[180px] aspect-2/1 mx-auto flex items-center justify-center bg-slate-100 rounded text-slate-500 text-sm font-semibold">
                      {item.name}
                    </div>
                  )}
                  <p className="mt-3 text-sm font-bold text-slate-900">{item.name}</p>
                  {item.tagline ? (
                    <p className="mt-1 text-xs text-slate-600">{item.tagline}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: static row of 3 */}
          <div className="hidden md:flex flex-1 flex-row items-stretch justify-center gap-6 lg:gap-10 min-w-0 max-w-5xl">
            {visibleItemsDesktop.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="flex-1 min-w-0 flex flex-col items-center justify-center text-center px-4"
              >
                {item.logoSrc ? (
                  <div className="relative w-full max-w-[180px] aspect-2/1 mx-auto flex items-center justify-center">
                    <Image
                      src={item.logoSrc}
                      alt={item.logoAlt ?? item.name}
                      width={180}
                      height={90}
                      className="w-full h-auto object-contain max-h-full"
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-[180px] aspect-2/1 mx-auto flex items-center justify-center bg-slate-100 rounded text-slate-500 text-sm font-semibold">
                    {item.name}
                  </div>
                )}
                <p className="mt-3 text-sm lg:text-base font-bold text-slate-900">{item.name}</p>
                {item.tagline ? (
                  <p className="mt-1 text-xs lg:text-sm text-slate-600">{item.tagline}</p>
                ) : null}
              </div>
            ))}
          </div>

          {/* Right arrow */}
          {(needsCarouselMobile || needsCarouselDesktop) ? (
            <button
              type="button"
              onClick={goNext}
              className="shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{ color: ORANGE }}
              aria-label="Next sponsors"
            >
              <span
                className="block w-0 h-0 border-y-8 border-l-12 border-r-0 border-solid border-y-transparent border-l-current md:border-y-10 md:border-l-14"
                aria-hidden
              />
            </button>
          ) : (
            <div className="w-10 md:w-12 shrink-0" aria-hidden />
          )}
        </div>
      </Container>
    </div>
  );
}
