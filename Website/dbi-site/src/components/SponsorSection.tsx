"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CarouselArrowButton,
  CarouselDotNav,
  CarouselProgressBar,
  resolveCarouselSettings,
  type CarouselSettings,
} from "@/components/carousel";
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
  /** From Sanity `footer.sponsorCarousel`. */
  carousel?: CarouselSettings | null;
};

const ORANGE = "var(--color-2, #ff7900)";
const VISIBLE_COUNT_DESKTOP = 3;

const SPONSOR_ARROW_CLASS =
  "shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export function SponsorSection({
  titleLine1 = "Special Thanks to",
  titleLine2 = "Our Partners",
  items = [],
  className = "",
  carousel,
}: SponsorSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const resolved = resolveCarouselSettings(carousel ?? undefined);

  const list = items.length ? items : [];
  const needsCarouselMobile = list.length > 1;
  const needsCarouselDesktop = list.length > VISIBLE_COUNT_DESKTOP;
  const maxIndexDesktop = Math.max(0, list.length - VISIBLE_COUNT_DESKTOP);
  const visibleItemsDesktop = needsCarouselDesktop
    ? list.slice(index, index + VISIBLE_COUNT_DESKTOP)
    : list;

  const multi = needsCarouselMobile || needsCarouselDesktop;
  const mobileDotCount = needsCarouselMobile ? list.length : 0;
  const desktopDotCount = needsCarouselDesktop ? maxIndexDesktop + 1 : 0;
  const showDots = resolved.showPagination ?? true;
  const showBar =
    (resolved.showProgress ?? !!resolved.autoPlayMs) && !!resolved.autoPlayMs && multi;

  const scrollToItem = useCallback(
    (targetIndex: number) => {
      const el = scrollRef.current;
      if (!el || !needsCarouselMobile) return;
      const itemEl = el.querySelector(`[data-sponsor-index="${targetIndex}"]`);
      if (itemEl) {
        itemEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    },
    [needsCarouselMobile],
  );

  const goPrev = useCallback(() => {
    if (needsCarouselMobile) {
      const prev = index <= 0 ? list.length - 1 : index - 1;
      setIndex(prev);
      scrollToItem(prev);
    } else if (needsCarouselDesktop) {
      setIndex((i) => (i <= 0 ? maxIndexDesktop : i - 1));
    }
  }, [
    index,
    list.length,
    maxIndexDesktop,
    needsCarouselDesktop,
    needsCarouselMobile,
    scrollToItem,
  ]);

  const goNext = useCallback(() => {
    if (needsCarouselMobile) {
      const next = index >= list.length - 1 ? 0 : index + 1;
      setIndex(next);
      scrollToItem(next);
    } else if (needsCarouselDesktop) {
      setIndex((i) => (i >= maxIndexDesktop ? 0 : i + 1));
    }
  }, [
    index,
    list.length,
    maxIndexDesktop,
    needsCarouselDesktop,
    needsCarouselMobile,
    scrollToItem,
  ]);

  const goToIndexMobile = useCallback(
    (i: number) => {
      setIndex(i);
      scrollToItem(i);
    },
    [scrollToItem],
  );

  const goToIndexDesktop = useCallback(
    (i: number) => {
      if (i >= 0 && i <= maxIndexDesktop) setIndex(i);
    },
    [maxIndexDesktop],
  );

  useEffect(() => {
    if (!resolved.autoPlayMs || paused || !multi) return;
    const t = window.setTimeout(goNext, resolved.autoPlayMs);
    return () => window.clearTimeout(t);
  }, [index, goNext, multi, paused, resolved.autoPlayMs]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const itemWidth = el.scrollWidth / list.length;
    const newIndex = Math.round(scrollLeft / itemWidth);
    setIndex(Math.min(newIndex, list.length - 1));
  };

  if (!list.length) return null;

  const showArrows = needsCarouselMobile || needsCarouselDesktop;

  return (
    <div
      className={`bg-white py-12 md:py-16 ${className}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <Container>
        <div className="text-center mb-8 md:mb-10">
          <p className="text-base md:text-lg text-slate-700">{titleLine1}</p>
          <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            {titleLine2}
          </h2>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-2 md:gap-4 px-4 w-full">
            {showArrows ? (
              <CarouselArrowButton
                direction="prev"
                onClick={goPrev}
                label="Previous sponsors"
                accentColor={ORANGE}
                className={SPONSOR_ARROW_CLASS}
              />
            ) : (
              <div className="w-10 md:w-12 shrink-0" aria-hidden />
            )}

            {/* Mobile: scroll carousel (one sponsor, smooth scroll) */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="md:hidden flex-1 min-w-0 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
            >
              <div className="flex gap-6">
                {list.map((item, i) => (
                  <div
                    key={`${item.name}-${i}`}
                    data-sponsor-index={i}
                    className="shrink-0 w-full min-w-full snap-center flex flex-col items-center justify-center text-center px-4"
                  >
                    {item.logoSrc ? (
                      <div className="flex w-full max-w-[240px] mx-auto items-center justify-center">
                        <Image
                          src={item.logoSrc}
                          alt={item.logoAlt ?? item.name}
                          width={320}
                          height={240}
                          sizes="(max-width: 768px) 85vw, 240px"
                          className="h-auto w-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex w-full min-h-16 max-w-[240px] mx-auto items-center justify-center bg-slate-100 rounded px-3 py-4 text-slate-500 text-sm font-semibold">
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

            {/* Desktop: static row of 3 — equal column height; logos centered in shared vertical space */}
            <div className="hidden md:flex flex-1 flex-row items-stretch justify-center gap-6 lg:gap-10 min-w-0 max-w-5xl">
              {visibleItemsDesktop.map((item, i) => (
                <div
                  key={`${item.name}-${index}-${i}`}
                  className="flex min-h-0 min-w-0 flex-1 flex-col items-center text-center px-4"
                >
                  {item.logoSrc ? (
                    <div className="flex min-h-12 w-full max-w-[240px] flex-1 flex-col items-center justify-center mx-auto">
                      <Image
                        src={item.logoSrc}
                        alt={item.logoAlt ?? item.name}
                        width={320}
                        height={240}
                        sizes="(max-width: 1024px) 28vw, 240px"
                        className="h-auto w-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-16 w-full max-w-[240px] flex-1 flex-col items-center justify-center mx-auto bg-slate-100 rounded px-3 py-4 text-slate-500 text-sm font-semibold">
                      {item.name}
                    </div>
                  )}
                  <p className="mt-3 shrink-0 text-sm font-bold text-slate-900 lg:text-base">{item.name}</p>
                  {item.tagline ? (
                    <p className="mt-1 shrink-0 text-xs text-slate-600 lg:text-sm">{item.tagline}</p>
                  ) : null}
                </div>
              ))}
            </div>

            {showArrows ? (
              <CarouselArrowButton
                direction="next"
                onClick={goNext}
                label="Next sponsors"
                accentColor={ORANGE}
                className={SPONSOR_ARROW_CLASS}
              />
            ) : (
              <div className="w-10 md:w-12 shrink-0" aria-hidden />
            )}
          </div>

          <CarouselProgressBar
            show={showBar}
            activeIndex={index}
            autoPlayMs={resolved.autoPlayMs ?? 8000}
            fillColor={ORANGE}
            trackClassName="w-full max-w-md mx-auto px-4 h-1 rounded-full overflow-hidden bg-slate-200"
          />

          {showDots && mobileDotCount > 1 ? (
            <div className="md:hidden w-full">
              <CarouselDotNav
                show
                count={mobileDotCount}
                activeIndex={index}
                onSelect={goToIndexMobile}
                navLabel="Sponsor slides"
                getDotLabel={(i, n) => `Go to sponsor ${i + 1} of ${n}`}
                activeDotClassName="bg-slate-800 scale-110"
                inactiveDotClassName="bg-slate-300 hover:bg-slate-400"
                dotButtonClassName="touch-target rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                navClassName="flex flex-wrap items-center justify-center gap-2 px-4"
              />
            </div>
          ) : null}

          {showDots && desktopDotCount > 1 ? (
            <div className="hidden md:block w-full">
              <CarouselDotNav
                show
                count={desktopDotCount}
                activeIndex={index}
                onSelect={goToIndexDesktop}
                navLabel="Sponsor window"
                getDotLabel={(i, n) => `Go to sponsor group ${i + 1} of ${n}`}
                activeDotClassName="bg-slate-800 scale-110"
                inactiveDotClassName="bg-slate-300 hover:bg-slate-400"
                dotButtonClassName="touch-target rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                navClassName="flex flex-wrap items-center justify-center gap-2 px-4"
              />
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
