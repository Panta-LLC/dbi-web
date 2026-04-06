import { defineField, defineType } from "sanity";

export const contactFormDefinition = defineType({
  name: "contactFormDefinition",
  title: "Contact Form",
  type: "document",
  fields: [
    defineField({
      name: "adminTitle",
      title: "Admin title",
      type: "string",
      description: "Internal name in the CMS (not shown on the site).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submitLabel",
      title: "Submit button label",
      type: "string",
      description: "Required when you use Field definitions below.",
    }),
    defineField({
      name: "fieldDefinitions",
      title: "Field definitions",
      type: "array",
      of: [{ type: "contactFormFieldItem" }],
      description: "Add text, email, text area, or select fields. Field keys must be unique.",
      validation: (Rule) =>
        Rule.custom((items) => {
          if (!Array.isArray(items) || items.length === 0) return true;
          const names = items
            .map((i) => {
              const row = i as { name?: string };
              return typeof row?.name === "string" ? row.name.trim() : "";
            })
            .filter(Boolean);
          if (names.length !== new Set(names).size) {
            return "Each field key must be unique.";
          }
          return true;
        }),
    }),
    defineField({
      name: "fields",
      title: "Legacy field labels (deprecated)",
      type: "contactForm",
      description:
        "Deprecated: use Field definitions instead. Kept for existing content until migrated.",
      hidden: ({ document }) =>
        Array.isArray(document?.fieldDefinitions) && document.fieldDefinitions.length > 0,
    }),
  ],
  validation: (Rule) =>
    Rule.custom((_value, context) => {
      const doc = context.document as Record<string, unknown> | undefined;
      if (!doc) return true;
      const defs = doc.fieldDefinitions as unknown[] | undefined;
      const hasDefs = Array.isArray(defs) && defs.length > 0;
      const legacy = doc.fields as Record<string, unknown> | undefined;
      const hasLegacy = Boolean(
        legacy &&
          typeof legacy.firstNamePlaceholder === "string" &&
          legacy.firstNamePlaceholder.trim() !== "",
      );
      if (!hasDefs && !hasLegacy) {
        return "Add at least one field definition, or fill legacy field labels.";
      }
      if (hasDefs) {
        const submit = typeof doc.submitLabel === "string" ? doc.submitLabel.trim() : "";
        if (!submit) return "Submit button label is required when using field definitions.";
      }
      return true;
    }),
  preview: {
    select: {
      title: "adminTitle",
      defs: "fieldDefinitions",
    },
    prepare({
      title,
      defs,
    }: {
      title?: string;
      defs?: unknown[];
    }) {
      const n = Array.isArray(defs) ? defs.length : 0;
      return {
        title: title?.trim() || "Contact Form",
        subtitle: n > 0 ? `${n} field${n === 1 ? "" : "s"}` : "Legacy labels",
      };
    },
  },
});
