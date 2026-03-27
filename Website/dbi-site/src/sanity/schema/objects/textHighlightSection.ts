import { defineField, defineType } from "sanity";

export const textHighlightSection = defineType({
  name: "textHighlightSection",
  title: "Text Highlight Section",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text (legacy)",
      type: "text",
      rows: 3,
      description: "Single highlight. Use “Highlight lines” for multiple slides instead.",
    }),
    defineField({
      name: "items",
      title: "Highlight lines",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 3,
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "carouselSettings",
      title: "Carousel",
      type: "carouselSettings",
    }),
  ],
});

