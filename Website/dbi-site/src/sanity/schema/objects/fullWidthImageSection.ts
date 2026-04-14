import { defineField, defineType } from "sanity";

export const fullWidthImageSection = defineType({
  name: "fullWidthImageSection",
  title: "Full width image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imageAlt",
      title: "Alt text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional. Shown in small type under the image.",
    }),
    defineField({
      name: "bleedToViewport",
      title: "Span full browser width",
      type: "boolean",
      initialValue: true,
      description:
        "When on, the image breaks out of the site content column to the edges of the window. Turn off to keep it only as wide as the main content area.",
    }),
    defineField({
      name: "priority",
      title: "Load with high priority",
      type: "boolean",
      initialValue: false,
      description: "Use for an image high on the page (e.g. first block) to improve LCP.",
    }),
  ],
  preview: {
    select: { alt: "imageAlt", caption: "caption" },
    prepare({ alt, caption }) {
      return {
        title: "Full width image",
        subtitle: caption || alt || "No caption",
      };
    },
  },
});
