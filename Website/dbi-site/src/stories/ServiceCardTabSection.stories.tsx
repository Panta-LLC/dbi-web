import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ServiceCardTabSection } from "@/components/ServiceCardTabSection";

const meta: Meta<typeof ServiceCardTabSection> = {
  title: "Components/ServiceCardTabSection",
  component: ServiceCardTabSection,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ServiceCardTabSection>;

const baseItems = [
  {
    title: "School-Based Mentorship",
    description: "Short teaser for the grid view.",
    detail:
      "DBI mentors build trusted relationships with students, providing academic support, goal-setting, and personal development while advocating for students' educational needs.",
    imageSrc: "https://picsum.photos/600/400?random=41",
    imageAlt: "Mentorship",
    hoverColor: "rgba(234, 88, 12, 0.92)",
    cta: { kind: "link" as const, label: "Get in touch", href: "/contact" },
  },
  {
    title: "Academic Support",
    description: "Tutoring and homework help connections.",
    detail: "We connect students to tutoring, homework help, and skill-building resources.",
    imageSrc: "https://picsum.photos/600/400?random=42",
    imageAlt: "Academic support",
    cta: { kind: "link" as const, label: "Learn more", href: "/services" },
  },
  {
    title: "Family Engagement",
    description: "Strengthening school-family partnerships.",
    detail: "DBI strengthens school-family partnerships through regular communication and events.",
    cta: { kind: "link" as const, label: "Learn more", href: "/services" },
  },
  {
    title: "Mental Health Awareness",
    description: "Education and referrals.",
    detail: "We provide mental health education and connect families to culturally responsive resources.",
    hoverColor: "rgba(42, 87, 156, 0.92)",
    cta: { kind: "link" as const, label: "Learn more", href: "/services" },
  },
];

export const Default: Story = {
  args: {
    title: "Programs",
    description:
      "Click a card to open the tab strip and detail panel. Click the active compact tab again to return to the grid.",
    items: baseItems,
  },
};

export const WithoutImages: Story = {
  args: {
    title: "Services (no tab images)",
    description: "Compact tabs use placeholder styling when no image is set.",
    items: baseItems.map((item) => ({
      title: item.title,
      description: item.description,
      detail: item.detail,
      hoverColor: item.hoverColor,
      cta: item.cta,
    })),
  },
};
