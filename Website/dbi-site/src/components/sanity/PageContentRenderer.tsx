import type { ReactElement } from "react";
import type { CarouselSettings } from "@/components/carousel";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { ImageCard } from "@/components/ImageCard";
import { MeasurableImpact } from "@/components/MeasurableImpact";
import type { ProgramCardItem } from "@/components/ProgramCards";
import { ProgramCards } from "@/components/ProgramCards";
import { ServiceCardTabSection } from "@/components/ServiceCardTabSection";
import { Section } from "@/components/Section";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { TextHighlightSection } from "@/components/TextHighlightSection";
import type { GridCardCtaResolved } from "@/lib/grid-card-cta";
import { urlForSanityImage } from "@/lib/sanity-image";
import type { SanityImageSource } from "@sanity/image-url";
import {
  contactFormPlaceholdersFromSanity,
  isContactFormCta,
  isLinkCta,
  presentationFromSanity,
  type SanityCtaAction,
} from "@/lib/sanity-cta-action";

type Cta = {
  label?: string;
  href?: string;
};

type ContentBlock = {
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
  // programCardsSection
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
  // measurableImpactSection
  impactMetrics?: Array<{
    value?: string;
    label?: string;
    href?: string;
  }>;
  // heroSection (left strip + gallery)
  leftImage?: SanityImageSource;
  leftImageSrc?: string;
  leftImageAlt?: string;
  galleryImages?: Array<{
    image?: SanityImageSource;
    imageSrc?: string;
    imageAlt?: string;
  }>;
  // testimonialSliderSection
  testimonialItems?: Array<{
    quote?: string;
    attribution?: string;
  }>;
  // textHighlightSection (multi-slide)
  highlightItems?: Array<{
    text?: string;
  }>;
  carouselSettings?: CarouselSettings | null;
  // cardGridSection
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
  // imageCardGridSection
  imageItems?: Array<{
    title?: string;
    subtitle?: string;
    image?: SanityImageSource;
    imageSrc?: string;
    imageAlt?: string;
    cardCta?: SanityCtaAction;
  }>;
  // textAndCtaSection
  textCta?: Cta;
  // ctaButtonSection
  ctaButton?: Cta;
};

function resolveHref(
  href: string | undefined,
  donateUrl: string | null | undefined,
): string | undefined {
  if (!href) return undefined;
  if (href === "/donate" && donateUrl) return donateUrl;
  return href;
}

function sectionCtaLinkFallback(
  cta: SanityCtaAction | Cta | undefined,
  donateUrl: string | null | undefined,
): string | undefined {
  if (!cta) return undefined;
  if ("kind" in cta && cta.kind === "contactForm") return undefined;
  const href = typeof cta.href === "string" ? cta.href.trim() : "";
  if (!href) return undefined;
  return resolveHref(href, donateUrl);
}

function mapProgramCardItem(
  item: NonNullable<ContentBlock["programItems"]>[number],
  block: ContentBlock,
  donateUrl: string | null | undefined,
): ProgramCardItem {
  const sectionHref = sectionCtaLinkFallback(block.programCta, donateUrl);
  const fallback =
    resolveHref(item.href ?? undefined, donateUrl) ?? sectionHref ?? "/services";

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

function mapGridCardCta(
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

function heroGallerySlides(block: ContentBlock): { src: string; alt?: string }[] {
  const fromGallery: { src: string; alt?: string }[] = [];
  for (const g of block.galleryImages ?? []) {
    const src = urlForSanityImage(g.image) ?? g.imageSrc;
    if (src) fromGallery.push({ src, alt: g.imageAlt });
  }
  if (fromGallery.length) return fromGallery;

  const legacySrc = urlForSanityImage(block.image) ?? block.imageSrc;
  if (legacySrc) {
    return [{ src: legacySrc, alt: block.imageAlt }];
  }
  return [];
}

function renderBlock(
  block: ContentBlock,
  index: number,
  donateUrl: string | null | undefined,
): ReactElement | null {
  switch (block._type) {
    case "heroSection":
      return (
        <Hero
          key={index}
          leftImageSrc={urlForSanityImage(block.leftImage) ?? block.leftImageSrc}
          leftImageAlt={block.leftImageAlt}
          galleryImages={heroGallerySlides(block)}
          carousel={block.carouselSettings}
          title={block.title}
          subtitle={block.subtitle}
          primaryCta={
            block.primaryCta?.href
              ? { ...block.primaryCta, href: resolveHref(block.primaryCta.href, donateUrl)! }
              : block.primaryCta
          }
          secondaryCta={
            block.secondaryCta?.href
              ? { ...block.secondaryCta, href: resolveHref(block.secondaryCta.href, donateUrl)! }
              : block.secondaryCta
          }
        />
      );

    case "textHighlightSection": {
      const highlightItems =
        block.highlightItems
          ?.map((h) => ({ text: h.text ?? "" }))
          .filter((h) => h.text.trim().length > 0) ?? [];
      return (
        <TextHighlightSection
          key={index}
          text={block.text}
          items={highlightItems.length ? highlightItems : undefined}
          carousel={block.carouselSettings}
        />
      );
    }

    case "programCardsSection": {
      const items = (block.programItems ?? []).map((item) =>
        mapProgramCardItem(item, block, donateUrl),
      );

      return (
        <Section className="bg-light-gray" key={index}>
          <Container className="bg-light-gray">
            <ProgramCards items={items} />
          </Container>
        </Section>
      );
    }

    case "measurableImpactSection":
      return (
        <Section className="bg-white" key={index}>
          <MeasurableImpact
            title={block.title}
            metrics={
              block.impactMetrics?.map((m) => ({
                value: m.value ?? "",
                label: m.label ?? "",
                href: resolveHref(m.href, donateUrl),
              })) ?? []
            }
          />
        </Section>
      );

    case "testimonialSliderSection":
      return (
        <Section key={index}>
          <TestimonialSlider
            carousel={block.carouselSettings}
            items={
              block.testimonialItems?.map((t) => ({
                quote: t.quote ?? "",
                attribution: t.attribution,
              })) ?? undefined
            }
          />
        </Section>
      );

    case "cardGridSection": {
      const serviceTabItems = (block.cardItems ?? []).map((item) => ({
        title: item.title ?? "",
        description: item.description,
        detail: item.detail,
        imageSrc: urlForSanityImage(item.image) ?? item.imageSrc,
        imageAlt: item.imageAlt,
        hoverColor: item.hoverColor,
        cta: mapGridCardCta(item, block.cta, donateUrl),
      }));
      return (
        <Section className="bg-white my-10" key={index}>
          <Container>
            <ServiceCardTabSection
              title={block.title}
              description={block.description}
              items={serviceTabItems}
            />
          </Container>
        </Section>
      );
    }

    case "imageCardGridSection":
      return (
        <Section className="bg-light-gray py-10" key={index}>
          <Container>
            <h2 className="heading-2 text-center">{block.title}</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {(block.imageItems ?? []).map((item, i) => (
                <ImageCard
                  key={`${item.title ?? "image-card"}-${i}`}
                  title={item.title ?? ""}
                  subtitle={item.subtitle}
                  imageSrc={urlForSanityImage(item.image) ?? item.imageSrc}
                  imageAlt={item.imageAlt}
                  cta={mapGridCardCta(item, block.cta, donateUrl)}
                />
              ))}
            </div>
          </Container>
        </Section>
      );

    case "supportSection":
      return (
        <Section className="bg-white" key={index}>
          <Container>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
              <div className="flex-1">
                <h2 className="heading-2">{block.title}</h2>
                {block.description ? (
                  <p className="body-md mt-4 text-slate-600">{block.description}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-start">
                {block.primaryCta?.href ? (
                  <Button href={resolveHref(block.primaryCta.href, donateUrl)}>
                    {block.primaryCta.label}
                  </Button>
                ) : null}
                {block.secondaryCta?.href ? (
                  <Button
                    href={resolveHref(block.secondaryCta.href, donateUrl)}
                    variant="cta-secondary"
                  >
                    {block.secondaryCta.label}
                  </Button>
                ) : null}
              </div>
            </div>
          </Container>
        </Section>
      );

    case "textAndCtaSection":
      return (
        <Section className="bg-white" key={index}>
          <Container className="text-center">
            {block.description ? (
              <p className="body-md text-slate-600">{block.description}</p>
            ) : null}
            {block.textCta?.href ? (
              <div className="mt-6 flex justify-center">
                <Button
                  href={resolveHref(block.textCta.href, donateUrl)}
                  variant={block.ctaVariant === "primary" ? "cta-primary" : "cta-secondary"}
                >
                  {block.textCta.label}
                </Button>
              </div>
            ) : null}
          </Container>
        </Section>
      );

    case "ctaButtonSection":
      return (
        <Section className="bg-white" noPadding key={index}>
          <Container className="py-10 flex justify-center">
            {block.ctaButton?.href ? (
              <Button
                href={resolveHref(block.ctaButton.href, donateUrl)}
                variant={block.buttonVariant === "secondary" ? "cta-secondary" : "cta-primary"}
              >
                {block.ctaButton.label}
              </Button>
            ) : null}
          </Container>
        </Section>
      );

    default:
      return null;
  }
}

type PageContentRendererProps = {
  content?: ContentBlock[];
  donateUrl?: string | null;
};

export function PageContentRenderer({ content, donateUrl }: PageContentRendererProps) {
  if (!content?.length) return null;

  return <>{content.map((block, index) => renderBlock(block, index, donateUrl))}</>;
}
