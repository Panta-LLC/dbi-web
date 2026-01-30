import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { Section } from "@/components/Section";
import { sanityClient } from "@/sanity/client";
import { resourcesPageQuery } from "@/sanity/queries";

export default async function ResourcesPage() {
  const data = await sanityClient.fetch(resourcesPageQuery);

  if (!data) {
    return null;
  }

  return (
    <ContentPageLayout title={data.title} lead={data.lead} description={data.description}>
      <Section className="bg-white">
        <Container>
          <h2 className="heading-2 text-center">{data.items?.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items?.items?.map((item: string) => (
              <ContentCard key={item} title={item} />
            ))}
          </div>
        </Container>
      </Section>
    </ContentPageLayout>
  );
}
