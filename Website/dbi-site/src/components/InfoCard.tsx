type InfoCardProps = {
  title: string;
  description: string;
  eyebrow?: string;
};

export function InfoCard({ title, description, eyebrow }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      {eyebrow ? (
        <p className="heading-4 text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="heading-3 mt-3">{title}</h3>
      <p className="body-md mt-3 text-slate-600">{description}</p>
    </div>
  );
}
