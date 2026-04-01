import type { Meta, StoryObj } from "@storybook/nextjs-vite";
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

const sampleGallery = [
  {
    src: "https://picsum.photos/882/548",
    alt: "Youth in rehearsal space",
  },
  {
    src: "https://picsum.photos/882/547",
    alt: "Community gathering",
  },
];

export const Default: Story = {
  args: {
    leftImageSrc: "https://picsum.photos/159/548",
    leftImageAlt: "Balloons and celebration",
    galleryImages: sampleGallery,
    carousel: {
      transition: "fade",
      transitionDurationMs: 680,
      autoPlayMs: 6000,
      showPagination: true,
      showProgress: true,
    },
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
