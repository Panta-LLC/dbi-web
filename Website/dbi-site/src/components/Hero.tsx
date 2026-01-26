import { AngledButton } from "./AngledButton";
import { Container } from "./Container";
import { SlantedImageReveal } from "./SlantedImageReveal";

type HeroProps = {
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  imageSrc?: string;
  imageAlt?: string;
};

export function Hero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt = "",
}: HeroProps) {
  return (
    <div className="bg-white">
      <Container className="py-12 pb-35">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          {imageSrc ? (
            <SlantedImageReveal
              src={imageSrc}
              alt={imageAlt}
              className="h-[280px] w-full sm:h-[340px] lg:h-[520px]"
              direction="right"
              trigger="load"
              variant="mask"
            />
          ) : (
            <div className="slant-frame slant-frame--mask slant-frame--right h-[280px] w-full bg-slate-200 sm:h-[340px] lg:h-[520px]">
              <div className="slant-frame__inner slant-frame__inner--mask flex items-center justify-center text-sm font-semibold text-slate-500">
                Hero image placeholder
              </div>
            </div>
          )}
          <div className="lg:pt-6">
            <h1 className="heading-1 text-slate-900">{title}</h1>
            <p className="body-lg mt-4 text-slate-600">{subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <AngledButton href={primaryCta.href}>{primaryCta.label}</AngledButton>
              <AngledButton href={secondaryCta.href} className="bg-slate-200 text-slate-800">
                {secondaryCta.label}
              </AngledButton>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
