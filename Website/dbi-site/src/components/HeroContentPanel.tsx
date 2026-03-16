import { Button } from "@/components/Button";

type HeroCta = {
  href?: string;
  label?: string;
};

type HeroContentPanelProps = {
  title?: string;
  subtitle?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  className?: string;
};

export function HeroContentPanel({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className = "",
}: HeroContentPanelProps) {
  return (
    <div
      className={`relative flex items-center justify-center px-8 py-16 md:px-12 md:py-20 lg:py-24 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-white" />
      <div
        className="absolute inset-0 bg-[#1e4d8b]"
        style={{
          clipPath: "polygon(0 0, 75% 0, 90% 100%, 0 100%)",
          WebkitClipPath: "polygon(0 0, 75% 0, 90% 100%, 0 100%)",
        }}
      />

      <div className="relative z-10 text-white pl-4 md:pl-8 max-w-xl">
        {title ? (
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.2] whitespace-pre-line">
            {title}
          </h1>
        ) : null}
        {subtitle ? (
          <p className="mt-4 md:mt-5 text-base md:text-lg lg:text-xl text-slate-100">
            {subtitle}
          </p>
        ) : null}
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
          {primaryCta?.label ? (
            <Button
              href={primaryCta.href}
              variant="cta-primary"
              className="touch-target w-full sm:w-auto justify-center"
            >
              {primaryCta.label}
            </Button>
          ) : null}
          {secondaryCta?.label ? (
            <Button
              href={secondaryCta.href}
              variant="cta-secondary"
              className="touch-target w-full sm:w-auto justify-center text-white"
            >
              {secondaryCta.label}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

