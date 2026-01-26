import type { Meta, StoryObj } from "@storybook/react";
import { SlantedImageReveal } from "@/components/SlantedImageReveal";

const meta: Meta<typeof SlantedImageReveal> = {
  title: "Components/SlantedImageReveal",
  component: SlantedImageReveal,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof SlantedImageReveal>;

export const Masked: Story = {
  args: {
    src: "https://cdn.sanity.io/images/39057kga/production/ea4366aa341b8c2ffcd0e2efe7fe99cbd7820fa5-6742x2446.png",
    alt: "DBI student program",
    className: "h-[320px] w-[360px]",
    direction: "right",
    trigger: "load",
    variant: "mask",
    tall: false,
  },
};

export const Framed: Story = {
  args: {
    src: "https://cdn.sanity.io/images/39057kga/production/ea4366aa341b8c2ffcd0e2efe7fe99cbd7820fa5-6742x2446.png",
    alt: "DBI student program",
    className: "h-[320px] w-[360px]",
    direction: "right",
    trigger: "load",
    variant: "framed",
    tall: false,
  },
};
