import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Admin Title",
      type: "string",
      initialValue: "About Page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageHeader",
      title: "Page Header",
      type: "pageHeader",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "storyHeading",
      title: "Our Story Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "missionPillars",
      title: "Mission Pillars",
      type: "array",
      of: [{ type: "infoCard" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "valuesHeading",
      title: "Values Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "values",
      title: "Values",
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
