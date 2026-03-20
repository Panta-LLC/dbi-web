"use client";

import Image from "next/image";
import { useState } from "react";
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
const VISIBLE_COUNT = 3;

export function SponsorSection({
  titleLine1 = "Special Thanks to",
  titleLine2 = "Our Sponsors",
  items = [],
  className = "",
}: SponsorSectionProps) {
  const [index, setIndex] = useState(0);
  const list = items.length ? items : [];
  const needsCarousel = list.length > VISIBLE_COUNT;
  const maxIndex = Math.max(0, list.length - VISIBLE_COUNT);
  const visibleItems = needsCarousel ? list.slice(index, index + VISIBLE_COUNT) : list;

  const goPrev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  const goNext = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));

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
          {needsCarousel ? (
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

          {/* Sponsor logos row */}
          <div className="flex-1 flex flex-row items-stretch justify-center gap-6 md:gap-10 min-w-0 max-w-5xl">
            {visibleItems.map((item, i) => (
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
                <p className="mt-3 text-sm md:text-base font-bold text-slate-900">{item.name}</p>
                {item.tagline ? (
                  <p className="mt-1 text-xs md:text-sm text-slate-600">{item.tagline}</p>
                ) : null}
              </div>
            ))}
          </div>

          {/* Right arrow */}
          {needsCarousel ? (
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
