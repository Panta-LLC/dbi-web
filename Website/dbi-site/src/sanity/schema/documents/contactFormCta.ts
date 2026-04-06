import { defineField, defineType } from "sanity";

const presentationOptions = [
  { title: "Centered dialog", value: "dialog" },
  { title: "Slide up from bottom", value: "slideBottom" },
  { title: "Slide down from top", value: "slideTop" },
  { title: "Slide in from left", value: "slideLeft" },
  { title: "Slide in from right", value: "slideRight" },
  { title: "Popover (anchored to button)", value: "popover" },
];

/**
 * CTA-specific copy and routing (form ID, modal, list labels) plus a reference to a **Contact Form** for field labels.
 */
export const contactFormCta = defineType({
  name: "contactFormCta",
  title: "Contact CTA",
  type: "document",
  fields: [
    defineField({
      name: "adminTitle",
      title: "Admin title",
      type: "string",
      description: "Internal label in the CMS (not shown on the site).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "listLabel",
      title: "Contact page list label",
      type: "string",
      description:
        "Short label in the Contact page sidebar. If empty, the button label below is used.",
    }),
    defineField({
      name: "listDescription",
      title: "Contact page description",
      type: "text",
      rows: 2,
      description: "Optional supporting text under the list label on the Contact page.",
    }),
    defineField({
      name: "label",
      title: "Button / trigger label",
      type: "string",
      description: "Shown on modals and as the default for the Contact page list if list label is empty.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "formId",
      title: "Form ID",
      type: "string",
      description: "Short id for emails and analytics (e.g. programs-card-mentoring).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "messageContext",
      title: "Context (for email & message hint)",
      type: "string",
      description: 'Where this form is used, e.g. "Programs — Mentoring card".',
    }),
    defineField({
      name: "modalTitle",
      title: "Heading above the form",
      type: "string",
    }),
    defineField({
      name: "modalDescription",
      title: "Intro text above the form",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "presentation",
      title: "Modal layout",
      type: "string",
      options: { list: presentationOptions },
      initialValue: "dialog",
    }),
    defineField({
      name: "successMessage",
      title: "Success message (after submit)",
      type: "string",
    }),
    defineField({
      name: "contactFormRef",
      title: "Contact Form",
      type: "reference",
      to: [{ type: "contactFormDefinition" }],
      description: "Field labels and placeholders for this CTA.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      adminTitle: "adminTitle",
      label: "label",
    },
    prepare({ adminTitle, label }: { adminTitle?: string; label?: string }) {
      return {
        title: adminTitle || label || "Contact CTA",
        subtitle: label ? `Trigger: ${label}` : undefined,
      };
    },
  },
});
