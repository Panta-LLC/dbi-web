import type { Meta, StoryObj } from "@storybook/react";
import { AngledButton } from "@/components/AngledButton";

const meta: Meta<typeof AngledButton> = {
  title: "Components/AngledButton",
  component: AngledButton,
};

export default meta;
type Story = StoryObj<typeof AngledButton>;

export const Default: Story = {
  args: {
    href: "/contact",
    children: "Partner with us",
  },
};
