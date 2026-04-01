import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroImagePanel } from "@/components/HeroImagePanel";

const meta: Meta<typeof HeroImagePanel> = {
  title: "Components/HeroImagePanel",
  component: HeroImagePanel,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof HeroImagePanel>;

export const Default: Story = {
  args: {
    imageSrc: "https://picsum.photos/1600/900",
    imageAlt: "Sample hero image",
  },
};

export const WithCustomClassName: Story = {
  args: {
    imageSrc: "https://picsum.photos/1600/900",
    imageAlt: "Sample hero image",
    className: "border-4 border-red-500",
  },
};

