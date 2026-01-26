import { CTASection } from "@/components/CTASection";
import { Container } from "@/components/Container";
import { InfoCard } from "@/components/InfoCard";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteLayout } from "@/components/SiteLayout";
import { sanityClient } from "@/sanity/client";
import { programsPageQuery } from "@/sanity/queries";

export default async function ProgramsPage() {
  const data = await sanityClient.fetch(programsPageQuery);

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
            eyebrow={data.programsHeading?.eyebrow}
            title={data.programsHeading?.title}
            description={data.programsHeading?.description}
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {data.programs?.map(
              (program: { title: string; description: string; eyebrow?: string }) => (
                <InfoCard
                  key={program.title}
                  title={program.title}
                  description={program.description}
                  eyebrow={program.eyebrow}
                />
              ),
            )}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow={data.accessHeading?.eyebrow}
            title={data.accessHeading?.title}
            description={data.accessHeading?.description}
            align="center"
          />
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
