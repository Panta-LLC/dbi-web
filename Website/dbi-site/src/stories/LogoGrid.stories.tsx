import type { Meta, StoryObj } from "@storybook/react";
import { LogoGrid } from "@/components/LogoGrid";

const meta: Meta<typeof LogoGrid> = {
  title: "Components/LogoGrid",
  component: LogoGrid,
};

export default meta;
type Story = StoryObj<typeof LogoGrid>;

export const Default: Story = {
  args: {
    items: [
      "Community Health Fund",
      "Keller Canyon Mitigation Fund",
      "Antioch Community Foundation",
    ],
  },
};
