import { defineField, defineType } from "sanity";

export const site = defineType({
  name: "site",
  title: "Site",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Admin Title",
      type: "string",
      initialValue: "Site Settings",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "donateUrl",
      title: "Donate URL",
      type: "url",
      description:
        "External donation page URL (e.g. Network for Good). When set, all donate links will point here instead of /donate.",
    }),
    defineField({
      name: "organizationName",
      title: "Organization Name",
      type: "string",
      initialValue: "Delta Bay Impact",
    }),
    defineField({
      name: "primaryNav",
      title: "Primary Navigation",
      type: "array",
      of: [{ type: "cta" }],
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      fields: [
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
          name: "newsletterSignup",
          title: "Newsletter Signup",
          type: "newsletterSignupSection",
        }),
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
                defineField({
                  name: "tagline",
                  title: "Tagline",
                  type: "string",
                  description: "Optional subtext under the name",
                }),
              ],
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});

