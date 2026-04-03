import type { ProgramCardItem } from "@/components/ProgramCards";
import type { HeroSplitPalette } from "@/components/HeroSplitStatic";
import type { GridCardCtaResolved } from "@/lib/grid-card-cta";
import { urlForSanityImage } from "@/lib/sanity-image";
import {
  contactFormPlaceholdersFromSanity,
  isContactFormCta,
  isLinkCta,
  presentationFromSanity,
  type SanityCtaAction,
} from "@/lib/sanity-cta-action";
import type { ContentBlock, Cta } from "./pageContentTypes";

/** Hero gallery (882×548) and left strip (159×548); 2× for sharp retina CDN output. */
export const heroSectionImageUrlOptions = {
  gallery: { width: 1764, height: 1096 },
  leftStrip: { width: 318, height: 1096 },
} as const;

const HERO_SPLIT_PALETTES: HeroSplitPalette[] = [
  "color-1",
  "color-2",
  "color-3",
  "color-4",
  "color-5",
];

export function heroSplitPalette(value: string | undefined): HeroSplitPalette {
  if (value && HERO_SPLIT_PALETTES.includes(value as HeroSplitPalette)) {
    return value as HeroSplitPalette;
  }
  return "color-1";
}

export function resolveHref(
  href: string | undefined,
  donateUrl: string | null | undefined,
): string | undefined {
  if (!href) return undefined;
  if (href === "/donate" && donateUrl) return donateUrl;
  return href;
}

export function sectionCtaLinkFallback(
  cta: SanityCtaAction | Cta | undefined,
  donateUrl: string | null | undefined,
): string | undefined {
  if (!cta) return undefined;
  if ("kind" in cta && cta.kind === "contactForm") return undefined;
  const href = typeof cta.href === "string" ? cta.href.trim() : "";
  if (!href) return undefined;
  return resolveHref(href, donateUrl);
}

export function mapProgramCardItem(
  item: NonNullable<ContentBlock["programItems"]>[number],
  block: ContentBlock,
  donateUrl: string | null | undefined,
): ProgramCardItem {
  const sectionHref = sectionCtaLinkFallback(block.programCta, donateUrl);
  const fallback = resolveHref(item.href ?? undefined, donateUrl) ?? sectionHref ?? "/services";

  const cardCta = item.cardCta;

  if (cardCta && isContactFormCta(cardCta)) {
    const cf = cardCta.contactForm;
    return {
      title: item.title ?? "",
      imageSrc: urlForSanityImage(item.image) ?? item.imageSrc,
      imageAlt: item.imageAlt,
      hoverColor: item.hoverColor,
      href: fallback,
      contactModal: {
        formId: cardCta.formId.trim(),
        triggerLabel: cardCta.label.trim(),
        presentation: presentationFromSanity(cardCta.presentation ?? undefined),
        messageContext: cardCta.messageContext ?? undefined,
        title: cardCta.modalTitle ?? undefined,
        description: cardCta.modalDescription ?? undefined,
        placeholders: contactFormPlaceholdersFromSanity(cf),
        submitLabel: cf.submitLabel?.trim() || "Send",
        successMessage: cardCta.successMessage ?? undefined,
      },
    };
  }

  let href = fallback;
  let linkCtaLabel: string | undefined;
  if (cardCta && isLinkCta(cardCta)) {
    href = resolveHref(cardCta.href, donateUrl) ?? fallback;
    linkCtaLabel = cardCta.label.trim();
  }

  return {
    title: item.title ?? "",
    imageSrc: urlForSanityImage(item.image) ?? item.imageSrc,
    imageAlt: item.imageAlt,
    hoverColor: item.hoverColor,
    href,
    linkCtaLabel,
  };
}

export function mapGridCardCta(
  item: { cardCta?: SanityCtaAction; href?: string },
  sectionCta: SanityCtaAction | undefined,
  donateUrl: string | null | undefined,
): GridCardCtaResolved | undefined {
  const sectionHref = sectionCtaLinkFallback(sectionCta, donateUrl);
  const fallback = resolveHref(item.href, donateUrl) ?? sectionHref;

  const cardCta = item.cardCta;

  if (cardCta && isContactFormCta(cardCta)) {
    const cf = cardCta.contactForm;
    return {
      kind: "contactForm",
      formId: cardCta.formId.trim(),
      triggerLabel: cardCta.label.trim(),
      presentation: presentationFromSanity(cardCta.presentation ?? undefined),
      messageContext: cardCta.messageContext ?? undefined,
      title: cardCta.modalTitle ?? undefined,
      description: cardCta.modalDescription ?? undefined,
      placeholders: contactFormPlaceholdersFromSanity(cf),
      submitLabel: cf.submitLabel?.trim() || "Send",
      successMessage: cardCta.successMessage ?? undefined,
    };
  }

  let href = fallback;
  if (cardCta && isLinkCta(cardCta)) {
    href = resolveHref(cardCta.href, donateUrl) ?? fallback;
  }

  if (cardCta && isLinkCta(cardCta)) {
    if (!href) return undefined;
    return { kind: "link", label: cardCta.label.trim(), href };
  }

  if (sectionCta && isContactFormCta(sectionCta)) {
    const cf = sectionCta.contactForm;
    return {
      kind: "contactForm",
      formId: sectionCta.formId.trim(),
      triggerLabel: sectionCta.label.trim(),
      presentation: presentationFromSanity(sectionCta.presentation ?? undefined),
      messageContext: sectionCta.messageContext ?? undefined,
      title: sectionCta.modalTitle ?? undefined,
      description: sectionCta.modalDescription ?? undefined,
      placeholders: contactFormPlaceholdersFromSanity(cf),
      submitLabel: cf.submitLabel?.trim() || "Send",
      successMessage: sectionCta.successMessage ?? undefined,
    };
  }

  if (sectionCta && isLinkCta(sectionCta)) {
    const h = resolveHref(sectionCta.href, donateUrl) ?? fallback;
    if (!h) return undefined;
    return { kind: "link", label: sectionCta.label.trim(), href: h };
  }

  if (href) {
    return { kind: "link", label: "Learn more", href };
  }

  return undefined;
}

export function heroGallerySlides(block: ContentBlock): { src: string; alt?: string }[] {
  const fromGallery: { src: string; alt?: string }[] = [];
  const { gallery: galleryOpts } = heroSectionImageUrlOptions;
  for (const g of block.galleryImages ?? []) {
    const src = urlForSanityImage(g.image, galleryOpts) ?? g.imageSrc;
    if (src) fromGallery.push({ src, alt: g.imageAlt });
  }
  if (fromGallery.length) return fromGallery;

  const legacySrc = urlForSanityImage(block.image, galleryOpts) ?? block.imageSrc;
  if (legacySrc) {
    return [{ src: legacySrc, alt: block.imageAlt }];
  }
  return [];
}
