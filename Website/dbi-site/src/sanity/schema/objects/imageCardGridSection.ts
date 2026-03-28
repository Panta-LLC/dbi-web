import { defineField, defineType } from "sanity";

export const imageCardGridSection = defineType({
  name: "imageCardGridSection",
  title: "Image Card Grid Section",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({
      name: "cta",
      title: "Section CTA (fallback for cards without their own action)",
      type: "ctaAction",
      description:
        "Used when a card has no card-level CTA. Choose a link or the contact form.",
    }),
    defineField({
      name: "items",
      title: "Cards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "imageAlt",
              title: "Image Alt Text",
              type: "string",
            }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
            defineField({
              name: "cardCta",
              title: "Card CTA",
              type: "ctaAction",
              description:
                "Optional. Link (internal or external) or contact form modal. When empty, section CTA is used.",
            }),
          ],
        },
      ],
    }),
  ],
});

