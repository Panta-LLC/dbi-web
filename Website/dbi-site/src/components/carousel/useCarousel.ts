"use client";

import { useCallback, useEffect, useState, type KeyboardEvent } from "react";

export type UseCarouselOptions = {
  /** If set, advances after this many ms (pauses while pointer hovers when used with pointer handlers). */
  autoPlayMs?: number;
};

export type UseCarouselResult = {
  activeIndex: number;
  direction: "next" | "prev";
  multi: boolean;
  paused: boolean;
  setPaused: (v: boolean) => void;
  goNext: () => void;
  goPrev: () => void;
  goToIndex: (next: number) => void;
  onKeyDown: (e: KeyboardEvent) => void;
};

/**
 * Shared carousel index state, wrapping navigation, optional autoplay, and keyboard handling.
 * Does not render UI.
 */
export function useCarousel(count: number, options: UseCarouselOptions = {}): UseCarouselResult {
  const { autoPlayMs } = options;
  const multi = count > 1;

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [paused, setPaused] = useState(false);

  const activeIndex = Math.min(Math.max(0, index), Math.max(0, count - 1));

  const goNext = useCallback(() => {
    if (!multi) return;
    setDirection("next");
    setIndex((i) => {
      const s = Math.min(Math.max(0, i), count - 1);
      return s >= count - 1 ? 0 : s + 1;
    });
  }, [count, multi]);

  const goPrev = useCallback(() => {
    if (!multi) return;
    setDirection("prev");
    setIndex((i) => {
      const s = Math.min(Math.max(0, i), count - 1);
      return s <= 0 ? count - 1 : s - 1;
    });
  }, [count, multi]);

  const goToIndex = useCallback(
    (next: number) => {
      if (!multi || next < 0 || next >= count) return;
      if (next === activeIndex) return;
      setDirection(next > activeIndex ? "next" : "prev");
      setIndex(next);
    },
    [activeIndex, count, multi],
  );

  useEffect(() => {
    if (!autoPlayMs || paused || !multi) return;
    const t = window.setTimeout(goNext, autoPlayMs);
    return () => window.clearTimeout(t);
  }, [activeIndex, autoPlayMs, goNext, multi, paused]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!multi) return;
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "Home":
          e.preventDefault();
          goToIndex(0);
          break;
        case "End":
          e.preventDefault();
          goToIndex(count - 1);
          break;
        default:
          break;
      }
    },
    [count, goNext, goPrev, goToIndex, multi],
  );

  return {
    activeIndex,
    direction,
    multi,
    paused,
    setPaused,
    goNext,
    goPrev,
    goToIndex,
    onKeyDown,
  };
}
