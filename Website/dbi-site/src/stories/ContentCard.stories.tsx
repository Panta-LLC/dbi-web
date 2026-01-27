import type { Meta, StoryObj } from "@storybook/react";
import { ContentCard } from "@/components/ContentCard";

const meta: Meta<typeof ContentCard> = {
  title: "Components/ContentCard",
  component: ContentCard,
};

export default meta;
type Story = StoryObj<typeof ContentCard>;

export const Default: Story = {
  args: {
    title: "School-Based Mentorship and Advocacy",
    description:
      "Trusted mentors support students academically and personally while advocating for their needs.",
  },
};

export const WithCta: Story = {
  args: {
    title: "Family Engagement",
    description:
      "We strengthen communication and partnership between schools and families through events and outreach.",
    cta: { label: "Learn more", href: "/programs" },
  },
};
