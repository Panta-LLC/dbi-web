import type { Meta, StoryObj } from "@storybook/react";
import { NavBar } from "@/components/NavBar";

const meta: Meta<typeof NavBar> = {
  title: "Components/NavBar",
  component: NavBar,
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Default: Story = {};
