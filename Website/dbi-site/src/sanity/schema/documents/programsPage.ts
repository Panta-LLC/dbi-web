import { defineField, defineType } from "sanity";

export const programsPage = defineType({
  name: "programsPage",
  title: "Programs Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Admin Title",
      type: "string",
      initialValue: "Programs Page",
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
      name: "programs",
      title: "Programs",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "items",
          title: "Items",
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
