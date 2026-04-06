import { defineField, defineType } from "sanity";

const presentationOptions = [
  { title: "Centered dialog", value: "dialog" },
  { title: "Slide up from bottom", value: "slideBottom" },
  { title: "Slide down from top", value: "slideTop" },
  { title: "Slide in from left", value: "slideLeft" },
  { title: "Slide in from right", value: "slideRight" },
  { title: "Popover (anchored to button)", value: "popover" },
];

function hasContactFormRef(parent: { contactFormRef?: unknown } | undefined): boolean {
  const ref = parent?.contactFormRef;
  return Boolean(
    ref && typeof ref === "object" && "_ref" in ref && (ref as { _ref?: string })._ref,
  );
}

/**
 * Same shape as `ctaAction` but all fields optional (no required validation).
 * Used by card grid section so editors can save incomplete CTAs while drafting.
 */
export const ctaActionOptional = defineType({
  name: "ctaActionOptional",
  title: "CTA (optional fields)",
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
    }),
    defineField({
      name: "href",
      title: "Link URL",
      type: "string",
      description: "Internal path (e.g. /services) or https://…",
      hidden: ({ parent }) => parent?.kind === "contactForm",
    }),
    defineField({
      name: "contactFormRef",
      title: "Contact Form",
      type: "reference",
      to: [{ type: "contactFormDefinition" }],
      description:
        "Optional. Use a saved Contact Form for field labels instead of defining them below.",
      hidden: ({ parent }) => parent?.kind !== "contactForm",
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
      title: "Form fields (inline)",
      type: "contactFormOptional",
      description: "Used when no Contact Form document is selected above.",
      hidden: ({ parent }) =>
        parent?.kind !== "contactForm" || hasContactFormRef(parent),
    }),
  ],
});
