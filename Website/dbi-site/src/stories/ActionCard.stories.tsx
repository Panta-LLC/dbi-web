import type { Meta, StoryObj } from "@storybook/react";
import { ActionCard } from "@/components/ActionCard";

const meta: Meta<typeof ActionCard> = {
  title: "Components/ActionCard",
  component: ActionCard,
};

export default meta;
type Story = StoryObj<typeof ActionCard>;

export const Default: Story = {
  args: {
    title: "School-Based Mentorship & Advocacy",
    description:
      "Trusted mentors support students academically and personally while advocating for their needs within school systems.",
    ctaLabel: "Partner with us",
    ctaHref: "/contact",
  },
};
