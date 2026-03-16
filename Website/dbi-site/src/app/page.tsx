import Image from "next/image";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Link } from "@/components/Link";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Hero } from "@/components/Hero";
import { MeasurableImpact } from "@/components/MeasurableImpact";
import { ProgramCards } from "@/components/ProgramCards";
import { Section } from "@/components/Section";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { TextHighlightSection } from "@/components/TextHighlightSection";
import { SiteLayout } from "@/components/SiteLayout";
import { sanityClient } from "@/sanity/client";
import { homePageQuery } from "@/sanity/queries";

export default async function Home() {
  const data = await sanityClient.fetch(homePageQuery);

  if (!data) {
    return null;
  }

  const programCount = data.serve?.items?.length ?? 0;
  const updateCount = data.latest?.items?.length ?? 0;
  const featuredItem = data.latest?.items?.[0];
  const featuredHref = featuredItem?.href || "/impact";

  // Impact snapshot with CMS fallbacks
  const impactSnapshot = data.impactSnapshot || {
    eyebrow: "Impact snapshot",
    title: "Community-driven work you can verify.",
    description: "Explore our programs, recent updates, and the best ways to support the work.",
    metrics: [
      {
        value: programCount ? `${programCount}+` : "Programs",
        label: "Community programs",
        href: "/programs",
      },
      {
        value: updateCount ? `${updateCount}+` : "Updates",
        label: "Impact stories",
        href: "/impact",
      },
      {
        value: "Get involved",
        label: "Volunteer or partner",
        href: "/get-involved",
      },
    ],
  };

  // Trust section with CMS fallbacks
  const trustSection = data.trustSection || {
    eyebrow: "Trust & transparency",
    links: [
      { label: "About & leadership", href: "/about" },
      { label: "Impact reporting", href: "/impact" },
      { label: "Ask a question", href: "/contact" },
    ],
  };

  return (
    <SiteLayout>
      <Hero
        imageSrc={data.hero?.imageSrc}
        imageAlt={data.hero?.imageAlt || "Delta Bay Impact hero"}
        title={data.hero?.title}
        subtitle={data.hero?.subtitle}
        primaryCta={data.hero?.primaryCta}
        secondaryCta={data.hero?.secondaryCta}
      />

      <TextHighlightSection text={data.intro} />
      <Section className="pt-8 pb-12">
        <Container>
          <MeasurableImpact
            title={impactSnapshot.title}
            metrics={
              impactSnapshot.metrics?.map(
                (m: { value: string; label: string; href: string }) => ({
                  value: m.value,
                  label: m.label,
                  href: m.href,
                }),
              ) ?? []
            }
          />
          <TestimonialSlider
            items={data.testimonials?.map((t: { quote: string; attribution?: string }) => ({
              quote: t.quote,
              attribution: t.attribution,
            }))}
            className="mt-10 md:mt-12"
          />
          <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-2 md:gap-3 text-sm text-slate-700">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 w-full sm:w-auto">
              {trustSection.eyebrow}
            </span>
            {trustSection.links?.map((link: { label: string; href: string }) => (
              <Link
                key={link.href}
                href={link.href}
                className="touch-target inline-flex items-center font-semibold text-slate-700 hover:text-primary transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
      <Section className="pt-12 md:pt-16 lg:pt-20 pb-24 md:pb-32 lg:pb-40">
        <Container>
          <div className="mb-8 md:mb-10">
            <h2 className="heading-2 text-balance">{data.serve?.title}</h2>
            <p className="body-md mt-3 md:mt-4">{data.serve?.description}</p>
            <Button
              href={data.serve?.cta?.href}
              variant="cta-primary"
              className="mt-4 md:mt-5 lg:mt-6 w-full sm:w-auto justify-center text-sm sm:text-base"
            >
              {data.serve?.cta?.label}
            </Button>
          </div>
          <ProgramCards
            items={
              data.serve?.items?.map(
                (item: {
                  title: string;
                  description?: string;
                  imageSrc?: string;
                  imageAlt?: string;
                  href?: string;
                  hoverColor?: string;
                }) => ({
                  title: item.title,
                  imageSrc: item.imageSrc,
                  imageAlt: item.imageAlt,
                  href: item.href ?? data.serve?.cta?.href ?? "/programs",
                  hoverColor: item.hoverColor,
                }),
              ) ?? []
            }
          />
        </Container>
      </Section>

      <Section className="py-20 bg-white">
        <NewsletterSignup
          title="Keep up with our Work!"
          description="Subscribe to our newsletter and receive periodic updates from Delta Bay Impact."
          placeholder="Your email address"
          buttonLabel="Sign-up"
          legalText="This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply."
          className="-mt-24 mb-10 md:-mt-32 lg:-mt-40"
        />

        <Container>
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 md:gap-6">
            <div>
              <h2 className="heading-2 text-balance">{data.latest?.title}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Button
                href="/impact"
                variant="cta-secondary"
                className="touch-target px-5 py-3 text-sm flex-1 sm:flex-initial justify-center"
              >
                View all updates
              </Button>
              <div className="hidden items-center gap-3 lg:flex">
                <button
                  type="button"
                  className="touch-target slant-clip-tight inline-flex h-11 w-11 items-center justify-center border border-border text-sm text-slate-600 transition hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-slate-50 focus:ring-2 focus:ring-primary"
                  aria-label="Previous story"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="touch-target slant-clip-tight inline-flex h-11 w-11 items-center justify-center border border-border text-sm text-slate-600 transition hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-slate-50 focus:ring-2 focus:ring-primary"
                  aria-label="Next story"
                >
                  →
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-8 grid gap-5 md:gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
            <div className="overflow-hidden bg-white">
              <div className="relative h-48 sm:h-56 md:h-64 w-full bg-slate-200">
                {featuredItem?.imageSrc ? (
                  <Image
                    src={featuredItem.imageSrc}
                    alt={featuredItem.imageAlt || featuredItem.title || "Latest update"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 60vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="space-y-1 px-5 py-5 sm:px-6 sm:py-6">
                <p className="text-xs font-semibold uppercase tracking-wide">Featured story</p>
                <p className="text-base md:text-lg font-semibold text-slate-900 leading-snug">
                  {featuredItem?.title}
                </p>
                <p className="text-xs text-slate-500 mb-3 md:mb-4">{featuredItem?.date}</p>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {featuredItem?.description}
                </p>
                <Link href={featuredHref} variant="body" className="touch-target inline-flex items-center pt-2 text-sm">
                  Read the story
                </Link>
              </div>
            </div>
            <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
              {(data.latest?.items ?? [])
                .slice(1, 3)
                .map(
                  (item: { title: string; date?: string; description?: string; href?: string }) => (
                    <div
                      key={item.title}
                      className="border border-border bg-white px-4 py-4 sm:px-5 sm:py-5"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
                        Update
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 leading-snug">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{item.date}</p>
                      <p className="mt-2 md:mt-3 text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                      <Link
                        href={item.href || "/impact"}
                        variant="body"
                        className="touch-target mt-3 md:mt-4 inline-flex items-center text-sm"
                      >
                        Learn more
                      </Link>
                    </div>
                  ),
                )}
            </div>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
}
