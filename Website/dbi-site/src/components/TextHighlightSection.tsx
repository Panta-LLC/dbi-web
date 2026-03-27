"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import {
  resolveCarouselSettings,
  SlideCarousel,
  useCarousel,
  type CarouselSettings,
} from "@/components/carousel";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export type TextHighlightSlide = {
  text: string;
};

type TextHighlightSectionProps = {
  children?: ReactNode;
  /** Legacy single block; used when `items` is empty. */
  text?: string;
  /** Multiple highlight lines (carousel when more than one). */
  items?: TextHighlightSlide[];
  /** From Sanity `carouselSettings`. */
  carousel?: CarouselSettings | null;
  className?: string;
};

type TextHighlightCarouselProps = {
  slides: TextHighlightSlide[];
  carousel?: CarouselSettings | null;
  className: string;
};

function TextHighlightCarousel({ slides, carousel, className }: TextHighlightCarouselProps) {
  const resolved = resolveCarouselSettings(carousel ?? undefined);
  const count = slides.length;
  const c = useCarousel(count, { autoPlayMs: resolved.autoPlayMs });
  const showDots = resolved.showPagination ?? c.multi;
  const showBar = (resolved.showProgress ?? !!resolved.autoPlayMs) && !!resolved.autoPlayMs && c.multi;

  const baseId = useId();
  const regionId = `${baseId}-region`;
  const labelId = `${baseId}-label`;

  const current = slides[c.activeIndex];

  return (
    <Section className={className + " bg-light-gray"}>
      <Container className="py-12 sm:py-16 flex flex-col items-center justify-center lg:items-center">
        <div className="w-full max-w-4xl mx-auto text-balance px-2 md:px-0">
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
            srLabel={`Highlight text, slide ${c.activeIndex + 1} of ${count}`}
            onKeyDown={c.onKeyDown}
            onPointerEnter={() => c.setPaused(true)}
            onPointerLeave={() => c.setPaused(false)}
            goPrev={c.goPrev}
            goNext={c.goNext}
            goToIndex={c.goToIndex}
            prevArrowLabel="Previous highlight"
            nextArrowLabel="Next highlight"
            dotNavLabel="Highlight pagination"
            getDotLabel={(i, n) => `Go to highlight ${i + 1} of ${n}`}
            theme="light"
            className="relative flex flex-col items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm w-full"
            contentWrapperClassName="min-h-[12rem] sm:min-h-56 flex items-center justify-center py-4"
            renderSlide={() => (
              <h2 className="display-m font-semibold mx-auto max-w-4xl text-balance text-center w-full">
                {current.text}
              </h2>
            )}
          />
        </div>
      </Container>
    </Section>
  );
}

export function TextHighlightSection({
  children,
  text,
  items,
  carousel,
  className = "",
}: TextHighlightSectionProps) {
  if (children) {
    return (
      <Section className={className + " bg-light-gray"}>
        <Container className="py-12 sm:py-16 flex flex-col items-center justify-center lg:items-center">
          <div className="max-w-2xl mx-auto text-balance">{children}</div>
        </Container>
      </Section>
    );
  }

  const slides: TextHighlightSlide[] =
    items?.length ? items : text ? [{ text }] : [];

  if (!slides.length) return null;

  if (slides.length === 1) {
    return (
      <Section className={className + " bg-light-gray"}>
        <Container className="py-12 sm:py-16 flex flex-col items-center justify-center lg:items-center">
          <div className="max-w-2xl mx-auto text-balance">
            <h2 className="display-m font-semibold mx-auto max-w-4xl text-balance text-center px-2 md:px-0">
              {slides[0].text}
            </h2>
          </div>
        </Container>
      </Section>
    );
  }

  return <TextHighlightCarousel slides={slides} carousel={carousel} className={className} />;
}
