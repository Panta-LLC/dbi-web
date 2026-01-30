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
  title = "Sign up for The Optimist Newsletter",
  description = "Subscribe to The Optimist to get weekly updates on the latest in global health, gender equality, education, and more.",
  placeholder = "Email address",
  buttonLabel = "Subscribe",
  legalText = "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.",
  className = "",
}: ContactBandProps) {
  const titleParts = title.split("The Optimist");
  const hasOptimist = titleParts.length > 1;

  return (
    <Section className={className}>
      <Container>
        <div className="slant-clip bg-orange-300 px-20 py-14 lg:py-18">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="text-primary">
              <h2 className="display-s text-primary">
                {hasOptimist ? (
                  <>
                    {titleParts[0]}
                    <span className="font-serif italic">The Optimist</span>
                    {titleParts.slice(1).join("The Optimist")}
                  </>
                ) : (
                  title
                )}
              </h2>
              <p className="body-md mt-4 max-w-xl text-slate-800">{description}</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="email"
                  name="email"
                  placeholder={placeholder}
                  className="w-full flex-1 slant-clip-tight bg-white px-5 py-4 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button variant="primary" className="px-6 py-3 text-sm">
                  {buttonLabel}
                </Button>
              </div>
              <p className="text-xs text-slate-700">{legalText}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
