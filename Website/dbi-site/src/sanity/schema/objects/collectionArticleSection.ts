import { defineArrayMember, defineField, defineType } from "sanity";

export const collectionArticleSection = defineType({
  name: "collectionArticleSection",
  title: "Collection Article Section",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({
      name: "description",
      title: "Intro",
      type: "text",
      rows: 5,
      description: "Optional. Shown below the title and above the cards.",
    }),
    defineField({
      name: "sectionLayout",
      title: "Section layout",
      type: "string",
      initialValue: "cardGrid",
      options: {
        list: [
          {
            title: "Card grid",
            value: "cardGrid",
          },
          {
            title: "Explorer (split view)",
            value: "explorer",
          },
        ],
        layout: "radio",
      },
      description:
        "Card grid: optional grid-only start, then expand to sidebar + article. Explorer: always show the split view (no grid-only phase).",
    }),
    defineField({
      name: "columnsPerRow",
      title: "Cards per row (large screens)",
      type: "number",
      initialValue: 2,
      hidden: ({ parent }) => parent?.sectionLayout === "explorer",
      options: {
        list: [
          { title: "2", value: 2 },
          { title: "3", value: 3 },
          { title: "4", value: 4 },
          { title: "5", value: 5 },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.integer().min(2).max(5),
      description:
        "How many cards appear in one row on large viewports. Smaller screens stack automatically.",
    }),
    defineField({
      name: "cardSize",
      title: "Card size",
      type: "string",
      initialValue: "md",
      options: {
        list: [
          { title: "Small", value: "sm" },
          { title: "Medium", value: "md" },
          { title: "Large", value: "lg" },
        ],
        layout: "radio",
      },
      description: "Padding and typography for grid cards; sidebar previews scale to match.",
    }),
    defineField({
      name: "expandedMode",
      title: "Expanded detail mode",
      type: "boolean",
      initialValue: true,
      hidden: ({ parent }) => parent?.sectionLayout === "explorer",
      description:
        "When on, clicking a tile opens the sidebar and full article panel. When off, only the tiled grid is shown; use item CTAs on each card if you want links. Not used when layout is Explorer.",
    }),
    defineField({
      name: "defaultView",
      title: "Default view (card grid + expanded)",
      type: "string",
      initialValue: "grid",
      hidden: ({ parent }) =>
        parent?.sectionLayout !== "cardGrid" || parent?.expandedMode === false,
      options: {
        list: [
          { title: "Grid first", value: "grid" },
          { title: "Explorer first (split view)", value: "explorer" },
        ],
        layout: "radio",
      },
      description:
        "When the section starts as card grid with expansion enabled: show the grid first, or open the explorer (sidebar + article) immediately.",
    }),
    defineField({
      name: "cta",
      title: "Section CTA (fallback for items without their own action)",
      type: "ctaActionOptional",
      description:
        "Used when an item has no card-level CTA, or as the default link when an item only has a URL. All fields are optional.",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [defineArrayMember({ type: "collectionArticleItem" })],
    }),
  ],
});
