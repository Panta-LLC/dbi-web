import type { ReactElement } from "react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { Hero } from "@/components/Hero";
import { ImageCard } from "@/components/ImageCard";
import { MeasurableImpact } from "@/components/MeasurableImpact";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ProgramCards } from "@/components/ProgramCards";
import { Section } from "@/components/Section";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { TextHighlightSection } from "@/components/TextHighlightSection";

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
  ctaVariant?: "primary" | "secondary";
  buttonVariant?: "primary" | "secondary";
  primaryCta?: Cta;
  secondaryCta?: Cta;
  // programCardsSection
  programCta?: Cta;
  programItems?: Array<{
    title?: string;
    description?: string;
    imageSrc?: string;
    imageAlt?: string;
    href?: string;
    hoverColor?: string;
  }>;
  // measurableImpactSection
  impactMetrics?: Array<{
    value?: string;
    label?: string;
    href?: string;
  }>;
  // testimonialSliderSection
  testimonialItems?: Array<{
    quote?: string;
    attribution?: string;
  }>;
  // cardGridSection
  cardItems?: Array<{
    title?: string;
    description?: string;
  }>;
  // imageCardGridSection
  imageItems?: Array<{
    title?: string;
    subtitle?: string;
  }>;
  // textAndCtaSection
  textCta?: Cta;
  // ctaButtonSection
  ctaButton?: Cta;
};

function renderBlock(block: ContentBlock, index: number): ReactElement | null {
  switch (block._type) {
    case "heroSection":
      return (
        <Hero
          key={index}
          imageSrc={block.imageSrc}
          imageAlt={block.imageAlt || "Hero"}
          title={block.title}
          subtitle={block.subtitle}
          primaryCta={block.primaryCta}
          secondaryCta={block.secondaryCta}
        />
      );

    case "textHighlightSection":
      return <TextHighlightSection key={index} text={block.text} />;

    case "programCardsSection": {
      const items = (block.programItems ?? []).map((item) => ({
        title: item.title ?? "",
        description: item.description,
        imageSrc: item.imageSrc,
        imageAlt: item.imageAlt,
        href: item.href ?? block.programCta?.href ?? "/services",
        hoverColor: item.hoverColor,
      }));

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
                href: m.href,
              })) ?? []
            }
          />
        </Section>
      );

    case "testimonialSliderSection":
      return (
        <Section key={index}>
          <TestimonialSlider
            items={
              block.testimonialItems?.map((t) => ({
                quote: t.quote ?? "",
                attribution: t.attribution,
              })) ?? undefined
            }
          />
        </Section>
      );

    case "newsletterSignupSection":
      return (
        <Section className="bg-white" key={index}>
          <NewsletterSignup
            title={block.title}
            description={block.description}
            placeholder={block.placeholder}
            buttonLabel={block.buttonLabel}
            legalText={block.legalText}
            imageSrc={block.imageSrc}
            imageAlt={block.imageAlt}
          />
        </Section>
      );

    case "cardGridSection":
      return (
        <Section className="bg-white" key={index}>
          <Container>
            <h2 className="heading-2 text-center">{block.title}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(block.cardItems ?? []).map((item, i) => (
                <ContentCard
                  key={`${item.title ?? "card"}-${i}`}
                  title={item.title ?? ""}
                  description={item.description}
                />
              ))}
            </div>
          </Container>
        </Section>
      );

    case "imageCardGridSection":
      return (
        <Section className="bg-white" key={index}>
          <Container>
            <h2 className="heading-2 text-center">{block.title}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(block.imageItems ?? []).map((item, i) => (
                <ImageCard
                  key={`${item.title ?? "image-card"}-${i}`}
                  title={item.title ?? ""}
                  subtitle={item.subtitle}
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
                {block.description ? <p className="body-md mt-4 text-slate-600">{block.description}</p> : null}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-start">
                {block.primaryCta?.href ? (
                  <Button href={block.primaryCta.href}>{block.primaryCta.label}</Button>
                ) : null}
                {block.secondaryCta?.href ? (
                  <Button href={block.secondaryCta.href} variant="cta-secondary">
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
            {block.description ? <p className="body-md text-slate-600">{block.description}</p> : null}
            {block.textCta?.href ? (
              <div className="mt-6 flex justify-center">
                <Button
                  href={block.textCta.href}
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
                href={block.ctaButton.href}
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

export function PageContentRenderer({ content }: { content?: ContentBlock[] }) {
  if (!content?.length) return null;

  return <>{content.map((block, index) => renderBlock(block, index))}</>;
}

