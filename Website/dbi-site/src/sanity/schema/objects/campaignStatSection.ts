import { defineField, defineType } from "sanity";

export const campaignStatSection = defineType({
  name: "campaignStatSection",
  title: "Campaign Stat Section",
  type: "object",
  fields: [
    defineField({
      name: "stat",
      title: "Stat",
      type: "string",
      description: 'The headline figure, e.g. "2 in 3".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "statement",
      title: "Statement",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
    defineField({ name: "source", title: "Source", type: "string" }),
    defineField({
      name: "sourceUrl",
      title: "Source Link",
      type: "url",
      description: "Optional. Opens in a new tab.",
    }),
  ],
  preview: {
    select: { title: "stat", subtitle: "statement" },
  },
});
