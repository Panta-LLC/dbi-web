"use client";

import Image from "next/image";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";

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
      {/* Hero image with diagonal clip */}
      {imageSrc && (
        <div className="absolute inset-0">
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
    <div className="absolute  inset-0 flex items-start" data-name="Hero Content">
      <div className="absolute flex items-center z-20 py-5 pl-2 md:pl-16 h-full">
        <div className="relative z-1 pl-12 sm:pl-20 md:pl-18 lg:pl-18">
          <h1 className="font-bold text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight">
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
          <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row flex-wrap gap-3">
            {primaryCta?.label ? (
              <Button
                href={primaryCta.href}
                variant="cta-knockout"
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
        {/* Blue block: 100% + 20px height relative to this hero, 10px white border, opposite slant (top-right to bottom-left) */}
        <div
          className="absolute left-0 top-0 z-0 w-full max-w-xl border-10 border-t-0 border-white bg-primary pointer-events-none"
          style={{
            height: "calc(100% + 30px)",
            transform: "skewX(15deg)",
            transformOrigin: "top left",
          }}
          aria-hidden
        />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-5xl h-full"></div>
    </div>
  );
}

export function Hero({ imageSrc, imageAlt, title, subtitle, primaryCta, secondaryCta }: HeroProps) {
  return (
    <Section className="relative w-full mb-2" noPadding reveal={false}>
      <div
        className="relative w-full h-[55vw] sm:h-[45vw] lg:h-[40vw] max-h-[550px]"
        data-name="Hero"
      >
        <MaskGroup imageSrc={imageSrc} imageAlt={imageAlt} />
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
