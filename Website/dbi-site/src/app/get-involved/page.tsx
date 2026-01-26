import { CTASection } from "@/components/CTASection";
import { Container } from "@/components/Container";
import { InfoCard } from "@/components/InfoCard";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteLayout } from "@/components/SiteLayout";
import { sanityClient } from "@/sanity/client";
import { getInvolvedPageQuery } from "@/sanity/queries";

export default async function GetInvolvedPage() {
  const data = await sanityClient.fetch(getInvolvedPageQuery);

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
            eyebrow={data.pathwaysHeading?.eyebrow}
            title={data.pathwaysHeading?.title}
            description={data.pathwaysHeading?.description}
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {data.options?.map(
              (option: { title: string; description: string; eyebrow?: string }) => (
                <InfoCard
                  key={option.title}
                  title={option.title}
                  description={option.description}
                  eyebrow={option.eyebrow}
                />
              ),
            )}
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
