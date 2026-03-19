import { defineField, defineType } from "sanity";

export const testimonialSliderSection = defineType({
  name: "testimonialSliderSection",
  title: "Testimonial Slider Section",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Testimonials",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
            defineField({ name: "attribution", title: "Attribution (optional)", type: "string" }),
          ],
        },
      ],
    }),
  ],
});

