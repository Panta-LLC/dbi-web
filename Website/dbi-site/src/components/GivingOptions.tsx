import { Button } from "@/components/Button";

export type GivingOption = {
  /** Short label above the title, e.g. "Year-end campaign". */
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
  /** Network for Good page this option leads to. */
  href: string;
};

type GivingOptionsProps = {
  options: GivingOption[];
  footnote?: string;
  className?: string;
};

const DEFAULT_FOOTNOTE =
  "You'll choose your amount and finish your gift securely on Network for Good. Delta Bay Impact is a 501(c)(3) nonprofit; gifts are tax-deductible as allowed by law.";

export function GivingOptions({
  options,
  footnote = DEFAULT_FOOTNOTE,
  className = "",
}: GivingOptionsProps) {
  return (
    <div className={className}>
      <ul className="grid gap-6">
        {options.map((option) => (
          <li
            key={option.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8"
          >
            {option.eyebrow ? (
              <p className="body-sm font-semibold text-[var(--color-1)]">{option.eyebrow}</p>
            ) : null}
            <h3 className={`heading-2 text-[var(--color-4)] ${option.eyebrow ? "mt-2" : ""}`}>
              {option.title}
            </h3>
            <p className="body-md mt-3 text-slate-700">{option.description}</p>
            <Button href={option.href} variant="cta-primary" className="mt-6 w-full">
              {option.ctaLabel}
            </Button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-600">{footnote}</p>
    </div>
  );
}
