"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import {
  CarouselArrowButton,
  CarouselProgressBar,
  animClass,
  resolveCarouselSettings,
  useCarousel,
  type CarouselSettings,
} from "@/components/carousel";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

const HERO_GALLERY_ACCENT = "var(--color-2, #ff7900)";

/** Layout proportions: 159×548 left strip + 882×548 gallery (desktop). */
const LEFT_WIDTH_FRAC = 159 / (159 + 882);

/** Image area: stable aspect + minimum height for stacked layout below copy. */
const GALLERY_ASPECT_CLASS = "aspect-[882/548] min-h-[min(52vw,320px)] w-full sm:min-h-[280px]";

type HeroCta = {
  href?: string;
  label?: string;
};

export type HeroGallerySlide = {
  src: string;
  alt?: string;
};

export type HeroProps = {
  leftImageSrc?: string;
  leftImageAlt?: string;
  galleryImages?: HeroGallerySlide[];
  carousel?: CarouselSettings | null;
  title?: string;
  subtitle?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
};

function useHeroGalleryState(images: HeroGallerySlide[], carousel?: CarouselSettings | null) {
  const resolved = resolveCarouselSettings({
    ...carousel,
    autoPlayMs: carousel?.autoPlayMs ?? 6000,
    showPagination: carousel?.showPagination ?? true,
    showProgress: carousel?.showProgress ?? true,
  });

  const count = images.length;
  const c = useCarousel(count, { autoPlayMs: resolved.autoPlayMs });
  const showBar =
    (resolved.showProgress ?? !!resolved.autoPlayMs) && !!resolved.autoPlayMs && count > 1;

  const baseId = useId();
  const regionId = `${baseId}-hero-gallery`;
  const labelId = `${baseId}-hero-gallery-label`;

  const multi = count > 1;
  const enterClass = multi ? animClass(resolved.transition, c.direction) : "";
  const slideDurationMs = resolved.transitionDurationMs;
  const srLabel = `Hero gallery, slide ${c.activeIndex + 1} of ${count}`;
  const current = count > 0 ? images[c.activeIndex] : undefined;

  return {
    resolved,
    count,
    c,
    showBar,
    regionId,
    labelId,
    multi,
    enterClass,
    slideDurationMs,
    srLabel,
    current,
  };
}

type HeroGalleryState = ReturnType<typeof useHeroGalleryState>;

function HeroGallerySlides({
  images,
  state,
}: {
  images: HeroGallerySlide[];
  state: HeroGalleryState;
}) {
  const {
    count,
    c,
    regionId,
    labelId,
    multi,
    enterClass,
    slideDurationMs,
    srLabel,
    current,
    resolved,
  } = state;

  const crossfade = multi && resolved.transition === "fade";
  const prevActiveRef = useRef(c.activeIndex);
  const [outgoing, setOutgoing] = useState<{ idx: number } | null>(null);
  const [navGen, setNavGen] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!crossfade) return;
    if (prevActiveRef.current !== c.activeIndex) {
      setOutgoing({ idx: prevActiveRef.current });
      setNavGen((n) => n + 1);
      prevActiveRef.current = c.activeIndex;
    }
  }, [c.activeIndex, crossfade]);

  useEffect(() => {
    if (!crossfade || !outgoing) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) return;
    queueMicrotask(() => setOutgoing(null));
  }, [crossfade, outgoing]);

  const durationStyle = {
    "--slide-carousel-duration": `${resolved.transitionDurationMs}ms`,
  } as CSSProperties;

  if (count === 0) {
    return <div className="absolute inset-0 bg-[#b5b2a9]" aria-hidden />;
  }

  if (!current) return null;

  const slideStack = crossfade ? (
    <div
      className="relative h-full min-h-0 w-full"
      style={durationStyle}
      aria-live="polite"
      aria-atomic="true"
    >
      {outgoing != null && outgoing.idx !== c.activeIndex ? (
        <div
          key={`out-${outgoing.idx}`}
          className="slide-carousel-crossfade-out pointer-events-none absolute inset-0 z-0 min-h-0 overflow-hidden backface-hidden"
          aria-hidden
          onAnimationEnd={(e) => {
            if (e.target !== e.currentTarget) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            setOutgoing(null);
          }}
        >
          <Image
            src={images[outgoing.idx]!.src}
            alt={images[outgoing.idx]!.alt || "Hero"}
            fill
            sizes="(max-width: 768px) 100vw, 882px"
            className="object-cover object-center"
          />
        </div>
      ) : null}
      <div
        key={`in-${c.activeIndex}`}
        className={`absolute inset-0 z-1 min-h-0 overflow-hidden backface-hidden ${
          navGen > 0 ? "slide-carousel-crossfade-in" : ""
        }`}
      >
        <Image
          src={current.src}
          alt={current.alt || "Hero"}
          fill
          priority={c.activeIndex === 0}
          sizes="(max-width: 768px) 100vw, 882px"
          className="object-cover object-center"
        />
      </div>
    </div>
  ) : (
    <div
      key={multi ? c.activeIndex : "single"}
      className={
        multi
          ? `slide-carousel-content absolute inset-0 min-h-0 overflow-hidden ${enterClass}`
          : "absolute inset-0 min-h-0 overflow-hidden"
      }
      style={
        multi
          ? ({
              "--slide-carousel-duration": `${slideDurationMs}ms`,
            } as CSSProperties)
          : undefined
      }
      aria-live="polite"
      aria-atomic="true"
    >
      <Image
        src={current.src}
        alt={current.alt || "Hero"}
        fill
        priority={c.activeIndex === 0}
        sizes="(max-width: 768px) 100vw, 882px"
        className="object-cover object-center"
      />
    </div>
  );

  return (
    <div
      id={regionId}
      role="region"
      aria-labelledby={labelId}
      aria-roledescription="carousel"
      tabIndex={multi ? 0 : undefined}
      onKeyDown={c.onKeyDown}
      onPointerEnter={() => c.setPaused(true)}
      onPointerLeave={() => c.setPaused(false)}
      onTouchStart={(e) => {
        if (!multi) return;
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (!multi || touchStartX.current == null) return;
        const endX = e.changedTouches[0]?.clientX;
        if (endX == null) return;
        const dx = endX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) < 56) return;
        if (dx > 0) c.goPrev();
        else c.goNext();
      }}
      className={`relative w-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${GALLERY_ASPECT_CLASS}`}
    >
      <span id={labelId} className="sr-only">
        {srLabel}
      </span>

      <div className="absolute inset-0 min-h-0">{slideStack}</div>
    </div>
  );
}

const HERO_CTRL_ARROW_LIGHT =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

/** Prev / next / active÷total / pause + optional progress — no dots */
function HeroGalleryControls({ state, className = "" }: { state: HeroGalleryState; className?: string }) {
  const { resolved, count, c, showBar, multi } = state;
  if (!multi) return null;

  const showPause = !!(resolved.autoPlayMs && resolved.autoPlayMs > 0);

  return (
    <div
      role="group"
      aria-label="Hero carousel controls"
      className={`flex flex-col items-stretch gap-3 sm:items-center ${className}`.trim()}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <CarouselArrowButton
          direction="prev"
          onClick={c.goPrev}
          label="Previous hero image"
          accentColor={HERO_GALLERY_ACCENT}
          className={HERO_CTRL_ARROW_LIGHT}
        />
        <span
          className="min-w-16 text-center text-sm font-semibold tabular-nums text-slate-700 sm:text-base"
          aria-live="polite"
        >
          {c.activeIndex + 1} / {count}
        </span>
        <CarouselArrowButton
          direction="next"
          onClick={c.goNext}
          label="Next hero image"
          accentColor={HERO_GALLERY_ACCENT}
          className={HERO_CTRL_ARROW_LIGHT}
        />
        {showPause ? (
          <button
            type="button"
            onClick={() => c.setPaused(!c.paused)}
            aria-pressed={c.paused}
            aria-label={c.paused ? "Play slideshow" : "Pause slideshow"}
            className={HERO_CTRL_ARROW_LIGHT}
          >
            {c.paused ? <Play className="h-5 w-5" strokeWidth={2} aria-hidden /> : <Pause className="h-5 w-5" strokeWidth={2} aria-hidden />}
          </button>
        ) : null}
      </div>
      {showBar ? (
        <CarouselProgressBar
          show
          activeIndex={c.activeIndex}
          autoPlayMs={resolved.autoPlayMs ?? 8000}
          fillColor={HERO_GALLERY_ACCENT}
          trackClassName="h-1.5 w-full max-w-md overflow-hidden rounded-full bg-slate-200"
        />
      ) : null}
    </div>
  );
}

function HeroCopyBlock({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: {
  title?: string;
  subtitle?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}): ReactNode {
  const displayTitle = title || "EDUCATE.\nADVOCATE.\nELEVATE.";
  const lines = displayTitle.split("\n");

  return (
    <div className="w-full max-w-3xl text-center md:text-left">
      <h1 className="text-balance text-3xl font-bold leading-[1.12] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </h1>
      {subtitle ? (
        <p className="body-md mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600 md:mx-0">{subtitle}</p>
      ) : null}
      <div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
        {primaryCta?.label ? (
          <Button href={primaryCta.href} variant="cta-primary" className="w-full justify-center sm:w-auto">
            {primaryCta.label}
          </Button>
        ) : null}
        {secondaryCta?.label ? (
          <Button href={secondaryCta.href} variant="cta-secondary" className="w-full justify-center sm:w-auto">
            {secondaryCta.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function Hero({
  leftImageSrc,
  leftImageAlt,
  galleryImages = [],
  carousel,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  const galleryState = useHeroGalleryState(galleryImages, carousel);

  return (
    <Section
      className="relative mb-2 w-full max-md:mx-[calc(50%-50vw)] max-md:w-screen max-md:max-w-none max-md:overflow-x-clip"
      noPadding
      reveal={false}
    >
      <div className="relative isolate flex w-full min-w-0 flex-col bg-white" data-name="Hero">
        {/* Image band: optional left strip (xl+), gallery */}
        <div className="flex w-full flex-col items-stretch bg-[#b5b2a9] xl:flex-row">
          <div
            className="relative hidden min-h-0 shrink-0 overflow-hidden xl:block xl:h-full xl:self-stretch"
            style={{
              width: `${LEFT_WIDTH_FRAC * 100}%`,
              clipPath: "polygon(0 0, 100% 0, 82% 100%, 0 100%)",
            }}
          >
            {leftImageSrc ? (
              <Image
                src={leftImageSrc}
                alt={leftImageAlt || ""}
                fill
                priority
                sizes="(max-width: 1279px) 0px, 159px"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="relative min-h-0 w-full min-w-0 flex-1">
            <HeroGallerySlides images={galleryImages} state={galleryState} />
          </div>
        </div>

        {/* Copy + controls below image */}
        <Container className="border-t border-slate-200 py-8 sm:py-10 md:py-12">
          <div className="flex flex-col items-center gap-8 md:items-start md:gap-10">
            <HeroCopyBlock
              title={title}
              subtitle={subtitle}
              primaryCta={primaryCta}
              secondaryCta={secondaryCta}
            />
            <HeroGalleryControls state={galleryState} className="w-full md:max-w-3xl" />
          </div>
        </Container>
      </div>
    </Section>
  );
}
