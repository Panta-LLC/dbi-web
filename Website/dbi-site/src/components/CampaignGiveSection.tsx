import { Container } from "@/components/Container";
import { GivingOptions, type GivingOption } from "@/components/GivingOptions";
import { Section } from "@/components/Section";

type CampaignGiveSectionProps = {
  title: string;
  paragraphs: string[];
  options: GivingOption[];
  footnote?: string;
};

export function CampaignGiveSection({
  title,
  paragraphs,
  options,
  footnote,
}: CampaignGiveSectionProps) {
  return (
    <Section id="give" className="scroll-mt-20 bg-white" noPadding>
      <Container className="grid gap-10 py-16 md:py-20 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div>
          <h2 className="heading-1 text-[var(--color-4)]">{title}</h2>
          {paragraphs.map((paragraph, index) => (
            <p key={paragraph} className={`body-md text-slate-700 ${index ? "mt-4" : "mt-6"}`}>
              {paragraph}
            </p>
          ))}
        </div>
        <GivingOptions options={options} footnote={footnote} />
      </Container>
    </Section>
  );
}
