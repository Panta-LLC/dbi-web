import type { Meta, StoryObj } from "@storybook/react";
import { ProgramCards } from "@/components/ProgramCards";

const meta: Meta<typeof ProgramCards> = {
  title: "Components/ProgramCards",
  component: ProgramCards,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ProgramCards>;

const defaultItems = [
  {
    title: "Mentorship",
    imageSrc: "https://picsum.photos/600/400?random=1",
    imageAlt: "Mentor and mentee",
    href: "/programs/mentorship",
  },
  {
    title: "Family Engagement",
    imageSrc: "https://picsum.photos/600/400?random=2",
    imageAlt: "Families together",
    href: "/programs/family-engagement",
    hoverColor: "rgba(234, 88, 12, 0.92)", // orange
  },
  {
    title: "Community Engagement",
    imageSrc: "https://picsum.photos/600/400?random=3",
    imageAlt: "Community event",
    href: "/programs/community-engagement",
  },
];

export const Default: Story = {
  args: {
    items: defaultItems,
  },
};

export const CustomHoverColors: Story = {
  args: {
    items: [
      { ...defaultItems[0], hoverColor: "rgba(42, 87, 156, 0.92)" },
      { ...defaultItems[1], hoverColor: "rgba(234, 88, 12, 0.92)" },
      { ...defaultItems[2], hoverColor: "rgba(22, 163, 74, 0.92)" },
    ],
  },
};

export const LinkCtaLabels: Story = {
  args: {
    items: [
      {
        title: "Mentorship",
        imageSrc: "https://picsum.photos/600/400?random=10",
        imageAlt: "Mentor and mentee",
        href: "/programs/mentorship",
        linkCtaLabel: "Explore program",
      },
      {
        title: "Family Engagement",
        imageSrc: "https://picsum.photos/600/400?random=11",
        imageAlt: "Families together",
        href: "/programs/family-engagement",
        linkCtaLabel: "See how we help",
      },
      {
        title: "Community",
        imageSrc: "https://picsum.photos/600/400?random=12",
        imageAlt: "Community event",
        href: "/programs/community-engagement",
      },
    ],
  },
};
