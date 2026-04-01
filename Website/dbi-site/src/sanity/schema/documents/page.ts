import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "path",
      title: "Path",
      type: "string",
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          if (!value) {
            return true;
          }

          const currentId = context.document?._id?.replace(/^drafts\./, "");
          if (!currentId) {
            return true;
          }

          const params = {
            path: value,
            draftId: `drafts.${currentId}`,
            publishedId: currentId,
          };

          const query =
            'count(*[_type == "page" && path == $path && !(_id in [$draftId, $publishedId])])';
          const count = await context
            .getClient({ apiVersion: "2025-01-22" })
            .fetch<number>(query, params);

          return count === 0 || "Path must be unique.";
        }),
      description: "Example: /about, /services, /",
    }),
    defineField({
      name: "title",
      title: "Admin Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "Content Page",
    }),
    defineField({
      name: "lead",
      title: "Lead",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Site layout", value: "site" },
          { title: "Content page layout", value: "contentPage" },
        ],
        layout: "radio",
      },
      initialValue: "contentPage",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content Components",
      type: "array",
      of: [
        { type: "heroSection" },
        { type: "heroSplitSection" },
        { type: "textHighlightSection" },
        { type: "programCardsSection" },
        { type: "measurableImpactSection" },
        { type: "testimonialSliderSection" },
        { type: "cardGridSection" },
        { type: "collectionArticleSection" },
        { type: "imageCardGridSection" },
        { type: "supportSection" },
        { type: "textAndCtaSection" },
        { type: "ctaButtonSection" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "path",
    },
  },
});

