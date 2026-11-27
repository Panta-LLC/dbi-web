import { defineField, defineType } from "sanity";

/**
 * A fundraising campaign (e.g. the year-end campaign). While one is active, Donate links
 * go to /donate, which links to the campaign's Network for Good pages.
 */
export const campaign = defineType({
  name: "campaign",
  title: "Fundraising Campaign",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Campaign name",
      type: "string",
      initialValue: "Year-End Campaign",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "active",
      title: "Campaign is live",
      type: "boolean",
      initialValue: false,
      description:
        "Turn on to send Donate links to /donate. Turn off when the campaign is over. If more than one campaign is live, the most recently edited one is used.",
    }),
    defineField({
      name: "campaignUrl",
      title: "Network for Good campaign page",
      type: "url",
      description: "The one-time gift page for the campaign.",
      validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "monthlyUrl",
      title: "Network for Good monthly giving page",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
    }),
  ],
  preview: {
    select: { title: "title", active: "active" },
    prepare: ({ title, active }) => ({ title, subtitle: active ? "Live" : "Off" }),
  },
});
