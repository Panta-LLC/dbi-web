import { defineField, defineType } from "sanity";

export const carouselSettings = defineType({
  name: "carouselSettings",
  title: "Carousel options",
  type: "object",
  fields: [
    defineField({
      name: "transition",
      title: "Transition",
      type: "string",
      options: {
        list: [
          { title: "Fade", value: "fade" },
          { title: "Slide", value: "slide" },
          { title: "Scale", value: "scale" },
          { title: "Blur", value: "blur" },
        ],
        layout: "radio",
      },
      initialValue: "fade",
    }),
    defineField({
      name: "transitionDurationMs",
      title: "Transition duration (ms)",
      type: "number",
      initialValue: 680,
      validation: (Rule) => Rule.min(200).max(3000),
    }),
    defineField({
      name: "autoPlayMs",
      title: "Autoplay interval (ms)",
      type: "number",
      description: "Leave empty to disable autoplay.",
      validation: (Rule) => Rule.min(500).max(120000),
    }),
    defineField({
      name: "showPagination",
      title: "Show pagination dots",
      type: "boolean",
      description: "When off, dots are hidden (arrows may still show when multiple slides).",
    }),
    defineField({
      name: "showProgress",
      title: "Show autoplay progress bar",
      type: "boolean",
      description: "When autoplay is enabled, shows a bar for the remaining time.",
    }),
  ],
});
