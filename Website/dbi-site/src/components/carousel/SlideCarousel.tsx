"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CarouselArrows } from "./CarouselArrows";
import { CarouselDotNav } from "./CarouselDotNav";
import { CarouselProgressBar } from "./CarouselProgressBar";
import { animClass, type CarouselTransition } from "./types";

export type SlideCarouselTheme = "testimonialDark" | "light";

export type SlideCarouselTransitionMode = "enter" | "crossfade";

const THEME = {
  testimonialDark: {
    accent: "var(--color-2, #ff7900)",
    arrowPrev:
      "absolute left-2 md:left-4 top-1/2 z-10 w-10 h-10 md:w-12 md:h-12 -translate-y-1/2 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151] shrink-0",
    arrowNext:
      "absolute right-2 md:right-4 top-1/2 z-10 w-10 h-10 md:w-12 md:h-12 -translate-y-1/2 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151] shrink-0",
    dotActive: "bg-white scale-110",
    dotInactive: "bg-white/40 hover:bg-white/70",
    dotButton:
      "touch-target rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151]",
    progressTrack: "w-full max-w-md mx-auto px-8 mt-2 h-1 rounded-full overflow-hidden bg-white/20",
  },
  light: {
    accent: "var(--color-1, #2a579c)",
    arrowPrev:
      "absolute left-0 sm:left-2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shrink-0",
    arrowNext:
      "absolute right-0 sm:right-2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shrink-0",
    dotActive: "bg-slate-800 scale-110",
    dotInactive: "bg-slate-300 hover:bg-slate-400",
    dotButton:
      "touch-target rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    progressTrack:
      "w-full max-w-md mx-auto px-4 mt-4 h-1 rounded-full overflow-hidden bg-slate-200",
  },
} as const;

export type SlideCarouselProps = {
  count: number;
  multi: boolean;
  activeIndex: number;
  direction: "next" | "prev";
  transition: CarouselTransition;
  transitionDurationMs: number;
  /** `enter` = keyed enter animation; `crossfade` = opacity crossfade + tallest-slide height (multi only). */
  transitionMode?: SlideCarouselTransitionMode;
  /** When multi and `enter` mode, grid-measure all slides so the area stays as tall as the tallest slide. */
  matchTallestSlide?: boolean;
  /**
   * Crossfade only: when true (default), render every slide invisibly to size the track to the tallest slide.
   * Set false for heavy slide content (e.g. testimonials) and use `crossfadeContentMinHeightClassName` instead.
   */
  crossfadeMeasureHeight?: boolean;
  /** Crossfade + `crossfadeMeasureHeight` false: min-height on the animated track to limit layout shift. */
  crossfadeContentMinHeightClassName?: string;
  autoPlayMs?: number;
  showPagination: boolean;
  showProgress: boolean;
  regionId: string;
  labelId: string;
  /** Screen reader label for the carousel, e.g. "Testimonials, slide 1 of 3" */
  srLabel: string;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  goPrev: () => void;
  goNext: () => void;
  goToIndex: (i: number) => void;
  prevArrowLabel: string;
  nextArrowLabel: string;
  dotNavLabel: string;
  getDotLabel: (i: number, count: number) => string;
  theme: SlideCarouselTheme;
  /** Outer wrapper (region) classes + optional bg */
  className?: string;
  style?: CSSProperties;
  /** Min-height area wrapping the animated slide */
  contentWrapperClassName?: string;
  /** Renders slide content for a given index (0-based). */
  renderSlide: (index: number) => ReactNode;
};

export function SlideCarousel({
  count,
  multi,
  activeIndex,
  direction,
  transition,
  transitionDurationMs,
  transitionMode = "enter",
  matchTallestSlide = false,
  crossfadeMeasureHeight = true,
  crossfadeContentMinHeightClassName = "min-h-[min(22rem,48vh)]",
  autoPlayMs,
  showPagination,
  showProgress,
  regionId,
  labelId,
  srLabel,
  onKeyDown,
  onPointerEnter,
  onPointerLeave,
  goPrev,
  goNext,
  goToIndex,
  prevArrowLabel,
  nextArrowLabel,
  dotNavLabel,
  getDotLabel,
  theme,
  className = "",
  style,
  contentWrapperClassName = "",
  renderSlide,
}: SlideCarouselProps) {
  const t = THEME[theme];
  const enterClass = multi ? animClass(transition, direction) : "";
  const showBar = showProgress && !!autoPlayMs && multi;
  const showDots = showPagination && multi;

  const crossfade = multi && transitionMode === "crossfade";
  const tallestRail = multi && (crossfade || matchTallestSlide);

  const prevActiveRef = useRef(activeIndex);
  const [outgoing, setOutgoing] = useState<{ idx: number } | null>(null);
  const [navGen, setNavGen] = useState(0);

  useLayoutEffect(() => {
    if (!crossfade) return;
    if (prevActiveRef.current !== activeIndex) {
      setOutgoing({ idx: prevActiveRef.current });
      setNavGen((n) => n + 1);
      prevActiveRef.current = activeIndex;
    }
  }, [activeIndex, crossfade]);

  useEffect(() => {
    if (!crossfade || !outgoing) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) return;
    queueMicrotask(() => setOutgoing(null));
  }, [crossfade, outgoing]);

  const durationStyle = {
    "--slide-carousel-duration": `${transitionDurationMs}ms`,
  } as CSSProperties;

  let slideContent: ReactNode;

  if (!multi) {
    slideContent = (
      <div className="relative h-full min-h-0 w-full overflow-hidden" aria-live="polite" aria-atomic="true">
        {renderSlide(0)}
      </div>
    );
  } else if (crossfade) {
    const crossfadeLayers = (
      <div
        className={`relative flex min-h-0 min-w-0 w-full flex-col justify-center self-stretch ${
          crossfadeMeasureHeight ? "" : crossfadeContentMinHeightClassName
        }`}
        style={durationStyle}
        aria-live="polite"
        aria-atomic="true"
      >
        {outgoing != null && outgoing.idx !== activeIndex ? (
          <div
            key={`out-${outgoing.idx}`}
            className="slide-carousel-crossfade-out pointer-events-none absolute inset-0 z-0 flex w-full flex-col justify-center backface-hidden"
            aria-hidden
            onAnimationEnd={(e) => {
              if (e.target !== e.currentTarget) return;
              if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
              setOutgoing(null);
            }}
          >
            {renderSlide(outgoing.idx)}
          </div>
        ) : null}
        <div
          key={`in-${activeIndex}`}
          className={`relative z-1 w-full min-h-0 backface-hidden ${navGen > 0 ? "slide-carousel-crossfade-in" : ""}`}
        >
          {renderSlide(activeIndex)}
        </div>
      </div>
    );

    slideContent = crossfadeMeasureHeight ? (
      <div className="grid w-full grid-cols-1 grid-rows-1 contain-[layout_paint]">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={`h-${i}`}
            className="invisible col-start-1 row-start-1 min-w-0 w-full wrap-anywhere pointer-events-none"
            aria-hidden
          >
            {renderSlide(i)}
          </div>
        ))}
        <div className="relative col-start-1 row-start-1 flex min-h-0 min-w-0 w-full flex-col justify-center self-stretch">
          {crossfadeLayers}
        </div>
      </div>
    ) : (
      <div className="relative w-full contain-[layout_paint]">{crossfadeLayers}</div>
    );
  } else if (tallestRail) {
    slideContent = (
      <div className="grid w-full grid-cols-1 grid-rows-1">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={`h-${i}`}
            className="invisible col-start-1 row-start-1 min-w-0 w-full wrap-anywhere pointer-events-none"
            aria-hidden
          >
            {renderSlide(i)}
          </div>
        ))}
        <div
          className="col-start-1 row-start-1 flex min-h-0 min-w-0 w-full flex-col justify-center self-stretch overflow-hidden"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            key={activeIndex}
            className={`slide-carousel-content relative min-h-0 w-full ${enterClass}`}
            style={durationStyle}
          >
            {renderSlide(activeIndex)}
          </div>
        </div>
      </div>
    );
  } else {
    slideContent = (
      <div
        key={activeIndex}
        className={`slide-carousel-content relative h-full min-h-0 w-full ${enterClass}`}
        style={durationStyle}
        aria-live="polite"
        aria-atomic="true"
      >
        {renderSlide(activeIndex)}
      </div>
    );
  }

  return (
    <div
      id={regionId}
      role="region"
      aria-labelledby={labelId}
      aria-roledescription="carousel"
      tabIndex={multi ? 0 : undefined}
      onKeyDown={onKeyDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={className}
      style={style}
    >
      <span id={labelId} className="sr-only">
        {srLabel}
      </span>

      <div className="relative flex min-h-0 w-full flex-1 items-stretch justify-center">
        <CarouselArrows
          show={multi}
          onPrev={goPrev}
          onNext={goNext}
          prevLabel={prevArrowLabel}
          nextLabel={nextArrowLabel}
          accentColor={t.accent}
          prevButtonClassName={t.arrowPrev}
          nextButtonClassName={t.arrowNext}
        />

        <div className={`relative min-h-0 w-full flex-1 min-w-0 ${contentWrapperClassName}`}>{slideContent}</div>
      </div>

      <CarouselProgressBar
        show={showBar}
        activeIndex={activeIndex}
        autoPlayMs={autoPlayMs ?? 8000}
        fillColor={t.accent}
        trackClassName={t.progressTrack}
      />

      <CarouselDotNav
        show={showDots}
        count={count}
        activeIndex={activeIndex}
        onSelect={goToIndex}
        navLabel={dotNavLabel}
        getDotLabel={getDotLabel}
        activeDotClassName={t.dotActive}
        inactiveDotClassName={t.dotInactive}
        dotButtonClassName={t.dotButton}
      />
    </div>
  );
}
