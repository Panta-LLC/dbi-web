import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * A fundraising campaign (e.g. the year-end campaign). While one is active, Donate links
 * go to /donate and the progress tracker shows on /donate and the homepage. The raised
 * total and goal are read live from the Network for Good campaign page.
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
        "Turn on to send Donate links to /donate and show the tracker. Turn off when the campaign is over. If more than one campaign is live, the most recently edited one is used.",
    }),
    defineField({
      name: "campaignUrl",
      title: "Network for Good campaign page",
      type: "url",
      description:
        "The one-time gift page. The tracker reads the raised total, goal and end date from it.",
      validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "monthlyUrl",
      title: "Network for Good monthly giving page",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
      description: "First day of the campaign (Pacific time).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End date",
      type: "date",
      description:
        "Last day of the campaign (Pacific time). Leave empty to use the end date on the Network for Good page.",
      validation: (Rule) =>
        Rule.custom((end, context) => {
          const start = (context.document as { startDate?: string } | undefined)?.startDate;
          return !end || !start || end >= start ? true : "End date must be on or after the start date.";
        }),
    }),
    defineField({
      name: "tracker",
      title: "Tracker",
      type: "object",
      options: { collapsible: true },
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          description: "Small heading above the tracker.",
          initialValue: "Bigger impact in 2027",
        }),
        defineField({
          name: "showOnHomepage",
          title: "Show on the homepage",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "homepageCtaLabel",
          title: "Homepage button label",
          type: "string",
          initialValue: "Give now",
        }),
        defineField({
          name: "donateCtaLabel",
          title: "/donate button label",
          type: "string",
          initialValue: "Choose how to give",
        }),
        defineField({
          name: "milestones",
          title: "Milestones",
          type: "array",
          description: "Dates marked on the full tracker on /donate, such as Giving Tuesday.",
          of: [
            defineArrayMember({
              type: "object",
              name: "milestone",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "date",
                  title: "Date",
                  type: "date",
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: { select: { title: "label", subtitle: "date" } },
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", active: "active", start: "startDate", end: "endDate" },
    prepare: ({ title, active, start, end }) => ({
      title,
      subtitle: `${active ? "Live" : "Off"}${start ? ` · ${start}${end ? ` to ${end}` : ""}` : ""}`,
    }),
  },
});
