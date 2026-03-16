"use client";

import { useState } from "react";

export type TestimonialItem = {
  quote: string;
  attribution?: string;
};

type TestimonialSliderProps = {
  items?: TestimonialItem[];
  className?: string;
};

const BLUE_BG = "#1e4d8b";
const ORANGE = "var(--color-2, #ff7900)";

const DEFAULT_ITEMS: TestimonialItem[] = [
  {
    quote: "Delta Bay Impact has changed my life. The mentors have helped me tremendously.",
    attribution: "- Former Mentee",
  },
];

export function TestimonialSlider({
  items = DEFAULT_ITEMS,
  className = "",
}: TestimonialSliderProps) {
  const [index, setIndex] = useState(0);
  const list = items?.length ? items : DEFAULT_ITEMS;
  const current = list[index];

  const goPrev = () => setIndex((i) => (i <= 0 ? list.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i >= list.length - 1 ? 0 : i + 1));

  if (!current) return null;

  return (
    <div
      className={`relative flex items-center justify-center py-10 md:py-14 ${className}`}
      style={{ backgroundColor: "#374151" }}
    >
      {/* Left arrow */}
      <button
        type="button"
        onClick={goPrev}
        className="absolute left-2 md:left-4 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151] shrink-0"
        style={{ color: ORANGE }}
        aria-label="Previous testimonial"
      >
        <span
          className="block w-0 h-0 border-y-8 border-r-12 border-l-0 border-solid border-y-transparent border-r-current md:border-y-10 md:border-r-14"
          style={{ marginRight: "2px" }}
          aria-hidden
        />
      </button>

      {/* Quote panel */}
      <div
        className="relative w-full max-w-4xl mx-4 md:mx-12 py-8 md:py-12 px-8 md:px-14 rounded-sm"
        style={{ backgroundColor: BLUE_BG }}
      >
        <span
          className="block text-5xl md:text-6xl font-serif leading-none mb-2"
          style={{ color: ORANGE }}
          aria-hidden
        >
          "
        </span>
        <blockquote className="text-lg md:text-xl font-bold text-white leading-snug text-left">
          {current.quote}
        </blockquote>
        {current.attribution ? (
          <p className="mt-4 text-base md:text-lg text-white font-normal text-right">
            {current.attribution}
          </p>
        ) : null}
      </div>

      {/* Right arrow */}
      <button
        type="button"
        onClick={goNext}
        className="absolute right-2 md:right-4 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#374151] shrink-0"
        style={{ color: ORANGE }}
        aria-label="Next testimonial"
      >
        <span
          className="block w-0 h-0 border-y-8 border-l-12 border-r-0 border-solid border-y-transparent border-l-current md:border-y-10 md:border-l-14"
          style={{ marginLeft: "2px" }}
          aria-hidden
        />
      </button>
    </div>
  );
}
