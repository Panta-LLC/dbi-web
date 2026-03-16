import type { Meta, StoryObj } from "@storybook/react";
import { Hero } from "@/components/Hero";

const meta: Meta<typeof Hero> = {
  title: "Components/Hero",
  component: Hero,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    imageSrc: "https://picsum.photos/1600/600",
    imageAlt: "Youth standing on stage",
    title: "EDUCATE.\nADVOCATE.\nELEVATE.",
    subtitle: "Supporting African American youth in West Contra Costa County.",
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

