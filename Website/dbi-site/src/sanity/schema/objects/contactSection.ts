import { defineField, defineType } from "sanity";

export const contactSection = defineType({
  name: "contactSection",
  title: "Contact section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section heading",
      type: "string",
    }),
    defineField({
      name: "contactIntro",
      title: "Intro",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "generalListLabel",
      title: "General option — list label",
      type: "string",
      description: "Label in the left column for the default contact form.",
      initialValue: "General contact",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "generalFormId",
      title: "General form — Form ID",
      type: "string",
      description: "Short id for emails and analytics for the default form.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "generalMessageContext",
      title: "General form — Context (email & message hint)",
      type: "string",
    }),
    defineField({
      name: "generalModalTitle",
      title: "General form — Heading",
      type: "string",
    }),
    defineField({
      name: "generalModalDescription",
      title: "General form — Intro text",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "generalSuccessMessage",
      title: "General form — Success message",
      type: "string",
    }),
    defineField({
      name: "generalContactFormRef",
      title: "General form — Contact Form",
      type: "reference",
      to: [{ type: "contactFormDefinition" }],
      description: "Field labels for the default contact option.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "formCtas",
      title: "Additional contact form CTAs",
      type: "array",
      description:
        "Pick saved Contact CTA documents. They appear in the left column and swap the form on the right.",
      of: [
        {
          type: "reference",
          to: [{ type: "contactFormCta" }],
        },
      ],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact section" };
    },
  },
});
