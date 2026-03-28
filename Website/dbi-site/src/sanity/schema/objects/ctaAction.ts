import { defineField, defineType } from "sanity";

const presentationOptions = [
  { title: "Centered dialog", value: "dialog" },
  { title: "Slide up from bottom", value: "slideBottom" },
  { title: "Slide down from top", value: "slideTop" },
  { title: "Slide in from left", value: "slideLeft" },
  { title: "Slide in from right", value: "slideRight" },
  { title: "Popover (anchored to button)", value: "popover" },
];

export const ctaAction = defineType({
  name: "ctaAction",
  title: "CTA",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      title: "Action type",
      type: "string",
      options: {
        list: [
          { title: "Open a link (site page or external URL)", value: "link" },
          { title: "Open contact form (modal)", value: "contactForm" },
        ],
        layout: "radio",
      },
      initialValue: "link",
    }),
    defineField({
      name: "label",
      title: "Button / link label",
      type: "string",
      description: "Shown on the card (e.g. Learn more) or as the modal trigger.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link URL",
      type: "string",
      description: "Internal path (e.g. /services) or https://…",
      hidden: ({ parent }) => parent?.kind === "contactForm",
    }),
    defineField({
      name: "formId",
      title: "Form ID",
      type: "string",
      description: "Short id for emails and analytics (e.g. programs-card-mentoring).",
      hidden: ({ parent }) => parent?.kind !== "contactForm",
    }),
    defineField({
      name: "messageContext",
      title: "Context (for email & message hint)",
      type: "string",
      description: 'Where this CTA appears, e.g. "Programs — Mentoring card".',
      hidden: ({ parent }) => parent?.kind !== "contactForm",
    }),
    defineField({
      name: "modalTitle",
      title: "Modal title",
      type: "string",
      hidden: ({ parent }) => parent?.kind !== "contactForm",
    }),
    defineField({
      name: "modalDescription",
      title: "Modal description",
      type: "text",
      rows: 2,
      hidden: ({ parent }) => parent?.kind !== "contactForm",
    }),
    defineField({
      name: "presentation",
      title: "Modal layout",
      type: "string",
      options: { list: presentationOptions },
      initialValue: "dialog",
      hidden: ({ parent }) => parent?.kind !== "contactForm",
    }),
    defineField({
      name: "successMessage",
      title: "Success message (after submit)",
      type: "string",
      hidden: ({ parent }) => parent?.kind !== "contactForm",
    }),
    defineField({
      name: "contactForm",
      title: "Form fields",
      type: "contactForm",
      hidden: ({ parent }) => parent?.kind !== "contactForm",
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value: Record<string, unknown> | undefined) => {
      if (!value) return true;
      const kind = (value.kind as string) ?? "link";
      if (kind === "link") {
        const href = typeof value.href === "string" ? value.href.trim() : "";
        if (!href) return "Link URL is required for link actions.";
        return true;
      }
      if (kind === "contactForm") {
        const formId = typeof value.formId === "string" ? value.formId.trim() : "";
        if (!formId) return "Form ID is required for contact form actions.";
        if (!value.contactForm) return "Form field copy is required.";
        return true;
      }
      return true;
    }),
});
