import { defineField, defineType } from "sanity";

export const impactPage = defineType({
  name: "impactPage",
  title: "Impact Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Admin Title",
      type: "string",
      initialValue: "Impact Page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lead",
      title: "Lead",
      type: "string",
    }),
    defineField({
      name: "outcomes",
      title: "Outcomes",
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
    defineField({
      name: "locations",
      title: "Locations",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "items",
          title: "Locations",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "name", title: "Name", type: "string" }),
                defineField({ name: "location", title: "Location", type: "string" }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "learning",
      title: "Learning",
      type: "object",
      fields: [
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
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
