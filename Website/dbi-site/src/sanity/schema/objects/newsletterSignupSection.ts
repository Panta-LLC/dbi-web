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
      description: "Configure Mailchimp form submission. Get the form action URL from Mailchimp: Audience → Signup forms → Embedded forms.",
      fields: [
        defineField({
          name: "formActionUrl",
          title: "Form Action URL",
          type: "url",
          description:
            "The full form action URL from Mailchimp (e.g. https://domain.us1.list-manage.com/subscribe/post?u=xxx&id=xxx)",
          validation: (Rule) =>
            Rule.uri({
              scheme: ["https"],
              allowRelative: false,
            }),
        }),
        defineField({
          name: "successRedirectUrl",
          title: "Success Redirect URL (optional)",
          type: "url",
          description:
            "Custom thank-you page URL. Configure this in Mailchimp: Forms → Confirmation thank you page → 'Instead of showing this thank you page, send subscribers to another URL'. Store here for reference.",
        }),
        defineField({
          name: "emailFieldName",
          title: "Email Field Name",
          type: "string",
          initialValue: "EMAIL",
          description: "Mailchimp uses 'EMAIL' by default. Only change if your form uses a different field name.",
        }),
      ],
    }),
  ],
});

