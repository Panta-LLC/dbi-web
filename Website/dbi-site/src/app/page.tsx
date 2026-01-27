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
      <Section className="bg-white pt-10">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="border border-border bg-muted h-[320px] w-full" />
          <div>
            <h1 className="heading-1">{data.hero?.title}</h1>
            <p className="body-md mt-4 text-slate-600">{data.hero?.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={data.hero?.primaryCta?.href}>
                {data.hero?.primaryCta?.label}
              </Button>
              <Button href={data.hero?.secondaryCta?.href} variant="secondary">
                {data.hero?.secondaryCta?.label}
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <div className="rounded-md border border-border bg-white p-8 text-center">
            <p className="body-md text-slate-700">{data.intro}</p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <h2 className="heading-2">{data.serve?.title}</h2>
              <p className="body-md mt-4 text-slate-600">{data.serve?.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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

      <Section className="bg-white">
        <Container>
          <h2 className="heading-2">{data.latest?.title}</h2>
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
              <p className="mt-1 text-xs text-slate-500">
                {data.latest?.items?.[0]?.date}
              </p>
              <p className="mt-3 text-sm text-slate-600">
                {data.latest?.items?.[0]?.description}
              </p>
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

      <Section className="bg-white">
        <Container>
          <h2 className="heading-2 text-center">{data.partners?.title}</h2>
          <div className="mt-6">
            <LogoGrid items={data.partners?.items ?? []} />
          </div>
        </Container>
      </Section>

      <ContactBand title={data.contact?.title} />
    </SiteLayout>
  );
}
