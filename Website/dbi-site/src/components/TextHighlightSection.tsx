import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

type TextHighlightSectionProps = {
  children?: ReactNode;
  text?: string;
  className?: string;
};

export function TextHighlightSection({
  children,
  text,
  className = "",
}: TextHighlightSectionProps) {
  const content = children ?? (text ? <h2 className="display-m font-semibold max-w-3xl text-balance">{text}</h2> : null);

  if (!content) return null;

  return (
    <Section className={className}>
      <Container className="py-12 sm:py-16 flex flex-col items-center justify-center lg:items-center">
        {content}
      </Container>
    </Section>
  );
}
