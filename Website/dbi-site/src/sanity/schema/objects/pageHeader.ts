import { defineField, defineType } from "sanity";

export const pageHeader = defineType({
  name: "pageHeader",
  title: "Page Header",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
});
