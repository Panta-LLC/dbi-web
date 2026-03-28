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

export const WithImage: Story = {
  args: {
    title: "Tiffany Francies",
    subtitle: "Executive Director",
    imageSrc: "https://picsum.photos/400/300",
    imageAlt: "Tiffany Francies portrait",
  },
};

export const NoImage: Story = {
  args: {
    title: "Board Member",
    subtitle: "Volunteer position",
  },
};

export const WithCta: Story = {
  args: {
    title: "Tiffany Francies",
    subtitle: "Executive Director",
    imageSrc: "https://picsum.photos/400/300",
    imageAlt: "Portrait",
    cta: { kind: "link", label: "Contact", href: "/contact" },
  },
};
