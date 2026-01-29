import { Button } from "./Button";

type ContentCardProps = {
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  className?: string;
};

export function ContentCard({ title, description, cta, className = "" }: ContentCardProps) {
  return (
    <div
      className={`content-card slant-clip-content-card bg-white p-10 px-13 relative ${className}`}
    >
      <h3 className="heading-3 text-lg font-bold text-slate-900">{title}</h3>
      {description ? <p className="mt-3 text-md">{description}</p> : null}
      {/* {cta ? (
        <div className="mt-6">
          <Button href={cta.href} variant="primary" className="px-4 py-2">
            {cta.label}
          </Button>
        </div>
      ) : null} */}
    </div>
  );
}
