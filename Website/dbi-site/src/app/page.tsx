import Image from "next/image";
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

  return (
    <SiteLayout>
      <Section noPadding reveal={false}>
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="max-h-screen h-[750px] w-full relative flex items-center justify-center">
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
                    sizes="(min-width: 1024px) 40vw, 80vw"
                    className="object-cover"
                    style={{
                      translate: "0 -3%",
                    }}
                  />
                </div>
              </>
            ) : null}
          </div>
          <div className="hero-content">
            <h1 className="heading-1">{data.hero?.title}</h1>
            <p className="body-md mt-4">{data.hero?.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={data.hero?.primaryCta?.href}>{data.hero?.primaryCta?.label}</Button>
              <Button href={data.hero?.secondaryCta?.href} variant="secondary">
                {data.hero?.secondaryCta?.label}
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="">
        <Container>
          <div
            className="p-8 py-10 px-20 pb-16 mt-16 text-center flex flex-col items-center justify-center bg-white"
            style={{
              clipPath:
                "polygon(calc(100% - calc(var(--slant-size))) 0, 100% 100%, calc(var(--slant-size) * 0.75) 100%, 0 0)",
              WebkitClipPath:
                "polygon(calc(100% - calc(var(--slant-size))) 0, 100% 100%, calc(var(--slant-size) * 0.75) 100%, 0 0)",
            }}
          >
            <h2 className="display-m font-semibold max-w-4xl">{data.intro}</h2>
          </div>
        </Container>
      </Section>
      <Section className="py-20 pb-40">
        <Container>
          <div className="grid lg:grid-cols-[.4fr_1fr] lg:items-start gap-12">
            <div>
              <h2 className="heading-2">{data.serve?.title}</h2>
              <p className="body-md mt-4">{data.serve?.description}</p>
              <Button href={data.serve?.cta?.href} variant="primary" className="mt-6">
                {data.serve?.cta?.label}
              </Button>
            </div>
            <div className="grid gap-y-5 sm:grid-cols-2">
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
          title="Sign up for the Delta Bay Impact Newsletter"
          description="Subscribe to Delta Bay Impact to get updates on community programs, events, and impact stories."
          placeholder="Email address"
          buttonLabel="Subscribe"
          legalText="This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply."
          className="-mt-40 mb-10"
        />

        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="heading-2 text-primary">{data.latest?.title}</h2>
            </div>
            <div className="hidden items-center gap-3 lg:flex">
              <button
                type="button"
                className="slant-clip-tight inline-flex h-11 w-11 items-center justify-center border border-border text-sm text-slate-600 transition hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-slate-50"
              >
                ←
              </button>
              <button
                type="button"
                className="slant-clip-tight inline-flex h-11 w-11 items-center justify-center border border-border text-sm text-slate-600 transition hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-slate-50"
              >
                →
              </button>
            </div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
            <div className="overflow-hidden bg-white">
              <div className="relative h-56 w-full bg-slate-200 slant-clip-tight">
                {data.latest?.items?.[0]?.imageSrc ? (
                  <Image
                    src={data.latest.items[0].imageSrc}
                    alt={
                      data.latest.items[0].imageAlt || data.latest.items[0].title || "Latest update"
                    }
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="space-y-3 px-6 py-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
                  Featured story
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {data.latest?.items?.[0]?.title}
                </p>
                <p className="text-xs text-slate-500">{data.latest?.items?.[0]?.date}</p>
                <p className="text-sm text-slate-600">{data.latest?.items?.[0]?.description}</p>
              </div>
            </div>
            <div className="grid gap-4">
              {(data.latest?.items ?? [])
                .slice(1, 3)
                .map((item: { title: string; date?: string; description?: string }) => (
                  <div key={item.title} className="border border-border bg-white px-5 py-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
                      Update
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.date}</p>
                    <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* <Section className="text-primary bg-white">
        <Container>
          <h2 className="heading-2 text-center text-primary">{data.partners?.title}</h2>
          <div className="mt-16">
            <LogoGrid items={data.partners?.items ?? []} />
          </div>
        </Container>
      </Section> */}
    </SiteLayout>
  );
}
