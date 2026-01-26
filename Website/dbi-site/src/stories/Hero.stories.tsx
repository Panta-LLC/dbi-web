import type { Meta, StoryObj } from "@storybook/react";
import { Hero } from "@/components/Hero";
import { heroContent } from "@/data/siteContent";

const meta: Meta<typeof Hero> = {
  title: "Components/Hero",
  component: Hero,
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    ...heroContent,
    imageSrc:
      "https://cdn.sanity.io/images/39057kga/production/ea4366aa341b8c2ffcd0e2efe7fe99cbd7820fa5-6742x2446.png",
    imageAlt: "DBI student program",
  },
};
