import { Button } from "@/components/Button";
import { ContactBand } from "@/components/ContactBand";
import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";
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
      <PageIntro
        title={data.title}
        lead={data.lead}
        description={data.description}
      />

      <Section className="bg-white">
        <Container>
          <h2 className="heading-2 text-center">{data.programs?.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {data.programs?.items?.map((program: { title: string; description: string }) => (
              <ContentCard
                key={program.title}
                title={program.title}
                description={program.description}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button href={data.programs?.cta?.href}>
              {data.programs?.cta?.label}
            </Button>
          </div>
        </Container>
      </Section>

      <ContactBand />
    </SiteLayout>
  );
}
