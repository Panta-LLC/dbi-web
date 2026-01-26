import type { Meta, StoryObj } from "@storybook/react";
import { CTASection } from "@/components/CTASection";

const meta: Meta<typeof CTASection> = {
  title: "Components/CTASection",
  component: CTASection,
};

export default meta;
type Story = StoryObj<typeof CTASection>;

export const Default: Story = {
  args: {
    title: "Join the DBI community.",
    description:
      "Reach out to learn more about programs, partnerships, or ways to support our mission.",
    primaryCta: { label: "Contact DBI", href: "/contact" },
    secondaryCta: { label: "Donate or partner", href: "/donate" },
  },
};
