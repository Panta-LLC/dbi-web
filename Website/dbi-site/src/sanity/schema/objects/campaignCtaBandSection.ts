import { defineField, defineType } from "sanity";

export const campaignCtaBandSection = defineType({
  name: "campaignCtaBandSection",
  title: "Campaign CTA Band Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "cta",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
