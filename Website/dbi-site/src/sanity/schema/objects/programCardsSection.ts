import { defineField, defineType } from "sanity";

export const programCardsSection = defineType({
  name: "programCardsSection",
  title: "Program Cards Section",
  type: "object",
  fields: [
    defineField({
      name: "cta",
      title: "Section CTA (fallback link for cards)",
      type: "cta",
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
              name: "href",
              title: "Card Link URL",
              type: "string",
              description: "Optional; falls back to section CTA",
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

