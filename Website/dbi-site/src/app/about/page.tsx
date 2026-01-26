import { CTASection } from "@/components/CTASection";
import { Container } from "@/components/Container";
import { InfoCard } from "@/components/InfoCard";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteLayout } from "@/components/SiteLayout";
import { sanityClient } from "@/sanity/client";
import { aboutPageQuery } from "@/sanity/queries";

export default async function AboutPage() {
  const data = await sanityClient.fetch(aboutPageQuery);

  if (!data) {
    return null;
  }

  return (
    <SiteLayout>
      <PageHeader title={data.pageHeader?.title} subtitle={data.pageHeader?.subtitle} />

      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center text-slate-600">
            {data.storyHeading?.description
              ?.split("\n\n")
              .filter(Boolean)
              .map((paragraph: string, index: number) => (
                <p key={`${paragraph.slice(0, 12)}-${index}`} className="body-md mt-4">
                  {paragraph}
                </p>
              ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-accent">
            {data.missionPillars?.map(
              (pillar: { title: string }, index: number) => (
                <span key={pillar.title} className="heading-4 flex items-center gap-6">
                  <span>{pillar.title}</span>
                  {index < (data.missionPillars?.length ?? 0) - 1 ? (
                    <span className="text-accent/60">|</span>
                  ) : null}
                </span>
              ),
            )}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow={data.valuesHeading?.eyebrow}
            title={data.valuesHeading?.title}
            description={data.valuesHeading?.description}
            align="center"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.values?.map((value: { title: string; description: string }) => (
              <InfoCard
                key={value.title}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title={data.cta?.title}
        description={data.cta?.description}
        primaryCta={data.cta?.primaryCta}
      />
    </SiteLayout>
  );
}
