import { Button } from "./Button";
import { Container } from "./Container";

type CTASectionProps = {
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function CTASection({
  title,
  description,
  primaryCta,
  secondaryCta,
}: CTASectionProps) {
  return (
    <div className="bg-primary text-primary-foreground">
      <Container className="py-14 sm:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="heading-2 text-primary-foreground">{title}</h2>
            <p className="body-md mt-3 text-primary-foreground/80">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={primaryCta.href} className="bg-white text-primary">
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              <Button
                href={secondaryCta.href}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
}
