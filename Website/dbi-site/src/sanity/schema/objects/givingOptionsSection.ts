import { defineField, defineType } from "sanity";

export const givingOptionsSection = defineType({
  name: "givingOptionsSection",
  title: "Giving Options Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 8,
      description: "Separate paragraphs with a blank line.",
    }),
    defineField({
      name: "options",
      title: "Giving Options",
      type: "array",
      validation: (Rule) => Rule.required().min(1),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "eyebrow",
              title: "Eyebrow",
              type: "string",
              description: 'Short label above the title, e.g. "Year-end campaign".',
            }),
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
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "ctaLabel",
              title: "Button Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              title: "Network for Good Page",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "footnote",
      title: "Footnote",
      type: "text",
      rows: 2,
      description: "Optional. Leave empty to use the standard Network for Good note.",
    }),
  ],
});
