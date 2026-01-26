import type { Meta, StoryObj } from "@storybook/react";
import { SponsorBadge } from "@/components/SponsorBadge";

const meta: Meta<typeof SponsorBadge> = {
  title: "Components/SponsorBadge",
  component: SponsorBadge,
};

export default meta;
type Story = StoryObj<typeof SponsorBadge>;

export const Default: Story = {
  args: {
    name: "Community Health Fund",
  },
};
