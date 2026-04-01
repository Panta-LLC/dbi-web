import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroContentPanel } from "@/components/HeroContentPanel";

const meta: Meta<typeof HeroContentPanel> = {
  title: "Components/HeroContentPanel",
  component: HeroContentPanel,
};

export default meta;
type Story = StoryObj<typeof HeroContentPanel>;

export const Default: Story = {
  args: {
    title: "Delta Bay Impact",
    subtitle: "Community-driven work you can verify.",
    primaryCta: {
      href: "/programs",
      label: "Join a DBI program",
    },
    secondaryCta: {
      href: "/donate",
      label: "Donate or partner",
    },
  },
};

export const PrimaryOnly: Story = {
  args: {
    title: "Delta Bay Impact",
    subtitle: "Focused on student success.",
    primaryCta: {
      href: "/programs",
      label: "Join a program",
    },
  },
};

