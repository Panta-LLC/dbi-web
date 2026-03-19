import { defineField, defineType } from "sanity";

export const textAndCtaSection = defineType({
  name: "textAndCtaSection",
  title: "Text + CTA Section",
  type: "object",
  fields: [
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "cta",
    }),
    defineField({
      name: "ctaVariant",
      title: "CTA Variant",
      type: "string",
      options: {
        list: [
          { title: "Secondary", value: "secondary" },
          { title: "Primary", value: "primary" },
        ],
      },
      initialValue: "secondary",
    }),
  ],
});

