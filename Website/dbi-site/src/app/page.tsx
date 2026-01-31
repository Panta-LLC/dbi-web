import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { ContactBand } from "@/components/ContactBand";
import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { LogoGrid } from "@/components/LogoGrid";
import { Section } from "@/components/Section";
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
      <Section noPadding reveal={false}>
        <Container className="grid gap-8 md:gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="max-h-screen h-[500px] sm:h-[600px] md:h-[700px] lg:h-[750px] w-full relative flex items-center justify-center">
            {data.hero?.imageSrc ? (
              <>
                <div
                  className="hero-accent slant-clip w-full min-h-full bg-orange-400"
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 0,
                  }}
                />
                <div
                  className="hero-mask slant-clip w-full h-full"
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                  }}
                >
                  <Image
                    src={data.hero.imageSrc}
                    alt={data.hero.imageAlt || "Delta Bay Impact hero"}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 45vw"
                    className="object-cover"
                    style={{
                      translate: "0 -3%",
                    }}
                  />
                </div>
              </>
            ) : null}
          </div>
          <div className="hero-content px-4 sm:px-0">
            <h1 className="heading-1 text-balance">{data.hero?.title}</h1>
            <p className="body-md mt-3 md:mt-4 text-balance">{data.hero?.subtitle}</p>
            <div className="mt-5 md:mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
              <Button
                href={data.hero?.primaryCta?.href}
                className="touch-target w-full sm:w-auto justify-center"
              >
                {data.hero?.primaryCta?.label}
              </Button>
              <Button
                href={data.hero?.secondaryCta?.href}
                variant="secondary"
                className="touch-target w-full sm:w-auto justify-center"
              >
                {data.hero?.secondaryCta?.label}
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="">
        <Container>
          <div
            className="px-5 py-8 sm:px-8 sm:py-10 md:px-12 lg:px-16 xl:px-20 pb-12 md:pb-16 mt-12 md:mt-16 text-center flex flex-col items-center justify-center bg-white slant-clip"
            // style={{
            //   clipPath:
            //     "polygon(calc(100% - calc(var(--slant-size))) 0, 100% 100%, calc(var(--slant-size) * 0.75) 100%, 0 0)",
            //   WebkitClipPath:
            //     "polygon(calc(100% - calc(var(--slant-size))) 0, 100% 100%, calc(var(--slant-size) * 0.75) 100%, 0 0)",
            // }}
          >
            <h2 className="display-m font-semibold max-w-4xl text-balance">{data.intro}</h2>
          </div>
        </Container>
      </Section>
      <Section className="pt-8 pb-12">
        <Container>
          <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center slant-clip-tight">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                {impactSnapshot.eyebrow}
              </p>
              <h2 className="heading-2 mt-2 md:mt-3 text-balance">{impactSnapshot.title}</h2>
              {impactSnapshot.description ? (
                <p className="body-md mt-3 md:mt-4 text-slate-700">{impactSnapshot.description}</p>
              ) : null}
            </div>
            <div className="grid gap-3 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3">
              {impactSnapshot.metrics?.map(
                (item: { value: string; label: string; href: string }) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="touch-target slant-clip-tight bg-white p-5 md:p-6 transition hover:-translate-x-[2px] hover:-translate-y-[2px] focus:ring-2 focus:ring-primary"
                    aria-label={`${item.value} ${item.label}`}
                  >
                    <p className="text-base md:text-lg font-semibold text-slate-900">
                      {item.value}
                    </p>
                    <p className="mt-2 text-xs md:text-sm text-slate-600 leading-snug">
                      {item.label}
                    </p>
                  </Link>
                ),
              )}
            </div>
          </div>
          <div className="mt-5 md:mt-6 flex flex-wrap items-center gap-2 md:gap-3 text-sm text-slate-700">
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
          <div className="grid lg:grid-cols-[.4fr_1fr] lg:items-start gap-8 md:gap-10 lg:gap-12">
            <div className="pb-4 md:pb-0">
              <h2 className="heading-2 text-balance">{data.serve?.title}</h2>
              <p className="body-md mt-3 md:mt-4">{data.serve?.description}</p>
              <Button
                href={data.serve?.cta?.href}
                variant="primary"
                className="mt-4 md:mt-5 lg:mt-6 w-full sm:w-auto justify-center text-sm sm:text-base"
              >
                {data.serve?.cta?.label}
              </Button>
            </div>
            <div className="grid gap-6 md:gap-y-5 sm:grid-cols-2">
              {data.serve?.items?.map((item: { title: string; description: string }) => (
                <ContentCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  cta={data.serve?.cta}
                />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-20 bg-white">
        <ContactBand
          title="Get Monthly Impact Stories in Your Inbox"
          description="Join our community getting real stories of student success, upcoming events, and ways to support African American youth in Contra Costa County."
          placeholder="Email address"
          buttonLabel="Subscribe"
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
                variant="secondary"
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
                <Link
                  href={featuredHref}
                  className="touch-target inline-flex items-center pt-2 text-sm font-semibold text-primary hover:underline transition"
                >
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
                        className="touch-target mt-3 md:mt-4 inline-flex items-center text-sm font-semibold text-primary hover:underline transition"
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
