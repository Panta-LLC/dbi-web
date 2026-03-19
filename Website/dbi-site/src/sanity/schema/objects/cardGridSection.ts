import { defineField, defineType } from "sanity";

export const cardGridSection = defineType({
  name: "cardGridSection",
  title: "Card Grid Section",
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
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
        },
      ],
    }),
  ],
});

