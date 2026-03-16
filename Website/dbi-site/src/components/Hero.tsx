"use client";

import Image from "next/image";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";

// Blue trapezoid: diagonal slopes down and left (top-right further right than bottom-right)
const BLUE_CLIP = "polygon(0% 0%, 30% 0%, 45% 100%, 15% 100%)";
// Slightly larger polygon for thin white border/gap
// const WHITE_BORDER_CLIP = "polygon(0% 0%, 61% 0%, 46% 100%, 0% 100%)";
const WHITE_BORDER_CLIP = "polygon(0% 6%, 30% 0%, 44% 100%, 14% 100%)";

type HeroCta = {
  href?: string;
  label?: string;
};

export type HeroProps = {
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
};

function MaskGroup({ imageSrc, imageAlt }: { imageSrc?: string; imageAlt?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden" data-name="Mask group" aria-hidden>
      {/* Tan left accent */}
      <div
        className="absolute left-0 top-0 h-full w-[280px] md:w-[320px] lg:w-[360px] bg-[#e4ddd3]"
        style={{
          clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
          WebkitClipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
        }}
      />
      {/* Hero image with diagonal clip */}
      {imageSrc && (
        <div>
          <div className="absolute inset-0 bg-[#b5b2a9]" />
          <Image
            src={imageSrc}
            alt={imageAlt || "Hero"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}

function BlueOverlay() {
  return (
    <>
      <div
        className="absolute h-full pointer-events-none"
        style={{
          clipPath: WHITE_BORDER_CLIP,
          WebkitClipPath: WHITE_BORDER_CLIP,
          backgroundColor: "white",
        }}
        aria-hidden
      />
      <div
        className="absolute h-full pointer-events-none"
        style={{
          clipPath: BLUE_CLIP,
          WebkitClipPath: BLUE_CLIP,
          backgroundColor: "#2A579C",
        }}
        aria-hidden
      />
    </>
  );
}

function HeroContent({
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
  const displayTitle = title || "EDUCATE.\nADVOCATE.\nELEVATE.";
  const lines = displayTitle.split("\n");

  return (
    <div
      className="relative min-h-[600px] py-10 h-full inset-0 flex items-center"
      data-name="Hero Content"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 lg:px-5 pl-5">
        <div className="max-w-xl md:max-w-2xl z-20 relative">
          <h1 className="font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-[40px] leading-[1.15] tracking-tight py-5 px-20">
            {lines.map((line, i) => (
              <span key={i}>
                {line}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          {subtitle ? (
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-white/95 max-w-lg">{subtitle}</p>
          ) : null}
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            {primaryCta?.label ? (
              <Button
                href={primaryCta.href}
                variant="cta-primary"
                className="touch-target w-full sm:w-auto justify-center"
              >
                {primaryCta.label}
              </Button>
            ) : null}
            {secondaryCta?.label ? (
              <Button
                href={secondaryCta.href}
                variant="cta-secondary"
                className="touch-target w-full sm:w-auto justify-center text-white"
              >
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </div>
        <BlueOverlay />
      </div>
    </div>
  );
}

export function Hero({ imageSrc, imageAlt, title, subtitle, primaryCta, secondaryCta }: HeroProps) {
  return (
    <Section className="relative w-full overflow-hidden" noPadding reveal={false}>
      <div
        className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px]"
        data-name="Hero"
      >
        <HeroContent
          title={title}
          subtitle={subtitle}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
        />
      </div>
    </Section>
  );
}
