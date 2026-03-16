import type { Meta, StoryObj } from "@storybook/react";
import { MissionBanner } from "@/components/MissionBanner";

const meta: Meta<typeof MissionBanner> = {
  title: "Components/MissionBanner",
  component: MissionBanner,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof MissionBanner>;

export const Default: Story = {
  args: {
    imageSrc: "https://picsum.photos/1600/400"
  },
};

export const CustomTitle: Story = {
  args: {
    title: "INSPIRE.\nEMPOWER.\nTRANSFORM.",
  },
};

export const WithCustomImage: Story = {
  args: {
    imageSrc: "/images/custom-banner.jpg",
    imageAlt: "Custom community gathering",
  },
};

export const WithClassName: Story = {
  args: {
    className: "my-8",
  },
};
