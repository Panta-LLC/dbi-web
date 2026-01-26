import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Admin Title",
      type: "string",
      initialValue: "Home Page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whatWeDoHeading",
      title: "What We Do Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "whatWeDoItems",
      title: "What We Do Items",
      type: "array",
      of: [{ type: "tabItem" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "impactHeading",
      title: "Impact Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "impactCards",
      title: "Impact Cards",
      type: "array",
      of: [{ type: "impactCard" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "sponsorsHeading",
      title: "Sponsors Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "sponsors",
      title: "Sponsors",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
