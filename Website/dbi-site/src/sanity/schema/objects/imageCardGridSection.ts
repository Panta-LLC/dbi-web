import { defineField, defineType } from "sanity";

export const imageCardGridSection = defineType({
  name: "imageCardGridSection",
  title: "Image Card Grid Section",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
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
          ],
        },
      ],
    }),
  ],
});

