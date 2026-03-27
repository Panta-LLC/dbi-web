"use client";

type CarouselDotNavProps = {
  show: boolean;
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  navLabel: string;
  getDotLabel: (i: number, count: number) => string;
  /** Active dot classes */
  activeDotClassName?: string;
  inactiveDotClassName?: string;
  navClassName?: string;
  dotButtonClassName?: string;
};

export function CarouselDotNav({
  show,
  count,
  activeIndex,
  onSelect,
  navLabel,
  getDotLabel,
  activeDotClassName = "bg-white scale-110",
  inactiveDotClassName = "bg-white/40 hover:bg-white/70",
  navClassName = "flex flex-wrap items-center justify-center gap-2 mt-6 px-4",
  dotButtonClassName = "touch-target rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151]",
}: CarouselDotNavProps) {
  if (!show || count <= 1) return null;

  return (
    <nav className={navClassName} aria-label={navLabel}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={`dot-${i}`}
          type="button"
          aria-current={i === activeIndex ? "true" : undefined}
          onClick={() => onSelect(i)}
          className={dotButtonClassName}
          aria-label={getDotLabel(i, count)}
        >
          <span
            className={`block h-2.5 w-2.5 rounded-full transition-colors duration-200 ${
              i === activeIndex ? activeDotClassName : inactiveDotClassName
            }`}
            aria-hidden
          />
        </button>
      ))}
    </nav>
  );
}
