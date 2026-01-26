import { AngledButton } from "./AngledButton";

type ActionCardProps = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export function ActionCard({ title, description, ctaLabel, ctaHref }: ActionCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <p className="heading-5 text-slate-900">{title}</p>
      <p className="body-md mt-2 text-slate-600">{description}</p>
      <AngledButton
        href={ctaHref}
        className="mt-4 px-4 py-2 text-[10px] text-white shadow-none"
      >
        {ctaLabel}
      </AngledButton>
    </div>
  );
}
