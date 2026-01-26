type SponsorBadgeProps = {
  name: string;
};

export function SponsorBadge({ name }: SponsorBadgeProps) {
  return (
    <div className="flex h-20 items-center justify-center rounded-full border border-border bg-white text-xs font-semibold text-slate-500">
      {name}
    </div>
  );
}
