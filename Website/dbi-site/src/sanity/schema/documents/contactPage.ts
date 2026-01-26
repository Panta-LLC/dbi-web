import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Admin Title",
      type: "string",
      initialValue: "Contact Page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageHeader",
      title: "Page Header",
      type: "pageHeader",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactHeading",
      title: "Contact Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "contactForm",
      title: "Contact Form",
      type: "contactForm",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactDetails",
      title: "Contact Details",
      type: "contactDetails",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
