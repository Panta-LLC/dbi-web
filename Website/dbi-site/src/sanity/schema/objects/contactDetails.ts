import { defineField, defineType } from "sanity";

export const contactDetails = defineType({
  name: "contactDetails",
  title: "Contact Details",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "responseNote",
      title: "Response Note",
      type: "text",
      rows: 2,
    }),
  ],
});
