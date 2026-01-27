type LogoGridProps = {
  items: string[];
};

export function LogoGrid({ items }: LogoGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item}
          className="flex h-20 items-center justify-center rounded-md border border-border bg-white text-xs font-semibold text-slate-500"
        >
          {item}
        </div>
      ))}
    </div>
  );
}
