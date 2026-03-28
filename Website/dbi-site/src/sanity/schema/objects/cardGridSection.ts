import { defineField, defineType } from "sanity";

export const cardGridSection = defineType({
  name: "cardGridSection",
  title: "Card Grid Section",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({
      name: "description",
      title: "Intro",
      type: "text",
      rows: 5,
      description: "Optional. Shown below the title and above the cards. Use line breaks between paragraphs.",
    }),
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
              name: "cardCta",
              title: "Card CTA",
              type: "ctaAction",
              description:
                "Optional. Link (internal or external) or contact form modal. When empty, the card link URL below and section CTA are used.",
            }),
            defineField({
              name: "href",
              title: "Card link URL (legacy)",
              type: "string",
              description:
                "Optional fallback path when Card CTA is not set, or when Card CTA is a link without its own URL.",
            }),
          ],
        },
      ],
    }),
  ],
});

