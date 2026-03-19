import { defineField, defineType } from "sanity";

export const newsletterSignupSection = defineType({
  name: "newsletterSignupSection",
  title: "Newsletter Signup Section",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "string" }),
    defineField({ name: "placeholder", title: "Email Placeholder", type: "string" }),
    defineField({ name: "buttonLabel", title: "Button Label", type: "string" }),
    defineField({ name: "legalText", title: "Legal Text (optional)", type: "string" }),
    defineField({
      name: "image",
      title: "Image (optional)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "imageAlt", title: "Image Alt Text (optional)", type: "string" }),
  ],
});

