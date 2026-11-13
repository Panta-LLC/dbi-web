import { defineArrayMember, defineField, defineType } from "sanity";

export const newsletterSignupSection = defineType({
  name: "newsletterSignupSection",
  title: "Newsletter Signup Section",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "string" }),
    defineField({ name: "buttonLabel", title: "Button Label", type: "string" }),
    defineField({ name: "legalText", title: "Legal Text (optional)", type: "string" }),
    defineField({
      name: "image",
      title: "Image (optional)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "imageAlt", title: "Image Alt Text (optional)", type: "string" }),
    defineField({
      name: "audiences",
      title: "Audiences",
      description:
        "Visitors pick one of these, then sign up through that audience's Network for Good form. Leave empty to use the site's built-in Parent / Community / Donor / Partner forms. If you add audiences here, every one needs a form URL or the site falls back to the basic signup form.",
      type: "array",
      validation: (Rule) => Rule.max(6),
      of: [
        defineArrayMember({
          type: "object",
          name: "newsletterAudience",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              description: 'Shown on the choice button, e.g. "Parent or Guardian".',
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Short description (optional)",
              type: "string",
            }),
            defineField({
              name: "formUrl",
              title: "Network for Good signup form URL",
              description:
                "In Network for Good: Communication → Forms → Actions → Embed, then copy the src URL from the code snippet (e.g. https://deltabayimpact.dm.networkforgood.com/forms/319212?iframe=1).",
              type: "url",
              validation: (Rule) => Rule.uri({ scheme: ["https"] }),
            }),
          ],
          preview: { select: { title: "label", subtitle: "formUrl" } },
        }),
      ],
    }),
  ],
});
