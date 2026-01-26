import type { Meta, StoryObj } from "@storybook/react";
import { ImpactStatCard } from "@/components/ImpactStatCard";

const meta: Meta<typeof ImpactStatCard> = {
  title: "Components/ImpactStatCard",
  component: ImpactStatCard,
};

export default meta;
type Story = StoryObj<typeof ImpactStatCard>;

export const Default: Story = {
  args: {
    value: "65 - 75",
    label: "Students Served in 2024-25",
  },
};
