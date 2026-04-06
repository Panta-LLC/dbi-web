import { defineField, defineType } from "sanity";

export const contactFormFieldItem = defineType({
  name: "contactFormFieldItem",
  title: "Form field",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Field key",
      type: "string",
      description:
        "Stable id for submissions (lowercase letters, numbers, underscores). Example: company_name, email.",
      validation: (Rule) =>
        Rule.required().regex(/^[a-z][a-z0-9_]*$/).error("Use lowercase letters, numbers, underscores only."),
    }),
    defineField({
      name: "fieldType",
      title: "Field type",
      type: "string",
      options: {
        list: [
          { title: "Text", value: "text" },
          { title: "Email", value: "email" },
          { title: "Text area", value: "textarea" },
          { title: "Select", value: "select" },
        ],
        layout: "radio",
      },
      initialValue: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "placeholder",
      title: "Placeholder",
      type: "string",
    }),
    defineField({
      name: "required",
      title: "Required",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "selectOptions",
      title: "Select options",
      type: "array",
      of: [{ type: "string" }],
      description: "One option per row (only used when field type is Select).",
      hidden: ({ parent }) => parent?.fieldType !== "select",
      validation: (Rule) =>
        Rule.custom((options, context) => {
          const parent = context.parent as { fieldType?: string } | undefined;
          if (parent?.fieldType !== "select") return true;
          if (!Array.isArray(options) || options.length === 0) {
            return "Add at least one option for a select field.";
          }
          return true;
        }),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "number",
      description: "Visible rows for text areas (default 5).",
      initialValue: 5,
      hidden: ({ parent }) => parent?.fieldType !== "textarea",
      validation: (Rule) =>
        Rule.custom((rows, context) => {
          const parent = context.parent as { fieldType?: string } | undefined;
          if (parent?.fieldType !== "textarea") return true;
          if (rows === undefined || rows === null) return true;
          if (typeof rows !== "number" || rows < 2 || rows > 30) {
            return "Rows must be between 2 and 30.";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      label: "label",
      fieldType: "fieldType",
      name: "name",
    },
    prepare({
      label,
      fieldType,
      name,
    }: {
      label?: string;
      fieldType?: string;
      name?: string;
    }) {
      return {
        title: label || name || "Field",
        subtitle: [fieldType, name].filter(Boolean).join(" · "),
      };
    },
  },
});
