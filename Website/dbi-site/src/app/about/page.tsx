import { Button } from "@/components/Button";
import { ContactBand } from "@/components/ContactBand";
import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { ImageCard } from "@/components/ImageCard";
import { LogoGrid } from "@/components/LogoGrid";
import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";
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
      <PageIntro
        title={data.title}
        lead={data.lead}
        description={data.description}
      />

      <Section className="bg-white">
        <Container>
          <h2 className="heading-2 text-center">{data.values?.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.values?.items?.map((value: { title: string; description: string }) => (
              <ContentCard
                key={value.title}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="heading-2">{data.story?.title}</h2>
            <p className="body-md mt-4 text-slate-600">{data.story?.description}</p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <h2 className="heading-2 text-center">{data.leadership?.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.leadership?.members?.map(
              (member: { name: string; role: string }, index: number) => (
                <ImageCard
                  key={`${member.name}-${index}`}
                  title={member.name}
                  subtitle={member.role}
                />
              ),
            )}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <h2 className="heading-2 text-center">{data.partners?.title}</h2>
          <div className="mt-6">
            <LogoGrid items={data.partners?.items ?? []} />
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="heading-2">{data.support?.title}</h2>
            <p className="body-md mt-4 text-slate-600">{data.support?.description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start">
            <Button href={data.support?.primaryCta?.href}>
              {data.support?.primaryCta?.label}
            </Button>
            <Button href={data.support?.secondaryCta?.href} variant="secondary">
              {data.support?.secondaryCta?.label}
            </Button>
          </div>
        </Container>
      </Section>

      <ContactBand />
    </SiteLayout>
  );
}
