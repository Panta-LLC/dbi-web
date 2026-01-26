import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Join a DBI program",
    href: "/",
  },
};

export const Secondary: Story = {
  args: {
    children: "Donate or partner",
    href: "/",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    children: "Learn more",
    href: "/",
    variant: "ghost",
  },
};
