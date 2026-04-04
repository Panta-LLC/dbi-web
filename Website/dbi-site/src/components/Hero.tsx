"use client";

import Image from "next/image";
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

/** Mobile: blue slant clip (inner edge). */
const SLANT_CLIP_LEFT = "polygon(0 0, 100% 0, 72% 100%, 0 100%)";
const SLANT_CLIP_RIGHT = "polygon(28% 0, 100% 0, 100% 100%, 0 100%)";

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
      className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
    >
      <span id={labelId} className="sr-only">
        {srLabel}
      </span>

      <div className="absolute inset-0 min-h-0">{slideStack}</div>
    </div>
  );
}

function HeroGalleryControls({
  state,
  className,
  variant = "default",
}: {
  state: HeroGalleryState;
  className?: string;
  /** `minimal` = arrows + thin progress bar only (small screens). */
  variant?: "default" | "minimal";
}) {
  const { resolved, count, c, showDots, showBar, multi } = state;
  if (!multi) return null;

  const minimal = variant === "minimal";
  const showDotsUi = !minimal && showDots;
  const arrowBtnClass = minimal
    ? "flex h-6 w-6 shrink-0 items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151]"
    : "flex h-8 w-8 shrink-0 scale-90 items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151]";
  const progressTrackClass = minimal
    ? "h-0.5 w-10 shrink-0 overflow-hidden rounded-full bg-white/25 px-0"
    : "h-1 w-16 shrink-0 overflow-hidden rounded-full bg-white/25 px-0";

  return (
    <div
      className={
        className ??
        (minimal
          ? "pointer-events-auto flex max-w-[calc(100%-1rem)] items-center gap-1 rounded-md bg-black/40 px-1.5 py-0.5 backdrop-blur-sm"
          : "pointer-events-auto absolute right-3 bottom-3 z-30 flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-md bg-black/45 px-2 py-1 shadow-md backdrop-blur-sm")
      }
    >
      <CarouselArrowButton
        direction="prev"
        onClick={c.goPrev}
        label="Previous hero image"
        accentColor={HERO_GALLERY_ACCENT}
        className={arrowBtnClass}
      />
      {showBar ? (
        <CarouselProgressBar
          show
          activeIndex={c.activeIndex}
          autoPlayMs={resolved.autoPlayMs ?? 8000}
          fillColor={HERO_GALLERY_ACCENT}
          trackClassName={progressTrackClass}
        />
      ) : null}
      {showDotsUi ? (
        <CarouselDotNav
          show
          count={count}
          activeIndex={c.activeIndex}
          onSelect={c.goToIndex}
          navLabel="Hero gallery pagination"
          getDotLabel={(i, n) => `Go to hero image ${i + 1} of ${n}`}
          activeDotClassName="bg-white scale-110"
          inactiveDotClassName="bg-white/50 hover:bg-white/80"
          dotButtonClassName="touch-target rounded-full p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
          navClassName="mt-0 flex items-center gap-1 [&_button>span]:!h-2 [&_button>span]:!w-2"
        />
      ) : null}
      <CarouselArrowButton
        direction="next"
        onClick={c.goNext}
        label="Next hero image"
        accentColor={HERO_GALLERY_ACCENT}
        className={arrowBtnClass}
      />
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
    <div className="pointer-events-auto relative z-1 w-full max-w-lg max-md:mx-auto max-md:text-center md:pl-22">
      <h1 className="font-bold text-white text-2xl leading-[1.15] tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </h1>
      {subtitle ? (
        <p className="body-md mt-2 max-w-lg text-white/95 max-md:mx-auto">{subtitle}</p>
      ) : null}
      <div className="mt-2 flex flex-col flex-wrap gap-3 sm:mt-4 max-md:items-center sm:flex-row">
        {primaryCta?.label ? (
          <Button
            href={primaryCta.href}
            variant="cta-knockout"
            className="touch-target w-full justify-center sm:w-auto"
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
      {/* Desktop: overlay on image */}
      <div
        className="pointer-events-none absolute inset-0 z-25 hidden items-start md:flex"
        data-name="Hero Content"
      >
        <div className="absolute z-20 flex h-full max-w-[50vw] items-center py-5 pl-2 md:max-w-[440px] md:pl-16">
          {copyBlock}
          <div
            className="pointer-events-none absolute top-0 left-0 z-0 hidden w-full max-w-xl border-10 border-t-0 border-white bg-primary md:block"
            style={{
              height: "calc(100% + 30px)",
              transform: "skewX(15deg)",
              transformOrigin: "top left",
            }}
            aria-hidden
          />
        </div>
        <div className="relative z-10 mx-auto h-full w-full max-w-5xl" />
      </div>

      {/* Mobile: overlay on gallery; slants sit above (z-30) on the sides */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/88 via-black/58 to-transparent px-[max(1.25rem,calc(min(3.75rem,5vw)+1rem))] pt-12 pb-6 md:hidden"
        data-name="Hero Content Mobile"
      >
        <div className="pointer-events-auto flex w-full flex-col items-center gap-2">
          {copyBlock}
          {mobileGalleryControls}
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
        {/* Base layer: gallery full-bleed under overlays; desktop = row with left strip */}
        <div className="absolute inset-0 z-0 flex min-h-0 w-full min-w-0 flex-col md:relative md:flex md:h-full md:flex-row">
          <div
            className="relative hidden h-full shrink-0 overflow-hidden bg-[#b5b2a9] md:block"
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
                sizes="(max-width: 768px) 24vw, 159px"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="relative h-full min-h-0 w-full min-w-0 flex-1 bg-[#b5b2a9]">
            <HeroGallerySlides images={galleryImages} state={galleryState} />
            <HeroGalleryControls
              state={galleryState}
              className="pointer-events-auto absolute right-3 bottom-3 z-30 hidden max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-md bg-black/45 px-2 py-1 shadow-md backdrop-blur-sm md:flex"
            />
          </div>
        </div>

        <HeroContent
          title={title}
          subtitle={subtitle}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
          mobileGalleryControls={
            <HeroGalleryControls
              state={galleryState}
              variant="minimal"
              className="pointer-events-auto relative z-30 mt-0.5 flex w-full max-w-44 shrink-0 justify-center gap-1 rounded-md bg-black/40 px-1.5 py-0.5 backdrop-blur-sm md:hidden"
            />
          }
        />

        {/* Overlay: blue frame + white bands — above gallery + copy; image runs full width underneath */}
        <div className="pointer-events-none absolute inset-0 z-[35] md:hidden" aria-hidden>
          <div className="absolute top-0 bottom-0 left-0 flex w-[min(3.75rem,5vw)] flex-col">
            <div
              className="min-h-0 flex-1 w-full bg-primary relative z-50"
              style={{ clipPath: SLANT_CLIP_LEFT }}
            />
            <div
              className="min-h-0 flex-1 w-full bg-white absolute inset-0 left-3"
              style={{ clipPath: SLANT_CLIP_LEFT }}
            />
          </div>
          <div className="absolute top-0 right-0 bottom-0 flex w-[min(3.75rem,5vw)] flex-col">
            <div
              className="min-h-0 flex-1 w-full bg-primary relative z-50"
              style={{ clipPath: SLANT_CLIP_RIGHT }}
            />
            <div
              className="min-h-0 flex-1 w-full bg-white absolute inset-0 -left-3"
              style={{ clipPath: SLANT_CLIP_RIGHT }}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
