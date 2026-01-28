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
      className={`bg-white p-10 relative ${className}`}
      style={{
        clipPath: "polygon(100% 0, 100% 20%, 100% 100%, 4% 100%, 0% 80%, 0 0)",
        WebkitClipPath: "polygon(100% 0, 100% 20%, 100% 100%, 4% 100%, 0% 80%, 0 0)",
      }}
    >
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      {description ? <p className="mt-3 text-sm text-slate-600">{description}</p> : null}
      {cta ? (
        <div className="mt-4">
          <Button href={cta.href} variant="primary" className="px-4 py-2 text-xs">
            {cta.label}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
