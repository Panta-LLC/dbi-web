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
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 75vw, 660px"
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
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 75vw, 660px"
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
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 75vw, 660px"
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
      className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
    >
      <span id={labelId} className="sr-only">
        {srLabel}
      </span>

      <div className="absolute inset-0 min-h-0">{slideStack}</div>
    </div>
  );
}

const HERO_CTRL_LIGHT =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

const HERO_CTRL_OVERLAY =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-black/50 text-white ring-1 ring-white/20 hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 sm:h-11 sm:w-11";

type HeroControlsPlacement = "below" | "overlay";

function HeroGalleryControls({
  state,
  className = "",
  placement = "below",
  surface = "default",
}: {
  state: HeroGalleryState;
  className?: string;
  placement?: HeroControlsPlacement;
  /** `primary` = copy/controls on `bg-primary` (mobile stack). */
  surface?: "default" | "primary";
}) {
  const { resolved, count, c, showBar, multi } = state;
  if (!multi) return null;

  const showPause = !!(resolved.autoPlayMs && resolved.autoPlayMs > 0);
  const overlay = placement === "overlay";
  const onPrimary = surface === "primary" && placement === "below";
  const btnClass = overlay ? HERO_CTRL_OVERLAY : HERO_CTRL_LIGHT;
  const counterClass = overlay
    ? "min-w-16 text-center text-sm font-semibold tabular-nums text-white/95"
    : onPrimary
      ? "min-w-16 text-center text-sm font-semibold tabular-nums text-white"
      : "min-w-16 text-center text-sm font-semibold tabular-nums text-slate-700 sm:text-base";
  const barTrack = overlay
    ? "h-1 w-full max-w-[min(20rem,40vw)] overflow-hidden rounded-full bg-white/25"
    : onPrimary
      ? "h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/25"
      : "h-1.5 w-full max-w-md overflow-hidden rounded-full bg-slate-200";

  const row = (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${overlay ? "rounded-md bg-black/45 px-2 py-1.5 shadow-md backdrop-blur-sm" : ""}`}
    >
      <CarouselArrowButton
        direction="prev"
        onClick={c.goPrev}
        label="Previous hero image"
        accentColor={HERO_GALLERY_ACCENT}
        className={btnClass}
      />
      <span className={counterClass} aria-live="polite">
        {c.activeIndex + 1} / {count}
      </span>
      <CarouselArrowButton
        direction="next"
        onClick={c.goNext}
        label="Next hero image"
        accentColor={HERO_GALLERY_ACCENT}
        className={btnClass}
      />
      {showPause ? (
        <button
          type="button"
          onClick={() => c.setPaused(!c.paused)}
          aria-pressed={c.paused}
          aria-label={c.paused ? "Play slideshow" : "Pause slideshow"}
          className={btnClass}
        >
          {c.paused ? (
            <Play className="h-5 w-5" strokeWidth={2} aria-hidden />
          ) : (
            <Pause className="h-5 w-5" strokeWidth={2} aria-hidden />
          )}
        </button>
      ) : null}
    </div>
  );

  return (
    <div
      role="group"
      aria-label="Hero carousel controls"
      className={`flex flex-col items-stretch gap-2 sm:items-center ${className}`.trim()}
    >
      {row}
      {showBar ? (
        <CarouselProgressBar
          show
          activeIndex={c.activeIndex}
          autoPlayMs={resolved.autoPlayMs ?? 8000}
          fillColor={HERO_GALLERY_ACCENT}
          trackClassName={barTrack}
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
  layout,
}: {
  title?: string;
  subtitle?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  layout: "overlay" | "mobileStack";
}): ReactNode {
  const displayTitle = title || "EDUCATE.\nADVOCATE.\nELEVATE.";
  const lines = displayTitle.split("\n");
  const wrapClass =
    layout === "overlay"
      ? "pointer-events-auto relative z-1 w-full max-w-lg md:pl-22"
      : "w-full max-w-lg mx-auto text-center";

  return (
    <div className={wrapClass}>
      <h1 className="font-bold text-white text-2xl leading-[1.15] tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </h1>
      {subtitle ? (
        <p
          className={`body-md mt-2 max-w-lg text-white/95 ${layout === "mobileStack" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      ) : null}
      <div
        className={`mt-2 flex flex-col flex-wrap gap-3 sm:mt-4 sm:flex-row ${layout === "mobileStack" ? "items-center" : ""}`}
      >
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
            className={
              layout === "mobileStack"
                ? "touch-target w-full justify-center border-white text-white sm:w-auto [--color-2:theme(colors.white)]"
                : "touch-target w-full justify-center text-white sm:w-auto"
            }
          >
            {secondaryCta.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function HeroContentDesktop({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: {
  title?: string;
  subtitle?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
      <div
        className="pointer-events-none absolute inset-0 z-25 flex items-start"
        data-name="Hero Content"
      >
        <div className="absolute z-20 flex h-full max-w-[50vw] items-center py-5 pl-2 md:max-w-[440px] md:pl-16">
          <HeroCopyBlock
            layout="overlay"
            title={title}
            subtitle={subtitle}
            primaryCta={primaryCta}
            secondaryCta={secondaryCta}
          />
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
      <div className="relative isolate w-full min-w-0 bg-white" data-name="Hero">
        {/* Mobile: image only, then primary band with copy + controls */}
        {/* Desktop: strip + gallery row + absolute copy */}
        <div className="relative z-0 flex min-h-0 w-full min-w-0 flex-col max-md:flex-none md:flex-row md:h-[min(548px,55vw)] md:max-h-[548px] lg:h-[min(548px,40vw)]">
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

          <div className="flex min-h-0 w-full min-w-0 flex-col max-md:flex-none max-md:grow-0 md:flex-1 md:min-h-0 md:flex-row md:overflow-hidden">
            {/* Image band */}
            <div className="relative w-full max-md:aspect-[882/548] max-md:min-h-[249px] max-md:overflow-hidden max-[350px]:min-h-0 md:flex md:min-h-0 md:flex-1 md:bg-[#b5b2a9]">
              <div className="relative flex h-full min-h-0 w-full items-stretch justify-end overflow-hidden md:min-h-0">
                <div className="relative h-full min-h-0 w-full md:w-[calc(75%+30px)]">
                  <HeroGallerySlides images={galleryImages} state={galleryState} />
                  <HeroGalleryControls
                    state={galleryState}
                    placement="overlay"
                    className="pointer-events-auto absolute right-3 bottom-3 z-30 hidden md:flex"
                  />
                </div>
              </div>
            </div>

            {/* Small screens: copy + controls below image, brand blue */}
            <div className="bg-primary text-primary-foreground md:hidden">
              <Container className="py-8 sm:py-10">
                <div className="flex flex-col gap-8">
                  <HeroCopyBlock
                    layout="mobileStack"
                    title={title}
                    subtitle={subtitle}
                    primaryCta={primaryCta}
                    secondaryCta={secondaryCta}
                  />
                  <HeroGalleryControls
                    state={galleryState}
                    placement="below"
                    surface="primary"
                    className="w-full"
                  />
                </div>
              </Container>
            </div>
          </div>
        </div>

        <HeroContentDesktop
          title={title}
          subtitle={subtitle}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
        />
      </div>
    </Section>
  );
}
