"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import {
  CarouselArrowButton,
  CarouselDotNav,
  CarouselProgressBar,
  animClass,
  resolveCarouselSettings,
  useCarousel,
  type CarouselSettings,
} from "@/components/carousel";
import { Section } from "@/components/Section";

const HERO_GALLERY_ACCENT = "var(--color-2, #ff7900)";

/** Layout proportions: 159×548 left strip + 882×548 gallery (desktop). */
const LEFT_WIDTH_FRAC = 159 / (159 + 882);

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
  const showDots = resolved.showPagination ?? c.multi;
  const showBar =
    (resolved.showProgress ?? !!resolved.autoPlayMs) && !!resolved.autoPlayMs && c.multi;

  const baseId = useId();
  const regionId = `${baseId}-hero-gallery`;
  const labelId = `${baseId}-hero-gallery-label`;

  const multi = c.multi;
  const enterClass = multi ? animClass(resolved.transition, c.direction) : "";
  const slideDurationMs = resolved.transitionDurationMs;
  const srLabel = `Hero gallery, slide ${c.activeIndex + 1} of ${count}`;
  const current = count > 0 ? images[c.activeIndex] : undefined;

  return {
    resolved,
    count,
    c,
    showDots,
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
          <div className="pointer-events-none absolute inset-0 bg-black/20" aria-hidden />
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
        <div className="pointer-events-none absolute inset-0 bg-black/20" aria-hidden />
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
      <div className="pointer-events-none absolute inset-0 bg-black/20" aria-hidden />
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
      className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
    >
      <span id={labelId} className="sr-only">
        {srLabel}
      </span>

      <div className="absolute inset-0 min-h-0">{slideStack}</div>
    </div>
  );
}

const HERO_CTRL_ARROW =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50";

/** Unified pill: prev / dots / next / pause + slide counter + optional progress */
function HeroGalleryControls({ state, className = "" }: { state: HeroGalleryState; className?: string }) {
  const { resolved, count, c, showDots, showBar, multi } = state;
  if (!multi) return null;

  const showPause = !!(resolved.autoPlayMs && resolved.autoPlayMs > 0);

  return (
    <div
      role="group"
      aria-label="Hero carousel controls"
      className={`pointer-events-auto flex flex-col items-center gap-2.5 ${className}`.trim()}
    >
      <div className="flex max-w-[min(100%,28rem)] flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-black/45 px-2 py-2 shadow-lg backdrop-blur-md sm:gap-3 sm:px-4 sm:py-2.5">
        <CarouselArrowButton
          direction="prev"
          onClick={c.goPrev}
          label="Previous hero image"
          accentColor={HERO_GALLERY_ACCENT}
          className={HERO_CTRL_ARROW}
        />
        {showDots ? (
          <CarouselDotNav
            show
            count={count}
            activeIndex={c.activeIndex}
            onSelect={c.goToIndex}
            navLabel="Hero gallery pagination"
            getDotLabel={(i, n) => `Go to hero image ${i + 1} of ${n}`}
            activeDotClassName="bg-white scale-110"
            inactiveDotClassName="bg-white/50 hover:bg-white/80"
            dotButtonClassName="inline-flex touch-target items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
            navClassName="mt-0 flex flex-wrap items-center justify-center gap-2.5 px-1"
          />
        ) : null}
        <CarouselArrowButton
          direction="next"
          onClick={c.goNext}
          label="Next hero image"
          accentColor={HERO_GALLERY_ACCENT}
          className={HERO_CTRL_ARROW}
        />
        <span
          className="min-w-[3.25rem] text-center text-xs font-semibold tabular-nums text-white/95 sm:text-sm"
          aria-live="polite"
        >
          {c.activeIndex + 1} / {count}
        </span>
        {showPause ? (
          <button
            type="button"
            onClick={() => c.setPaused(!c.paused)}
            aria-pressed={c.paused}
            aria-label={c.paused ? "Play slideshow" : "Pause slideshow"}
            className={HERO_CTRL_ARROW}
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
          trackClassName="h-1 w-full max-w-[min(20rem,90vw)] overflow-hidden rounded-full bg-white/25"
        />
      ) : null}
    </div>
  );
}

function HeroContent({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  mobileGalleryControls,
}: {
  title?: string;
  subtitle?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  mobileGalleryControls?: ReactNode;
}) {
  const displayTitle = title || "EDUCATE.\nADVOCATE.\nELEVATE.";
  const lines = displayTitle.split("\n");

  const copyBlock = (
    <div className="pointer-events-auto relative z-[1] w-full max-w-lg max-md:mx-auto max-md:text-center md:max-w-[min(28rem,44vw)]">
      <h1 className="text-2xl font-bold leading-[1.12] tracking-tight text-white text-balance sm:text-3xl md:text-4xl md:text-left lg:text-5xl">
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </h1>
      {subtitle ? (
        <p className="body-md mt-3 max-w-[42ch] leading-relaxed text-white/95 max-md:mx-auto md:mt-4 md:text-left">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-4 flex max-md:flex-col max-md:items-center max-md:gap-3 sm:mt-5 sm:flex-row sm:flex-wrap sm:gap-4">
        {primaryCta?.label ? (
          <Button
            href={primaryCta.href}
            variant="cta-hero"
            className="w-full justify-center shadow-black/30 sm:w-auto"
          >
            {primaryCta.label}
          </Button>
        ) : null}
        {secondaryCta?.label ? (
          <Button
            href={secondaryCta.href}
            variant="cta-secondary"
            className="touch-target w-full justify-center text-white sm:w-auto"
          >
            {secondaryCta.label}
          </Button>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-20 md:z-25">
      {/* Desktop: left-aligned copy over image — no skew panel */}
      <div
        className="pointer-events-none absolute inset-0 z-25 hidden md:flex md:items-center"
        data-name="Hero Content"
      >
        <div className="pointer-events-auto relative z-20 w-full max-w-[min(480px,46vw)] px-6 py-8 md:pl-12 lg:pl-20 lg:py-10">
          {copyBlock}
        </div>
      </div>

      {/* Mobile: bottom scrim + copy + carousel controls in one stack */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-end md:hidden"
        data-name="Hero Content Mobile"
      >
        <div className="bg-gradient-to-t from-black/92 via-black/55 to-transparent px-5 pb-8 pt-20 sm:px-6">
          <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-5">
            {copyBlock}
            {mobileGalleryControls}
          </div>
        </div>
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
      <div
        className="relative isolate w-full min-w-0 max-md:aspect-[882/548] max-md:min-h-[350px] max-[350px]:min-h-0 max-md:overflow-hidden md:block md:h-[min(548px,55vw)] md:max-h-[548px] lg:h-[min(548px,40vw)]"
        data-name="Hero"
      >
        {/* Base layer: gallery full-bleed; optional left strip only on xl+ */}
        <div className="absolute inset-0 z-0 flex min-h-0 w-full min-w-0 flex-col xl:relative xl:flex xl:h-full xl:flex-row">
          <div
            className="relative hidden h-full shrink-0 overflow-hidden bg-[#b5b2a9] xl:block"
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
          <div className="relative h-full min-h-0 w-full min-w-0 flex-1 bg-[#b5b2a9]">
            <HeroGallerySlides images={galleryImages} state={galleryState} />
          </div>
        </div>

        <HeroContent
          title={title}
          subtitle={subtitle}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
          mobileGalleryControls={
            <HeroGalleryControls state={galleryState} className="relative z-30 w-full md:hidden" />
          }
        />

        <HeroGalleryControls
          state={galleryState}
          className="absolute bottom-5 left-1/2 z-40 hidden w-[min(100%,28rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 md:flex"
        />
      </div>
    </Section>
  );
}
