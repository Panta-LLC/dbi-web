import { defineField, defineType } from "sanity";

export const programCardsSection = defineType({
  name: "programCardsSection",
  title: "Program Cards Section",
  type: "object",
  fields: [
    defineField({
      name: "cta",
      title: "Section CTA (fallback for cards without their own action)",
      type: "ctaAction",
      description:
        "Used when a card has no card-level CTA, or as the default link when a card only has a URL. Choose a link or the contact form.",
    }),
    defineField({
      name: "items",
      title: "Cards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
            defineField({
              name: "cardCta",
              title: "Card CTA",
              type: "ctaAction",
              description:
                "Optional. Sets this card’s action: link (internal or external) or contact form modal. When empty, the card link URL below and section CTA are used.",
            }),
            defineField({
              name: "href",
              title: "Card link URL (legacy)",
              type: "string",
              description:
                "Optional fallback path when Card CTA is not set, or when Card CTA is a link without its own URL.",
            }),
            defineField({
              name: "hoverColor",
              title: "Hover Overlay Color (CSS color)",
              type: "string",
              description: "Optional; e.g. rgba(234, 88, 12, 0.92)",
            }),
          ],
        },
      ],
    }),
  ],
});

