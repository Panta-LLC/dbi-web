import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MeasurableImpact } from "@/components/MeasurableImpact";

const meta: Meta<typeof MeasurableImpact> = {
  title: "Components/MeasurableImpact",
  component: MeasurableImpact,
};

export default meta;
type Story = StoryObj<typeof MeasurableImpact>;

export const Default: Story = {
  args: {
    title: "Measurable Impact",
    metrics: [
      { value: "100", label: "Students Served", href: "/programs" },
      { value: "7", label: "Cities Impacted", href: "/impact" },
      { value: "$1,000,000", label: "Scholarships Raised", href: "/donate" },
    ],
  },
};

export const WithoutLinks: Story = {
  args: {
    title: "Our Impact",
    metrics: [
      { value: "50+", label: "Programs" },
      { value: "12", label: "Partners" },
      { value: "5", label: "Years" },
    ],
  },
};
