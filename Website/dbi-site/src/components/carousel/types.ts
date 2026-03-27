/** Matches Sanity `carouselSettings.transition` list values. */
export type CarouselTransition = "fade" | "slide" | "scale" | "blur";

export type CarouselSettings = {
  transition?: CarouselTransition;
  transitionDurationMs?: number;
  autoPlayMs?: number;
  showPagination?: boolean;
  showProgress?: boolean;
};

const DEFAULT_DURATION = 680;

export function resolveCarouselSettings(
  raw?: CarouselSettings | null,
): Required<Pick<CarouselSettings, "transition" | "transitionDurationMs">> &
  Pick<CarouselSettings, "autoPlayMs" | "showPagination" | "showProgress"> {
  return {
    transition: raw?.transition ?? "fade",
    transitionDurationMs: raw?.transitionDurationMs ?? DEFAULT_DURATION,
    autoPlayMs: raw?.autoPlayMs,
    showPagination: raw?.showPagination,
    showProgress: raw?.showProgress,
  };
}

export function animClass(
  transition: CarouselTransition,
  direction: "next" | "prev",
): string {
  switch (transition) {
    case "slide":
      return direction === "next" ? "slide-carousel-anim-slide-next" : "slide-carousel-anim-slide-prev";
    case "scale":
      return "slide-carousel-anim-scale";
    case "blur":
      return "slide-carousel-anim-blur";
    default:
      return "slide-carousel-anim-fade";
  }
}
