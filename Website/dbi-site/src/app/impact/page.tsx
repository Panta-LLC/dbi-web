import { CTASection } from "@/components/CTASection";
import { Container } from "@/components/Container";
import { InfoCard } from "@/components/InfoCard";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteLayout } from "@/components/SiteLayout";
import { sanityClient } from "@/sanity/client";
import { impactPageQuery } from "@/sanity/queries";

export default async function ImpactPage() {
  const data = await sanityClient.fetch(impactPageQuery);

  if (!data) {
    return null;
  }

  return (
    <SiteLayout>
      <PageHeader
        title={data.pageHeader?.title}
        subtitle={data.pageHeader?.subtitle}
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow={data.highlightsHeading?.eyebrow}
            title={data.highlightsHeading?.title}
            description={data.highlightsHeading?.description}
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {data.impactHighlights?.map(
              (impact: { title: string; description: string }) => (
                <InfoCard
                  key={impact.title}
                  title={impact.title}
                  description={impact.description}
                />
              ),
            )}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow={data.outcomesHeading?.eyebrow}
            title={data.outcomesHeading?.title}
            description={data.outcomesHeading?.description}
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {data.outcomes?.map((outcome: { title: string; description: string }) => (
              <InfoCard
                key={outcome.title}
                title={outcome.title}
                description={outcome.description}
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
