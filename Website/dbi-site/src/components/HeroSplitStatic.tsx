import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/types";
import { Button } from "@/components/Button";
import { HeroSplitDescription } from "@/components/HeroSplitDescription";
import { Section } from "@/components/Section";

/** Matches `--color-1` … `--color-5` in globals.css / Sanity list values. */
export type HeroSplitPalette = "color-1" | "color-2" | "color-3" | "color-4" | "color-5";

export type HeroSplitCta = {
  label?: string;
  href?: string;
};

export type HeroSplitStaticProps = {
  /** When omitted, the hero is content-only (full width). */
  imageSrc?: string;
  /** Optional; use when `imageSrc` is set for accessibility. */
  imageAlt?: string;
  title: string;
  /** Portable Text from Sanity or legacy plain string. */
  description?: string | PortableTextBlock[];
  ctas?: HeroSplitCta[];
  /** Background for the content column using design tokens. */
  backgroundPalette?: HeroSplitPalette;
  /** `left`: image column first (mobile: image above content). `right`: content first (mobile: content above image). */
  imagePosition?: "left" | "right";
};

const PALETTE_VAR: Record<HeroSplitPalette, string> = {
  "color-1": "var(--color-1)",
  "color-2": "var(--color-2)",
  "color-3": "var(--color-3)",
  "color-4": "var(--color-4)",
  "color-5": "var(--color-5)",
};

function isLightPalette(p: HeroSplitPalette): boolean {
  return p === "color-3";
}

function ImageHalf({ imageSrc, imageAlt }: { imageSrc: string; imageAlt?: string | undefined }) {
  return (
    <div className="relative w-full min-w-0 min-h-[min(88vw,420px)] md:min-h-0 md:flex-1">
      <Image
        src={imageSrc}
        alt={imageAlt ?? ""}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}

function ContentHalf({
  title,
  description,
  ctas,
  backgroundPalette,
  isLight,
}: {
  title: string;
  description?: string | PortableTextBlock[];
  ctas?: HeroSplitCta[];
  backgroundPalette: HeroSplitPalette;
  isLight: boolean;
}) {
  const bg = PALETTE_VAR[backgroundPalette];
  const headingClass = isLight ? "text-[var(--color-4)]" : "text-white";

  return (
    <div
      className="flex min-w-0 flex-1 flex-col justify-center px-6 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20"
      style={{ backgroundColor: bg }}
    >
      <h1 className={`display-l font-bold ${headingClass}`}>{title}</h1>
      <HeroSplitDescription value={description} isLight={isLight} />
      {ctas?.length ? (
        <div className="mt-6 flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
          {ctas.map((cta, i) => {
            if (!cta.label?.trim()) return null;
            const variant: "cta-primary" | "cta-secondary" =
              i % 2 === 0 ? "cta-primary" : "cta-secondary";
            const secondaryClass = isLight ? "" : "text-white";
            return (
              <Button
                key={`${cta.label}-${i}`}
                href={cta.href}
                variant={variant}
                className={`touch-target w-full justify-center sm:w-auto ${
                  variant === "cta-secondary" ? secondaryClass : ""
                }`}
              >
                {cta.label}
              </Button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function HeroSplitStatic({
  imageSrc,
  imageAlt,
  title,
  description,
  ctas = [],
  backgroundPalette = "color-1",
  imagePosition = "left",
}: HeroSplitStaticProps) {
  const isLight = isLightPalette(backgroundPalette);
  const imageLeft = imagePosition === "left";
  const resolvedImageSrc = (imageSrc ?? "").trim();
  const hasImage = resolvedImageSrc.length > 0;

  return (
    <Section className="w-full" noPadding reveal={false}>
      {/* Mobile: image left → image stacked above content; image right → content above image (reading order before visual). Desktop: 50/50 row. No image → full-width content. */}
      <div
        className="flex w-full flex-col md:min-h-[min(70vh,560px)] md:flex-row"
        data-name="HeroSplitStatic"
      >
        {!hasImage ? (
          <ContentHalf
            title={title}
            description={description}
            ctas={ctas}
            backgroundPalette={backgroundPalette}
            isLight={isLight}
          />
        ) : imageLeft ? (
          <>
            <ImageHalf imageSrc={resolvedImageSrc} imageAlt={imageAlt} />
            <ContentHalf
              title={title}
              description={description}
              ctas={ctas}
              backgroundPalette={backgroundPalette}
              isLight={isLight}
            />
          </>
        ) : (
          <>
            <ContentHalf
              title={title}
              description={description}
              ctas={ctas}
              backgroundPalette={backgroundPalette}
              isLight={isLight}
            />
            <ImageHalf imageSrc={resolvedImageSrc} imageAlt={imageAlt} />
          </>
        )}
      </div>
    </Section>
  );
}
