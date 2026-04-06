import { defineField, defineType } from "sanity";
import { simplePortableTextField } from "./portableTextSimple";

/**
 * Named object type so Sanity does not merge this with other anonymous `items[]` shapes
 * (e.g. card grid). Required for portable text (`description`) to validate as an array.
 */
export const collectionArticleItem = defineType({
  name: "collectionArticleItem",
  title: "Collection Article Item",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4,
      description: "Shown on cards in the grid and in the detail sidebar.",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle (article panel)",
      type: "string",
      description:
        "Optional. Shown under the title in the full article panel. If empty, the summary is shown there instead.",
    }),
    simplePortableTextField({
      name: "description",
      title: "Description",
      description: "Full body shown in the article panel when an item is opened.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
    defineField({
      name: "articleCtas",
      title: "CTAs (multiple)",
      type: "array",
      of: [{ type: "collectionArticleItemCta" }],
      description:
        "Optional. Add several actions with primary, secondary, or tertiary styling. When any row has a complete action, these replace the single Card CTA on the card footer and in the article panel. Order is preserved.",
    }),
    defineField({
      name: "cardCta",
      title: "Card CTA (legacy)",
      type: "ctaActionOptional",
      description:
        "Used when **CTAs (multiple)** is empty. Link or contact form. When empty, the legacy URL below and section CTA are used.",
    }),
    defineField({
      name: "href",
      title: "Card link URL (legacy)",
      type: "string",
      description: "Optional fallback when Card CTA is not set.",
    }),
  ],
});
