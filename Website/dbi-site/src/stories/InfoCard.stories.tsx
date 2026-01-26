import type { Meta, StoryObj } from "@storybook/react";
import { InfoCard } from "@/components/InfoCard";

const meta: Meta<typeof InfoCard> = {
  title: "Components/InfoCard",
  component: InfoCard,
};

export default meta;
type Story = StoryObj<typeof InfoCard>;

export const Default: Story = {
  args: {
    eyebrow: "Students",
    title: "Student Mentorship Circles",
    description:
      "Weekly small-group sessions that build leadership, academic skills, and peer connection.",
  },
};
