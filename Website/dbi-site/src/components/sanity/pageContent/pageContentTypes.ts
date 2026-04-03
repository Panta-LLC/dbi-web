import type { CarouselSettings } from "@/components/carousel";
import type { SanityImageSource } from "@sanity/image-url";
import type { SanityCtaAction } from "@/lib/sanity-cta-action";

export type Cta = {
  label?: string;
  href?: string;
};

export type ContentBlock = {
  _key?: string;
  _type: string;
  title?: string;
  subtitle?: string;
  text?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  legalText?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Full image field (crop/hotspot); prefer `urlForSanityImage` over raw `imageSrc`. */
  image?: SanityImageSource;
  ctaVariant?: "primary" | "secondary";
  buttonVariant?: "primary" | "secondary";
  primaryCta?: Cta;
  secondaryCta?: Cta;
  programCta?: SanityCtaAction | Cta;
  /** Section-level CTA (card grid / image card grid fallbacks). */
  cta?: SanityCtaAction;
  programItems?: Array<{
    title?: string;
    description?: string;
    image?: SanityImageSource;
    imageSrc?: string;
    imageAlt?: string;
    href?: string;
    hoverColor?: string;
    cardCta?: SanityCtaAction;
  }>;
  impactMetrics?: Array<{
    value?: string;
    label?: string;
    href?: string;
  }>;
  leftImage?: SanityImageSource;
  leftImageSrc?: string;
  leftImageAlt?: string;
  galleryImages?: Array<{
    image?: SanityImageSource;
    imageSrc?: string;
    imageAlt?: string;
  }>;
  testimonialItems?: Array<{
    quote?: string;
    attribution?: string;
  }>;
  highlightItems?: Array<{
    text?: string;
  }>;
  carouselSettings?: CarouselSettings | null;
  /** Max columns on large screens (2–4); responsive breakpoints stack fewer on small viewports. */
  columnsPerRow?: number;
  cardItems?: Array<{
    title?: string;
    description?: string;
    detail?: string;
    image?: SanityImageSource;
    imageSrc?: string;
    imageAlt?: string;
    hoverColor?: string;
    href?: string;
    cardCta?: SanityCtaAction;
  }>;
  expandedMode?: boolean;
  sectionLayout?: "cardGrid" | "explorer";
  defaultView?: "grid" | "explorer";
  cardSize?: "sm" | "md" | "lg";
  collectionArticleItems?: Array<{
    heading?: string;
    summary?: string;
    subtitle?: string;
    description?: string;
    image?: SanityImageSource;
    imageSrc?: string;
    imageAlt?: string;
    href?: string;
    cardCta?: SanityCtaAction;
  }>;
  imageItems?: Array<{
    title?: string;
    subtitle?: string;
    image?: SanityImageSource;
    imageSrc?: string;
    imageAlt?: string;
    cardCta?: SanityCtaAction;
  }>;
  textCta?: Cta;
  ctaButton?: Cta;
  imagePosition?: "left" | "right";
  backgroundColor?: string;
  ctas?: Cta[];
};
