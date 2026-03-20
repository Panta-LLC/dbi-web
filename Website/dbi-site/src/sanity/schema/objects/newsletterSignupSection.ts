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
    defineField({
      name: "mailchimp",
      title: "Mailchimp Integration",
      type: "object",
      description:
        "Uses the Mailchimp Marketing API. Set MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID in your environment. List ID can optionally override the env default.",
      fields: [
        defineField({
          name: "listId",
          title: "Audience List ID (optional)",
          type: "string",
          description:
            "Mailchimp audience/list ID. Find in Audience → Settings → Audience name and defaults. If empty, uses MAILCHIMP_LIST_ID from environment.",
        }),
      ],
    }),
  ],
});

