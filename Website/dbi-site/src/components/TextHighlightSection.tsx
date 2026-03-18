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
  const content =
    children ??
    (text ? (
      <h2 className="display-s font-semibold mx-auto max-w-4xl text-balance">{text}</h2>
    ) : null);

  if (!content) return null;

  return (
    <Section className={className + " bg-light-gray"}>
      <Container className="py-12 sm:py-16 flex flex-col items-center justify-center lg:items-center">
        {content}
      </Container>
    </Section>
  );
}
