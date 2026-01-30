import { defineField, defineType } from "sanity";

export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Admin Title",
      type: "string",
      initialValue: "Footer",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "siteLinks",
      title: "Site Links",
      type: "array",
      of: [{ type: "cta" }],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [{ type: "cta" }],
    }),
    defineField({ name: "partnersTitle", title: "Partners Title", type: "string" }),
    defineField({
      name: "partners",
      title: "Partners",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "logo", title: "Logo", type: "image" }),
            defineField({ name: "logoAlt", title: "Logo Alt Text", type: "string" }),
          ],
        },
      ],
    }),
  ],
});
