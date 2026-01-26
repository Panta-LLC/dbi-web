import { defineField, defineType } from "sanity";

export const getInvolvedPage = defineType({
  name: "getInvolvedPage",
  title: "Get Involved Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Admin Title",
      type: "string",
      initialValue: "Get Involved Page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageHeader",
      title: "Page Header",
      type: "pageHeader",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pathwaysHeading",
      title: "Pathways Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "options",
      title: "Get Involved Options",
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
