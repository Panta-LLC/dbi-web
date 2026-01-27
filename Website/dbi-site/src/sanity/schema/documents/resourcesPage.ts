import { defineField, defineType } from "sanity";

export const resourcesPage = defineType({
  name: "resourcesPage",
  title: "Resources Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Admin Title",
      type: "string",
      initialValue: "Resources Page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lead",
      title: "Lead",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          of: [{ type: "string" }],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
