import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { ImageCard } from "@/components/ImageCard";
import { Section } from "@/components/Section";
import { sanityClient } from "@/sanity/client";
import { impactPageQuery } from "@/sanity/queries";

export default async function ImpactPage() {
  const data = await sanityClient.fetch(impactPageQuery);

  if (!data) {
    return null;
  }

  return (
    <ContentPageLayout title={data.title} lead={data.lead}>
      <Section className="bg-white">
        <Container>
          <h2 className="heading-2 text-center">{data.outcomes?.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {data.outcomes?.items?.map((outcome: string) => (
              <ContentCard key={outcome} title={outcome} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <h2 className="heading-2 text-center">{data.locations?.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.locations?.items?.map((location: { name: string; location: string }) => (
              <ImageCard
                key={location.name}
                title={location.name}
                subtitle={location.location}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container className="text-center">
          <p className="body-md text-slate-600">{data.learning?.description}</p>
          <div className="mt-6 flex justify-center">
            <Button href={data.learning?.cta?.href} variant="secondary">
              {data.learning?.cta?.label}
            </Button>
          </div>
        </Container>
      </Section>
    </ContentPageLayout>
  );
}
