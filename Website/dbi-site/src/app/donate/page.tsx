import { Button } from "@/components/Button";
import { ContactBand } from "@/components/ContactBand";
import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";
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
      <PageIntro
        title={data.title}
        lead={data.lead}
        description={data.description}
      />

      <Section className="bg-white">
        <Container>
          <h2 className="heading-2 text-center">{data.support?.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.support?.items?.map((item: string) => (
              <ContentCard key={item} title={item} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button href={data.support?.cta?.href}>
              {data.support?.cta?.label}
            </Button>
          </div>
        </Container>
      </Section>

      <ContactBand />
    </SiteLayout>
  );
}
