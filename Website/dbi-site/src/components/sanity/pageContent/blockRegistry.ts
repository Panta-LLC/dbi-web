/**
 * `_type` values from Sanity that `renderPageContentBlock` maps to UI.
 * Keep in sync when adding new section types in the Studio schema.
 */
export const PAGE_CONTENT_BLOCK_TYPES = [
  "heroSection",
  "heroSplitSection",
  "textHighlightSection",
  "programCardsSection",
  "measurableImpactSection",
  "testimonialSliderSection",
  "cardGridSection",
  "collectionArticleSection",
  "imageCardGridSection",
  "fullWidthImageSection",
  "supportSection",
  "textAndCtaSection",
  "ctaButtonSection",
  "contactSection",
] as const;

export type PageContentBlockType = (typeof PAGE_CONTENT_BLOCK_TYPES)[number];
