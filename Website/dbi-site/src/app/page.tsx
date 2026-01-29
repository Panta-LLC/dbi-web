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
      <Section className=" min-h-screen" noPadding reveal={false}>
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="h-screen min-h-[750px] w-full relative flex items-center justify-center">
            {data.hero?.imageSrc ? (
              <>
                <div
                  className="hero-accent slant-clip w-full min-h-[100%] bg-orange-400"
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
            className="p-8 py-10 pb-16 mt-16 text-center flex flex-col items-center justify-center bg-white"
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

      <Section className="py-20">
        <Container>
          <div className="grid lg:grid-cols-[.4fr_1fr] lg:items-start">
            <div>
              <h2 className="heading-2">{data.serve?.title}</h2>
              <p className="body-md mt-4">{data.serve?.description}</p>
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
        <Container>
          <h2 className="heading-2 text-primary">{data.latest?.title}</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <button
              type="button"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-sm text-slate-500 lg:flex"
            >
              ←
            </button>
            <div className="rounded-md border border-border bg-white p-6">
              <div className="h-32 w-full bg-muted" />
              <p className="mt-4 text-sm font-semibold text-slate-900">
                {data.latest?.items?.[0]?.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">{data.latest?.items?.[0]?.date}</p>
              <p className="mt-3 text-sm text-slate-600">{data.latest?.items?.[0]?.description}</p>
            </div>
            <button
              type="button"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-sm text-slate-500 lg:flex"
            >
              →
            </button>
          </div>
        </Container>
      </Section>

      <Section className="py-20 text-primary bg-orange-200">
        <Container>
          <h2 className="heading-2 text-center text-primary">{data.partners?.title}</h2>
          <div className="mt-6">
            <LogoGrid items={data.partners?.items ?? []} />
          </div>
        </Container>
      </Section>

      <ContactBand title={data.contact?.title} />
    </SiteLayout>
  );
}
