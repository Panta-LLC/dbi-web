import { defineField, defineType } from "sanity";

export const ctaButtonSection = defineType({
  name: "ctaButtonSection",
  title: "CTA Button Section",
  type: "object",
  fields: [
    defineField({
      name: "cta",
      title: "CTA",
      type: "cta",
    }),
    defineField({
      name: "buttonVariant",
      title: "Button Variant",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
        ],
      },
      initialValue: "primary",
    }),
  ],
});

