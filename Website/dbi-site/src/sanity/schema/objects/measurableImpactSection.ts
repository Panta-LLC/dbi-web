import { defineField, defineType } from "sanity";

export const measurableImpactSection = defineType({
  name: "measurableImpactSection",
  title: "Measurable Impact Section",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string" }),
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "Link URL", type: "string", description: "Optional" }),
          ],
        },
      ],
    }),
  ],
});

