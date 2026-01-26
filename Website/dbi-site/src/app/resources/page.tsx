import { CTASection } from "@/components/CTASection";
import { Container } from "@/components/Container";
import { InfoCard } from "@/components/InfoCard";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteLayout } from "@/components/SiteLayout";
import { sanityClient } from "@/sanity/client";
import { resourcesPageQuery } from "@/sanity/queries";

export default async function ResourcesPage() {
  const data = await sanityClient.fetch(resourcesPageQuery);

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
            eyebrow={data.resourcesHeading?.eyebrow}
            title={data.resourcesHeading?.title}
            description={data.resourcesHeading?.description}
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {data.resources?.map((resource: { title: string; description: string }) => (
              <InfoCard
                key={resource.title}
                title={resource.title}
                description={resource.description}
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
