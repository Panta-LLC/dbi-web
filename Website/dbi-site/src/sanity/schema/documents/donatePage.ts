import { defineField, defineType } from "sanity";

export const donatePage = defineType({
  name: "donatePage",
  title: "Donate Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Admin Title",
      type: "string",
      initialValue: "Donate Page",
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
      name: "support",
      title: "Support",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "cta", title: "CTA", type: "cta" }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
