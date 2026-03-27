"use client";

export type CarouselArrowDirection = "prev" | "next";

type CarouselArrowButtonProps = {
  direction: CarouselArrowDirection;
  onClick: () => void;
  label: string;
  accentColor: string;
  className?: string;
};

/** Single prev/next chevron button (triangle icon). */
export function CarouselArrowButton({
  direction,
  onClick,
  label,
  accentColor,
  className = "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151] shrink-0",
}: CarouselArrowButtonProps) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      style={{ color: accentColor }}
      aria-label={label}
    >
      {isPrev ? (
        <span
          className="block w-0 h-0 border-y-8 border-r-12 border-l-0 border-solid border-y-transparent border-r-current md:border-y-10 md:border-r-14"
          style={{ marginRight: "2px" }}
          aria-hidden
        />
      ) : (
        <span
          className="block w-0 h-0 border-y-8 border-l-12 border-r-0 border-solid border-y-transparent border-l-current md:border-y-10 md:border-l-14"
          style={{ marginLeft: "2px" }}
          aria-hidden
        />
      )}
    </button>
  );
}

type CarouselArrowsProps = {
  show: boolean;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
  accentColor: string;
  prevButtonClassName?: string;
  nextButtonClassName?: string;
};

/** Absolutely positioned left/right pair for full-slide carousels. */
export function CarouselArrows({
  show,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  accentColor,
  prevButtonClassName = "absolute left-2 md:left-4 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151] shrink-0",
  nextButtonClassName = "absolute right-2 md:right-4 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151] shrink-0",
}: CarouselArrowsProps) {
  if (!show) return null;

  return (
    <>
      <CarouselArrowButton
        direction="prev"
        onClick={onPrev}
        label={prevLabel}
        accentColor={accentColor}
        className={prevButtonClassName}
      />
      <CarouselArrowButton
        direction="next"
        onClick={onNext}
        label={nextLabel}
        accentColor={accentColor}
        className={nextButtonClassName}
      />
    </>
  );
}
