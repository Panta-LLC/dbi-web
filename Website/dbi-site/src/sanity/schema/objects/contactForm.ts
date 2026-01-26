import { defineField, defineType } from "sanity";

export const contactForm = defineType({
  name: "contactForm",
  title: "Contact Form",
  type: "object",
  fields: [
    defineField({
      name: "firstNamePlaceholder",
      title: "First Name Placeholder",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastNamePlaceholder",
      title: "Last Name Placeholder",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "emailPlaceholder",
      title: "Email Placeholder",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "organizationPlaceholder",
      title: "Organization Placeholder",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "messagePlaceholder",
      title: "Message Placeholder",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submitLabel",
      title: "Submit Button Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
