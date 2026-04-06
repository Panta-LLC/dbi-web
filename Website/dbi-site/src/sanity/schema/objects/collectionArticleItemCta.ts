import { defineField, defineType } from "sanity";

export const collectionArticleItemCta = defineType({
  name: "collectionArticleItemCta",
  title: "CTA with style",
  type: "object",
  fields: [
    defineField({
      name: "hierarchy",
      title: "Visual hierarchy",
      type: "string",
      description: "Controls button styling on cards and in the article panel.",
      initialValue: "primary",
      options: {
        list: [
          { title: "Primary (filled accent)", value: "primary" },
          { title: "Secondary (outline)", value: "secondary" },
          { title: "Tertiary (text link)", value: "tertiary" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "cta",
      title: "Action",
      type: "ctaActionOptional",
      description: "Link or contact form. Leave empty to skip this row.",
    }),
  ],
  preview: {
    select: {
      hierarchy: "hierarchy",
      label: "cta.label",
      kind: "cta.kind",
    },
    prepare({
      hierarchy,
      label,
      kind,
    }: {
      hierarchy?: string;
      label?: string;
      kind?: string;
    }) {
      const h = hierarchy === "secondary" ? "Secondary" : hierarchy === "tertiary" ? "Tertiary" : "Primary";
      const subtitle = [kind === "contactForm" ? "Contact" : "Link", label].filter(Boolean).join(" · ");
      return { title: `${h} CTA`, subtitle: subtitle || "Configure action" };
    },
  },
});
