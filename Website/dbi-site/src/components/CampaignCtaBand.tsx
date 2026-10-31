import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

type CampaignCtaBandProps = {
  title: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
};

export function CampaignCtaBand({ title, body, ctaLabel, ctaHref }: CampaignCtaBandProps) {
  return (
    <Section className="bg-[var(--color-1)]" noPadding>
      <Container maxWidth="narrow" className="py-16 text-center md:py-20">
        <h2 className="heading-1 text-white">{title}</h2>
        {body ? <p className="body-md mt-4 text-white">{body}</p> : null}
        <Button href={ctaHref} variant="cta-knockout" className="mt-8">
          {ctaLabel}
        </Button>
      </Container>
    </Section>
  );
}
