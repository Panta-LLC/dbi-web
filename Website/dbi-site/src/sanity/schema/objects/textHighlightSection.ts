import { defineField, defineType } from "sanity";

export const textHighlightSection = defineType({
  name: "textHighlightSection",
  title: "Text Highlight Section",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 3,
    }),
  ],
});

