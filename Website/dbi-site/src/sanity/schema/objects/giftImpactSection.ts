import { defineField, defineType } from "sanity";

export const giftImpactSection = defineType({
  name: "giftImpactSection",
  title: "Gift Impact Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Where your gift goes",
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
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
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "School", value: "school" },
                  { title: "Backpack", value: "backpack" },
                  { title: "Book", value: "bookOpen" },
                  { title: "Graduation cap", value: "graduationCap" },
                  { title: "Heart", value: "heart" },
                  { title: "People", value: "users" },
                ],
              },
            }),
          ],
        },
      ],
    }),
  ],
});
