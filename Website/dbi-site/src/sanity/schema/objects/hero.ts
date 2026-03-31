import { defineField, defineType } from "sanity";
import {
  heroGalleryImageHotspotOptions,
  leftStripImageHotspotOptions,
  validateHeroGalleryCropAspect,
  validateLeftStripCropAspect,
} from "../validation/heroGalleryImageAspect";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "text",
      rows: 1,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "cta",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "cta",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "leftImage",
      title: "Left strip image (balloon)",
      description: "Crop must match 159×548.",
      type: "image",
      options: leftStripImageHotspotOptions,
      validation: (Rule) => Rule.custom(validateLeftStripCropAspect),
    }),
    defineField({
      name: "leftImageAlt",
      title: "Left image alt text",
      type: "string",
    }),
    defineField({
      name: "galleryImages",
      title: "Hero gallery (right)",
      description: "Recommended 882×548px per image.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              description: "Crop must match 882×548. The hotspot tool shows that frame.",
              options: heroGalleryImageHotspotOptions,
              validation: (Rule) => Rule.custom(validateHeroGalleryCropAspect),
            }),
            defineField({
              name: "imageAlt",
              title: "Alt text",
              type: "string",
            }),
          ],
          preview: {
            select: { alt: "imageAlt", media: "image" },
            prepare({ alt, media }) {
              return { title: alt || "Gallery image", media };
            },
          },
        },
      ],
    }),
    defineField({
      name: "carouselSettings",
      title: "Gallery carousel",
      type: "carouselSettings",
    }),
  ],
});
