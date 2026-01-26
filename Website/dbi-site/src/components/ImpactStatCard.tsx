type ImpactStatCardProps = {
  value: string;
  label: string;
};

export function ImpactStatCard({ value, label }: ImpactStatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <p className="heading-2 text-slate-900">{value}</p>
      <p className="body-md mt-3 text-slate-600">{label}</p>
    </div>
  );
}
