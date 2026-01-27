type ImageCardProps = {
  title: string;
  subtitle?: string;
};

export function ImageCard({ title, subtitle }: ImageCardProps) {
  return (
    <div className="rounded-md border border-border bg-white">
      <div className="flex h-28 items-center justify-center bg-muted text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Image
      </div>
      <div className="p-4 text-center">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {subtitle ? (
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
