"use client";

import type { CSSProperties } from "react";

type CarouselProgressBarProps = {
  show: boolean;
  activeIndex: number;
  autoPlayMs: number;
  fillColor: string;
  trackClassName?: string;
};

export function CarouselProgressBar({
  show,
  activeIndex,
  autoPlayMs,
  fillColor,
  trackClassName = "w-full max-w-md mx-auto px-8 mt-2 h-1 rounded-full overflow-hidden bg-white/20",
}: CarouselProgressBarProps) {
  if (!show) return null;

  return (
    <div className={trackClassName} aria-hidden>
      <div
        key={`${activeIndex}-${autoPlayMs}`}
        className="h-full rounded-full slide-carousel-autoplay-progress-fill"
        style={
          {
            backgroundColor: fillColor,
            "--slide-carousel-autoplay-ms": `${autoPlayMs}ms`,
          } as CSSProperties
        }
      />
    </div>
  );
}
