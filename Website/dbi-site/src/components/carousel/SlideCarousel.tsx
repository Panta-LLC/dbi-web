"use client";

import type { CSSProperties, ReactNode } from "react";
import { CarouselArrows } from "./CarouselArrows";
import { CarouselDotNav } from "./CarouselDotNav";
import { CarouselProgressBar } from "./CarouselProgressBar";
import { animClass, type CarouselTransition } from "./types";

export type SlideCarouselTheme = "testimonialDark" | "light";

const THEME = {
  testimonialDark: {
    accent: "var(--color-2, #ff7900)",
    arrowPrev:
      "absolute left-2 md:left-4 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151] shrink-0",
    arrowNext:
      "absolute right-2 md:right-4 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151] shrink-0",
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
    progressTrack: "w-full max-w-md mx-auto px-4 mt-4 h-1 rounded-full overflow-hidden bg-slate-200",
  },
} as const;

export type SlideCarouselProps = {
  count: number;
  multi: boolean;
  activeIndex: number;
  direction: "next" | "prev";
  transition: CarouselTransition;
  transitionDurationMs: number;
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
  /** Renders the active slide’s body (inside keyed animated div). */
  renderSlide: () => ReactNode;
};

export function SlideCarousel({
  count,
  multi,
  activeIndex,
  direction,
  transition,
  transitionDurationMs,
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

      <div className="relative flex w-full items-center justify-center">
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

        <div className={`relative w-full flex-1 min-w-0 ${contentWrapperClassName}`}>
          <div
            key={multi ? activeIndex : "single"}
            className={multi ? `slide-carousel-content ${enterClass}` : undefined}
            style={
              multi
                ? ({
                    "--slide-carousel-duration": `${transitionDurationMs}ms`,
                  } as CSSProperties)
                : undefined
            }
            aria-live="polite"
            aria-atomic="true"
          >
            {renderSlide()}
          </div>
        </div>
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
