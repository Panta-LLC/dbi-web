import { defineField, defineType } from "sanity";

const paletteOptions = [
  { title: "Color 1 (primary blue)", value: "color-1" },
  { title: "Color 2 (accent orange)", value: "color-2" },
  { title: "Color 3 (light cream)", value: "color-3" },
  { title: "Color 4 (navy)", value: "color-4" },
  { title: "Color 5 (charcoal)", value: "color-5" },
];

export const heroSplitSection = defineType({
  name: "heroSplitSection",
  title: "Hero (split image + content)",
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
      rows: 4,
    }),
    defineField({
      name: "backgroundColor",
      title: "Content background",
      description: "Palette color for the text column (see Style / Color Palette in Storybook).",
      type: "string",
      options: {
        list: paletteOptions,
        layout: "radio",
      },
      initialValue: "color-1",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imagePosition",
      title: "Image position",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "image",
      title: "Image (half-width, static)",
      description: "Optional. When set, appears as a static half-width column beside the content.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageAlt",
      title: "Image alt text",
      description: "Optional; recommended when an image is provided.",
      type: "string",
    }),
    defineField({
      name: "ctas",
      title: "Calls to action",
      type: "array",
      of: [{ type: "cta" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
    prepare({ title, media }) {
      return { title: title || "Split hero", subtitle: "Image + content", media };
    },
  },
});
