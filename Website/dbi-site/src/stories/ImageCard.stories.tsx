import type { Meta, StoryObj } from "@storybook/react";
import { ImageCard } from "@/components/ImageCard";

const meta: Meta<typeof ImageCard> = {
  title: "Components/ImageCard",
  component: ImageCard,
};

export default meta;
type Story = StoryObj<typeof ImageCard>;

export const Default: Story = {
  args: {
    title: "Tiffany Francies",
    subtitle: "Executive Director",
  },
};
