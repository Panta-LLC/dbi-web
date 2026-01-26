import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeading } from "@/components/SectionHeading";

const meta: Meta<typeof SectionHeading> = {
  title: "Components/SectionHeading",
  component: SectionHeading,
};

export default meta;
type Story = StoryObj<typeof SectionHeading>;

export const Default: Story = {
  args: {
    eyebrow: "Impact",
    title: "What community partners experience with DBI.",
    description:
      "We measure success through student engagement, family connection, and sustainable partnerships.",
  },
};

export const Centered: Story = {
  args: {
    eyebrow: "Programs",
    title: "Support for students, families, and schools.",
    description: "Responsive programs designed for each community we serve.",
    align: "center",
  },
};
