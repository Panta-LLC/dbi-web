import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

type CampaignStatProps = {
  /** The headline figure, e.g. "2 in 3". */
  stat: string;
  statement: string;
  body?: string;
  source?: string;
  /** When set, the source links out in a new tab. */
  sourceHref?: string;
  className?: string;
};

export function CampaignStat({
  stat,
  statement,
  body,
  source,
  sourceHref,
  className = "",
}: CampaignStatProps) {
  return (
    <Section className={`bg-[var(--color-8)] ${className}`} noPadding>
      <Container maxWidth="narrow" className="py-16 text-center md:py-20">
        <p className="display-xl font-bold text-[var(--color-2)]">{stat}</p>
        <h2 className="heading-1 mt-4 text-[var(--color-4)]">{statement}</h2>
        {body ? <p className="body-md mt-6 text-slate-700">{body}</p> : null}
        {source ? (
          <p className="mt-6 text-sm text-slate-600">
            Source:{" "}
            {sourceHref ? (
              <a
                href={sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-slate-900"
              >
                {source}
              </a>
            ) : (
              source
            )}
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
