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
      name: "pageHeader",
      title: "Page Header",
      type: "pageHeader",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "highlightsHeading",
      title: "Highlights Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "impactHighlights",
      title: "Impact Highlights",
      type: "array",
      of: [{ type: "infoCard" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "outcomesHeading",
      title: "Outcomes Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "outcomes",
      title: "Outcomes",
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
