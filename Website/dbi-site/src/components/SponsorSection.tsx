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

const MOBILE_VISIBLE = 1;

const TRACK_TRANSITION =
  "transition-[transform] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none motion-reduce:duration-0";

const SPONSOR_ARROW_CLASS =
  "shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export function SponsorSection({
  titleLine1 = "Special Thanks to",
  titleLine2 = "Our Partners",
  items = [],
  className = "",
  carousel,
}: SponsorSectionProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [transitionOn, setTransitionOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const slideIndexRef = useRef(0);

  const resolved = resolveCarouselSettings(carousel ?? undefined);

  const list = items.length ? items : [];
  const n = list.length;
  /** Duplicated strip so position `n` matches position `0` for seamless looping. */
  const loopStrip = n > 0 ? [...list, ...list] : [];
  const loopLen = loopStrip.length;

  const needsCarouselMobile = n > 1;
  const needsCarouselDesktop = n > VISIBLE_COUNT_DESKTOP;

  const multi = needsCarouselMobile || needsCarouselDesktop;
  /** One dot per step in the full cycle (no partial “last logo alone” window). */
  const mobileDotCount = needsCarouselMobile ? n : 0;
  const desktopDotCount = needsCarouselDesktop ? n : 0;
  /** Active dot / progress while sliding or after snap: `n` maps to first slide. */
  const activeSlide = slideIndex >= n ? 0 : slideIndex;
  const showDots = resolved.showPagination ?? true;
  const showBar =
    (resolved.showProgress ?? !!resolved.autoPlayMs) && !!resolved.autoPlayMs && multi;

  useEffect(() => {
    slideIndexRef.current = slideIndex;
  }, [slideIndex]);

  const snapAfterDuplicate = useCallback(() => {
    setTransitionOn(false);
    setSlideIndex(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitionOn(true));
    });
  }, []);

  const handleLoopTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== "transform") return;
      if (slideIndexRef.current !== n) return;
      snapAfterDuplicate();
    },
    [n, snapAfterDuplicate],
  );

  const goPrev = useCallback(() => {
    if (!needsCarouselMobile && !needsCarouselDesktop) return;
    const s = slideIndexRef.current;
    if (s === n) {
      setSlideIndex(n - 1);
      return;
    }
    if (s === 0) {
      setTransitionOn(false);
      setSlideIndex(n);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionOn(true);
          setSlideIndex(n - 1);
        });
      });
      return;
    }
    setSlideIndex((prev) => prev - 1);
  }, [needsCarouselDesktop, needsCarouselMobile, n]);

  const goNext = useCallback(() => {
    if (!needsCarouselMobile && !needsCarouselDesktop) return;
    setSlideIndex((s) => {
      if (s === n) return s;
      if (s === n - 1) return n;
      return s + 1;
    });
  }, [needsCarouselDesktop, needsCarouselMobile, n]);

  const goToSlide = useCallback(
    (i: number) => {
      if (i < 0 || i >= n) return;
      setSlideIndex(i);
    },
    [n],
  );

  useEffect(() => {
    if (!resolved.autoPlayMs || paused || !multi) return;
    const t = window.setTimeout(goNext, resolved.autoPlayMs);
    return () => window.clearTimeout(t);
  }, [slideIndex, goNext, multi, paused, resolved.autoPlayMs]);

  /** If transitionend does not fire (e.g. reduced motion / hidden duplicate track), still snap off the clone. */
  useEffect(() => {
    if (slideIndex !== n) return;
    const t = window.setTimeout(() => {
      if (slideIndexRef.current !== n) return;
      snapAfterDuplicate();
    }, 550);
    return () => window.clearTimeout(t);
  }, [slideIndex, n, snapAfterDuplicate]);

  if (!list.length) return null;

  const showArrows = needsCarouselMobile || needsCarouselDesktop;

  return (
    <div
      className={`bg-white py-12 md:py-16 ${className}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <Container>
        <div className="mb-8 text-center md:mb-10">
          <p className="body-md text-slate-700">{titleLine1}</p>
          <h2 className="heading-2 mt-1 text-slate-900">{titleLine2}</h2>
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

            {/* Mobile: one sponsor per view; duplicated strip for seamless loop */}
            <div className="md:hidden flex-1 min-w-0 overflow-hidden">
              <div
                className={`flex w-full items-stretch ${
                  needsCarouselMobile && transitionOn ? TRACK_TRANSITION : ""
                }`}
                style={
                  needsCarouselMobile
                    ? {
                        width: `calc(100% * ${loopLen} / ${MOBILE_VISIBLE})`,
                        transform: `translateX(calc(-${slideIndex} * 100% / ${loopLen}))`,
                      }
                    : undefined
                }
                onTransitionEnd={needsCarouselMobile ? handleLoopTransitionEnd : undefined}
              >
                {(needsCarouselMobile ? loopStrip : list).map((item, i) => (
                  <div
                    key={`${item.name}-${i}`}
                    data-sponsor-index={i % n}
                    className="flex min-h-0 min-w-0 shrink-0 flex-col items-center justify-center text-center px-4"
                    style={
                      needsCarouselMobile
                        ? { flex: `0 0 calc(100% / ${loopLen})` }
                        : { flex: "1 1 100%" }
                    }
                  >
                    {item.logoSrc ? (
                      <div className="flex w-full max-w-[240px] mx-auto items-center justify-center">
                        <Image
                          src={item.logoSrc}
                          alt={item.logoAlt ?? item.name}
                          width={320}
                          height={240}
                          sizes="(max-width: 768px) 85vw, 240px"
                          className="h-auto max-h-[150px] w-full max-w-full object-contain"
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

            {/* Desktop: 4 logos visible; duplicated strip loops with no end gap */}
            <div className="hidden md:block flex-1 min-w-0 max-w-5xl overflow-hidden">
              <div
                className={`flex w-full items-stretch ${
                  needsCarouselDesktop && transitionOn ? TRACK_TRANSITION : ""
                }`}
                style={
                  needsCarouselDesktop
                    ? {
                        width: `calc(100% * ${loopLen} / ${VISIBLE_COUNT_DESKTOP})`,
                        transform: `translateX(calc(-${slideIndex} * 100% / ${loopLen}))`,
                      }
                    : undefined
                }
                onTransitionEnd={needsCarouselDesktop ? handleLoopTransitionEnd : undefined}
              >
                {(needsCarouselDesktop ? loopStrip : list).map((item, i) => (
                  <div
                    key={`${item.name}-${i}`}
                    className="flex min-h-0 min-w-0 flex-col items-center text-center px-2 lg:px-2"
                    style={
                      needsCarouselDesktop
                        ? { flex: `0 0 calc(100% / ${loopLen})` }
                        : { flex: "1 1 0%" }
                    }
                  >
                    {item.logoSrc ? (
                      <div className="flex min-h-[140px] w-full max-w-[280px] flex-1 flex-col items-center justify-center mx-auto sm:min-h-12 sm:max-w-[240px]">
                        <Image
                          src={item.logoSrc}
                          alt={item.logoAlt ?? item.name}
                          width={320}
                          height={240}
                          sizes="(max-width: 1024px) 72vw, 240px"
                          className="h-auto max-h-[220px] w-full max-w-full object-contain sm:max-h-[200px]"
                        />
                      </div>
                    ) : (
                      <div className="flex min-h-16 w-full max-w-[240px] flex-1 flex-col items-center justify-center mx-auto bg-slate-100 rounded px-3 py-4 text-slate-500 text-sm font-semibold">
                        {item.name}
                      </div>
                    )}
                    <p className="mt-3 shrink-0 text-sm font-bold text-slate-900 lg:text-base">
                      {item.name}
                    </p>
                    {item.tagline ? (
                      <p className="mt-1 shrink-0 text-xs text-slate-600 lg:text-sm">
                        {item.tagline}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
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
            activeIndex={activeSlide}
            autoPlayMs={resolved.autoPlayMs ?? 8000}
            fillColor={ORANGE}
            trackClassName="w-full max-w-md mx-auto px-4 h-1 rounded-full overflow-hidden bg-slate-200"
          />

          {showDots && mobileDotCount > 1 ? (
            <div className="md:hidden w-full">
              <CarouselDotNav
                show
                count={mobileDotCount}
                activeIndex={activeSlide}
                onSelect={goToSlide}
                navLabel="Sponsor slides"
                getDotLabel={(i, n) => `Go to sponsor ${i + 1} of ${n}`}
                activeDotClassName="bg-slate-800 scale-110"
                inactiveDotClassName="bg-slate-300 hover:bg-slate-400"
                dotButtonClassName="touch-target rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex items-center justify-center"
                navClassName="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 px-1"
              />
            </div>
          ) : null}

          {showDots && desktopDotCount > 1 ? (
            <div className="hidden md:block w-full">
              <CarouselDotNav
                show
                count={desktopDotCount}
                activeIndex={activeSlide}
                onSelect={goToSlide}
                navLabel="Sponsor window"
                getDotLabel={(i, n) => `Go to sponsor page ${i + 1} of ${n}`}
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
