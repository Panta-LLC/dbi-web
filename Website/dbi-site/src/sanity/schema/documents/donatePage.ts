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
      name: "pageHeader",
      title: "Page Header",
      type: "pageHeader",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "supportHeading",
      title: "Support Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "supportOptions",
      title: "Support Options",
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
