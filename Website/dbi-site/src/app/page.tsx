import { ActionCard } from "@/components/ActionCard";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { ImpactStatCard } from "@/components/ImpactStatCard";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteLayout } from "@/components/SiteLayout";
import { SlantedImageReveal } from "@/components/SlantedImageReveal";
import { SponsorBadge } from "@/components/SponsorBadge";
import { Button } from "@/components/Button";
import {
  heroContent,
  homeContact,
  homeImpactHeading,
  homeIntro,
  homeSponsorsHeading,
  homeWhatWeDo,
  impactCards,
  sponsors,
  whatWeDoItems,
} from "@/data/siteContent";

const heroImage =
  "https://cdn.sanity.io/images/39057kga/production/ea4366aa341b8c2ffcd0e2efe7fe99cbd7820fa5-6742x2446.png";

export default function Home() {
  return (
    <SiteLayout>
      <Hero
        title={heroContent.title}
        subtitle={heroContent.subtitle}
        primaryCta={heroContent.primaryCta}
        secondaryCta={heroContent.secondaryCta}
        imageSrc={heroImage}
        imageAlt="DBI student program"
      />

      <Section className="bg-white">
        <div className="py-20">
          <Container>
            <h2 className="display-m text-center">{homeIntro}</h2>
          </Container>
        </div>
      </Section>

      <Section className="bg-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start pt-40">
            <div>
              <SectionHeading title={homeWhatWeDo.title} />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {whatWeDoItems.map((item) => (
                  <ActionCard
                    key={item.title}
                    title={item.title}
                    description={item.description}
                    ctaLabel={homeWhatWeDo.ctaLabel}
                    ctaHref={homeWhatWeDo.ctaHref}
                  />
                ))}
              </div>
            </div>
            <div className="flex h-full flex-col justify-between gap-6">
              <SlantedImageReveal
                src={heroImage}
                alt="DBI mentorship program"
                className="h-[300px] w-full lg:h-[500px]"
                direction="right"
                trigger="scroll"
                tall={false}
                long={true}
                variant="mask"
              />
              <p className="heading-3">{homeWhatWeDo.description}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading
            title={homeImpactHeading.title}
            description={homeImpactHeading.description}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {impactCards.map((impact) => (
              <ImpactStatCard key={impact.value} value={impact.value} label={impact.label} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading
            title={homeSponsorsHeading.title}
            description={homeSponsorsHeading.description}
          />
          <div className="mt-6 grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {sponsors.map((sponsor) => (
              <SponsorBadge key={sponsor} name={sponsor} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading title={homeContact.title} description={homeContact.description} />
          <div className="mt-6">
            <Button href={homeContact.cta.href}>{homeContact.cta.label}</Button>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
}
