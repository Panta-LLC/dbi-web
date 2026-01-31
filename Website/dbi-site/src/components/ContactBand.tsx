import { Button } from "./Button";
import { Container } from "./Container";
import { Section } from "./Section";

type ContactBandProps = {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  legalText?: string;
  className?: string;
};

export function ContactBand({
  title = "Get Impact Updates from Delta Bay Impact",
  description = "Sign up to receive stories and news about our programs, youth achievements, upcoming events, and ways to get involved in your community.",
  placeholder = "Your email address",
  buttonLabel = "Get Updates",
  legalText = "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.",
  className = "",
}: ContactBandProps) {
  const titleParts = title.split("The Optimist");
  const hasOptimist = titleParts.length > 1;

  return (
    <Section className={className}>
      <Container>
        <div className="slant-clip bg-orange-300 px-5 py-10 sm:px-8 md:px-12 lg:px-16 xl:px-20 sm:py-12 lg:py-14">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <h2 className="display-s">{title}</h2>
              <p className="body-md mt-3 md:mt-4 max-w-xl text-slate-800">{description}</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="email"
                  name="email"
                  placeholder={placeholder}
                  className="touch-target w-full flex-1 slant-clip-tight bg-white px-4 py-3 sm:px-5 sm:py-4 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Email address"
                />
                <Button
                  variant="primary"
                  className="touch-target px-6 py-3 text-sm text-white sm:whitespace-nowrap"
                >
                  {buttonLabel}
                </Button>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">{legalText}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
