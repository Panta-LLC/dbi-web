"use client";

/**
 * Full-width testimonial strip with previous/next controls, optional transitions, pagination,
 * and optional autoplay with a progress indicator. Built on shared `SlideCarousel`.
 *
 * **CMS:** Sanity `testimonialSliderSection` stores `items[]` and optional `carouselSettings`.
 * GROQ projects `testimonialItems` and `carouselSettings`; `PageContentRenderer` maps them here.
 *
 * @see `src/sanity/schema/objects/testimonialSliderSection.ts`
 * @see `src/sanity/queries.ts`
 * @see `src/components/sanity/PageContentRenderer.tsx` (`testimonialSliderSection` case)
 */
import { useId } from "react";
import {
  resolveCarouselSettings,
  SlideCarousel,
  useCarousel,
  type CarouselSettings,
  type CarouselTransition,
} from "@/components/carousel";

/** One slide; mirrors the Sanity testimonial object fields. */
export type TestimonialItem = {
  quote: string;
  attribution?: string;
};

/** @deprecated Use `CarouselTransition` from `@/components/carousel` */
export type TestimonialTransition = CarouselTransition;

const BLUE_BG = "#1e4d8b";

const DEFAULT_ITEMS: TestimonialItem[] = [
  {
    quote: "Delta Bay Impact has changed my life. The mentors have helped me tremendously.",
    attribution: "- Former Mentee",
  },
];

type TestimonialSliderProps = {
  items?: TestimonialItem[];
  className?: string;
  /** Options from Sanity `carouselSettings` or overrides. */
  carousel?: CarouselSettings | null;
  transition?: CarouselTransition;
  transitionDurationMs?: number;
  autoPlayMs?: number;
  showPagination?: boolean;
  showProgress?: boolean;
};

export function TestimonialSlider({
  items = DEFAULT_ITEMS,
  className = "",
  carousel,
  transition,
  transitionDurationMs,
  autoPlayMs,
  showPagination,
  showProgress,
}: TestimonialSliderProps) {
  const resolved = resolveCarouselSettings({
    ...carousel,
    ...(transition != null ? { transition } : {}),
    ...(transitionDurationMs != null ? { transitionDurationMs } : {}),
    ...(autoPlayMs !== undefined ? { autoPlayMs } : {}),
    ...(showPagination !== undefined ? { showPagination } : {}),
    ...(showProgress !== undefined ? { showProgress } : {}),
  });

  const list = items?.length ? items : DEFAULT_ITEMS;
  const count = list.length;

  const c = useCarousel(count, { autoPlayMs: resolved.autoPlayMs });
  const showDots = resolved.showPagination ?? c.multi;
  const showBar =
    (resolved.showProgress ?? !!resolved.autoPlayMs) && !!resolved.autoPlayMs && c.multi;

  const baseId = useId();
  const regionId = `${baseId}-region`;
  const labelId = `${baseId}-label`;

  const current = list[c.activeIndex];
  if (!current) return null;

  return (
    <SlideCarousel
      count={count}
      multi={c.multi}
      activeIndex={c.activeIndex}
      direction={c.direction}
      transition={resolved.transition}
      transitionDurationMs={resolved.transitionDurationMs}
      autoPlayMs={resolved.autoPlayMs}
      showPagination={showDots}
      showProgress={showBar}
      regionId={regionId}
      labelId={labelId}
      srLabel={`Testimonials, slide ${c.activeIndex + 1} of ${count}`}
      onKeyDown={c.onKeyDown}
      onPointerEnter={() => c.setPaused(true)}
      onPointerLeave={() => c.setPaused(false)}
      goPrev={c.goPrev}
      goNext={c.goNext}
      goToIndex={c.goToIndex}
      prevArrowLabel="Previous testimonial"
      nextArrowLabel="Next testimonial"
      dotNavLabel="Testimonial pagination"
      getDotLabel={(i, n) => `Go to testimonial ${i + 1} of ${n}`}
      theme="testimonialDark"
      className={`relative flex flex-col items-center justify-center py-10 md:py-14 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151] rounded-sm ${className}`}
      style={{ backgroundColor: BLUE_BG }}
      contentWrapperClassName="max-w-4xl mx-4 md:mx-12 py-8 md:py-12 px-8 md:px-14 rounded-sm min-h-48 md:min-h-56"
      renderSlide={() => (
        <div className="flex w-full flex-1 items-start">
          <span
            className="block md:text-[9rem] text-6xl ml-[-20px] md:ml-0 font-serif font-extrabold leading-none mb-2 mr-2 select-none shrink-0"
            style={{
              color: "var(--color-2, #ff7900)",
              // fontSize: "9rem",
              lineHeight: ".35em",
            }}
            aria-hidden
          >
            “
          </span>
          <div className="flex-1 min-w-0">
            <blockquote className="display-m font-bold text-white leading-snug text-left">
              {current.quote}
            </blockquote>
            {current.attribution ? (
              <p className="mt-4 text-base md:text-lg text-white font-normal text-right">
                {current.attribution}
              </p>
            ) : null}
          </div>
        </div>
      )}
    />
  );
}
