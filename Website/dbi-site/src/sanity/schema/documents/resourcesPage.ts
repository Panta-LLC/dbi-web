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
      name: "pageHeader",
      title: "Page Header",
      type: "pageHeader",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "resourcesHeading",
      title: "Resources Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [{ type: "infoCard" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 2,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "primaryCta",
          title: "Primary CTA",
          type: "cta",
          validation: (Rule) => Rule.required(),
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
