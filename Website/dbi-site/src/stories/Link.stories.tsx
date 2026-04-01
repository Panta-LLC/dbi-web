import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Link } from "@/components/Link";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  args: {
    href: "/",
  },
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Nav: Story = {
  args: {
    variant: "nav",
    children: "Programs",
  },
};

export const Body: Story = {
  args: {
    variant: "body",
    children: "Read the impact report",
  },
};

export const CTA: Story = {
  args: {
    variant: "cta",
    children: "Donate now",
  },
};

