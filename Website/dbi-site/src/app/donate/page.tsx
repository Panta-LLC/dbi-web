import { CTASection } from "@/components/CTASection";
import { Container } from "@/components/Container";
import { InfoCard } from "@/components/InfoCard";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteLayout } from "@/components/SiteLayout";
import { sanityClient } from "@/sanity/client";
import { donatePageQuery } from "@/sanity/queries";

export default async function DonatePage() {
  const data = await sanityClient.fetch(donatePageQuery);

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
            eyebrow={data.supportHeading?.eyebrow}
            title={data.supportHeading?.title}
            description={data.supportHeading?.description}
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {data.supportOptions?.map(
              (option: { title: string; description: string }) => (
                <InfoCard
                  key={option.title}
                  title={option.title}
                  description={option.description}
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
