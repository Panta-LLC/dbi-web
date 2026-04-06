import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CollectionArticleSection } from "@/components/CollectionArticleSection";

const meta: Meta<typeof CollectionArticleSection> = {
  title: "Components/CollectionArticleSection",
  component: CollectionArticleSection,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof CollectionArticleSection>;

function primaryLinkCta(label: string, href: string) {
  return {
    ctas: [{ variant: "cta-primary" as const, cta: { kind: "link" as const, label, href } }],
  };
}

const baseItems = [
  {
    heading: "School-Based Mentorship",
    summary: "Short teaser for the grid view.\nSecond line of summary.",
    subtitle: "Optional subtitle in the article panel",
    description:
      "DBI mentors build trusted relationships with students, providing academic support, goal-setting, and personal development while advocating for students' educational needs. This paragraph appears only in the article panel.",
    imageSrc: "https://picsum.photos/600/400?random=51",
    imageAlt: "Mentorship",
    ...primaryLinkCta("Get in touch", "/contact"),
  },
  {
    heading: "Academic Support",
    summary: "Tutoring and homework help connections.",
    description:
      "We connect students to tutoring, homework help, and skill-building resources tailored to each learner.",
    imageSrc: "https://picsum.photos/600/400?random=52",
    imageAlt: "Academic support",
    ...primaryLinkCta("Learn more", "/services"),
  },
  {
    heading: "Family Engagement",
    summary: "Strengthening school-family partnerships.",
    description:
      "DBI strengthens school-family partnerships through regular communication, workshops, and collaborative planning.",
    ...primaryLinkCta("Learn more", "/services"),
  },
  {
    heading: "Mental Health Awareness",
    summary: "Education and referrals.",
    description:
      "We provide mental health education and connect families to culturally responsive resources in the community.",
    imageSrc: "https://picsum.photos/600/400?random=53",
    imageAlt: "Mental health",
    ...primaryLinkCta("Learn more", "/services"),
  },
];

export const Default: Story = {
  args: {
    title: "Programs & services",
    description: "Choose a topic to read the full story. Click the close control to return to the grid.",
    columnsPerRow: 2,
    sectionLayout: "cardGrid",
    defaultView: "grid",
    cardSize: "md",
    items: baseItems,
  },
};

export const ThreeColumns: Story = {
  args: {
    ...Default.args,
    columnsPerRow: 3,
  },
};

export const FiveColumns: Story = {
  args: {
    ...Default.args,
    columnsPerRow: 5,
    items: [
      ...baseItems,
      {
        heading: "Community Events",
        summary: "Workshops and gatherings.",
        description: "Quarterly events bring families and staff together.",
        imageSrc: "https://picsum.photos/600/400?random=54",
        imageAlt: "Events",
        ctas: [],
      },
    ],
  },
};

export const NoImages: Story = {
  args: {
    title: "Text-only items",
    items: baseItems.map((item) => ({
      heading: item.heading,
      summary: item.summary,
      description: item.description,
      ctas: item.ctas,
    })),
  },
};

/** Tiled grid only: no expanded sidebar/article panel; CTAs show on each card when set. */
export const TiledOnly: Story = {
  args: {
    title: "Programs at a glance",
    description: "Static tiles with optional links — expanded detail mode is off.",
    columnsPerRow: 2,
    expandedMode: false,
    items: baseItems,
  },
};

/** Always split view; no grid phase and no close control. */
export const ExplorerLayout: Story = {
  args: {
    title: "Explorer layout",
    description: "Sidebar + article only. Use for pages that should not show a card grid first.",
    sectionLayout: "explorer",
    cardSize: "md",
    items: baseItems,
  },
};

/** Card grid with expansion on, but open in explorer on load (close returns to grid). */
export const DefaultViewExplorer: Story = {
  args: {
    ...Default.args,
    title: "Explorer first",
    description: "Starts in split view; close button returns to the grid.",
    defaultView: "explorer",
  },
};

export const CardSizeSmall: Story = {
  args: {
    ...Default.args,
    cardSize: "sm",
    columnsPerRow: 4,
  },
};

export const CardSizeLarge: Story = {
  args: {
    ...Default.args,
    cardSize: "lg",
    columnsPerRow: 2,
  },
};
