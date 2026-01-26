import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "@/components/PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Components/PageHeader",
  component: PageHeader,
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "About Delta Bay Impact",
    subtitle:
      "Learn how we create belonging and opportunity through mentorship, advocacy, and community partnership.",
  },
};
