import type { ReactElement } from "react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { HeroSplitStatic } from "@/components/HeroSplitStatic";
import { ImageCard } from "@/components/ImageCard";
import { MeasurableImpact } from "@/components/MeasurableImpact";
import { ProgramCards } from "@/components/ProgramCards";
import { CollectionArticleSection } from "@/components/CollectionArticleSection";
import { ServiceCardTabSection } from "@/components/ServiceCardTabSection";
import { Section } from "@/components/Section";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { TextHighlightSection } from "@/components/TextHighlightSection";
import { urlForSanityImage } from "@/lib/sanity-image";
import type { ContentBlock } from "./pageContentTypes";
import {
  heroGallerySlides,
  heroSplitPalette,
  mapGridCardCta,
  mapProgramCardItem,
  resolveHref,
} from "./pageContentHelpers";

export function renderPageContentBlock(
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

    case "heroSplitSection": {
      const imageSrc = urlForSanityImage(block.image) ?? block.imageSrc;
      if (!block.title?.trim()) return null;
      const ctas =
        block.ctas
          ?.map((c) => (c.href ? { ...c, href: resolveHref(c.href, donateUrl) ?? c.href } : c))
          .filter((c) => c.label?.trim()) ?? [];
      return (
        <HeroSplitStatic
          key={index}
          {...(imageSrc ? { imageSrc, imageAlt: block.imageAlt } : {})}
          title={block.title}
          description={block.description}
          backgroundPalette={heroSplitPalette(block.backgroundColor)}
          imagePosition={block.imagePosition === "right" ? "right" : "left"}
          ctas={ctas}
        />
      );
    }

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
              columnsPerRow={block.columnsPerRow}
              items={serviceTabItems}
            />
          </Container>
        </Section>
      );
    }

    case "collectionArticleSection": {
      const collectionItems = (block.collectionArticleItems ?? []).map((item) => ({
        heading: item.heading ?? "",
        summary: item.summary,
        subtitle: item.subtitle,
        description: item.description,
        imageSrc: urlForSanityImage(item.image) ?? item.imageSrc,
        imageAlt: item.imageAlt,
        cta: mapGridCardCta(item, block.cta, donateUrl),
      }));
      return (
        <Section className="bg-white mt-10" key={index}>
          <CollectionArticleSection
            title={block.title}
            description={block.description}
            columnsPerRow={block.columnsPerRow}
            expandedMode={block.expandedMode !== false}
            sectionLayout={block.sectionLayout === "explorer" ? "explorer" : "cardGrid"}
            defaultView={block.defaultView === "explorer" ? "explorer" : "grid"}
            cardSize={block.cardSize === "sm" || block.cardSize === "lg" ? block.cardSize : "md"}
            items={collectionItems}
          />
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
