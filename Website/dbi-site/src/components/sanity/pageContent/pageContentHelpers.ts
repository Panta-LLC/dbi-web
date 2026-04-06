import type { ProgramCardItem } from "@/components/ProgramCards";
import type { HeroSplitPalette } from "@/components/HeroSplitStatic";
import type { GridCardCtaResolved } from "@/lib/grid-card-cta";
import { urlForSanityImage } from "@/lib/sanity-image";
import {
  contactFormPlaceholdersFromSanity,
  isLinkCta,
  presentationFromSanity,
  resolveSanityContactFormCta,
  type ResolvedSanityContactFormCta,
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

function gridCardContactFromResolved(resolved: ResolvedSanityContactFormCta): Extract<
  GridCardCtaResolved,
  { kind: "contactForm" }
> {
  const base = {
    kind: "contactForm" as const,
    formId: resolved.formId,
    triggerLabel: resolved.triggerLabel,
    presentation: presentationFromSanity(resolved.presentation ?? undefined),
    messageContext: resolved.messageContext,
    title: resolved.modalTitle,
    description: resolved.modalDescription,
    successMessage: resolved.successMessage,
  };
  if (resolved.mode === "dynamic") {
    return {
      ...base,
      formLayout: "dynamic",
      contactFormDefinitionId: resolved.contactFormDefinitionId,
      dynamicFields: resolved.dynamicFieldDefinitions,
      submitLabel: resolved.submitLabel,
    };
  }
  return {
    ...base,
    formLayout: "legacy",
    placeholders: contactFormPlaceholdersFromSanity(resolved.contactForm),
    submitLabel: resolved.submitLabel,
  };
}

export function mapProgramCardItem(
  item: NonNullable<ContentBlock["programItems"]>[number],
  block: ContentBlock,
  donateUrl: string | null | undefined,
): ProgramCardItem {
  const sectionHref = sectionCtaLinkFallback(block.programCta, donateUrl);
  const fallback = resolveHref(item.href ?? undefined, donateUrl) ?? sectionHref ?? "/services";

  const cardCta = item.cardCta;

  const cardResolved = resolveSanityContactFormCta(cardCta);
  if (cardResolved) {
    const gc = gridCardContactFromResolved(cardResolved);
    return {
      title: item.title ?? "",
      imageSrc: urlForSanityImage(item.image) ?? item.imageSrc,
      imageAlt: item.imageAlt,
      hoverColor: item.hoverColor,
      href: fallback,
      contactModal:
        gc.formLayout === "dynamic"
          ? {
              formId: gc.formId,
              triggerLabel: gc.triggerLabel,
              presentation: gc.presentation,
              messageContext: gc.messageContext,
              title: gc.title,
              description: gc.description,
              successMessage: gc.successMessage,
              formLayout: "dynamic",
              contactFormDefinitionId: gc.contactFormDefinitionId,
              dynamicFields: gc.dynamicFields,
              submitLabel: gc.submitLabel,
            }
          : {
              formId: gc.formId,
              triggerLabel: gc.triggerLabel,
              presentation: gc.presentation,
              messageContext: gc.messageContext,
              title: gc.title,
              description: gc.description,
              successMessage: gc.successMessage,
              formLayout: "legacy",
              placeholders: gc.placeholders,
              submitLabel: gc.submitLabel,
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

  const cardResolved = resolveSanityContactFormCta(cardCta);
  if (cardResolved) {
    return gridCardContactFromResolved(cardResolved);
  }

  let href = fallback;
  if (cardCta && isLinkCta(cardCta)) {
    href = resolveHref(cardCta.href, donateUrl) ?? fallback;
  }

  if (cardCta && isLinkCta(cardCta)) {
    if (!href) return undefined;
    return { kind: "link", label: cardCta.label.trim(), href };
  }

  const sectionResolved = resolveSanityContactFormCta(sectionCta);
  if (sectionResolved) {
    return gridCardContactFromResolved(sectionResolved);
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
