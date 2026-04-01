import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  HeroSplitStatic,
  type HeroSplitPalette,
  type HeroSplitStaticProps,
} from "@/components/HeroSplitStatic";

const meta: Meta<typeof HeroSplitStatic> = {
  title: "Components/HeroSplitStatic",
  component: HeroSplitStatic,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    backgroundPalette: {
      control: "select",
      options: ["color-1", "color-2", "color-3", "color-4", "color-5"] satisfies HeroSplitPalette[],
    },
    imagePosition: {
      control: "radio",
      options: ["left", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroSplitStatic>;

const baseArgs: Partial<HeroSplitStaticProps> = {
  imageSrc: "https://picsum.photos/seed/dbi-split/800/900",
  imageAlt: "Community program",
  title: "Programs that meet students where they are.",
  description:
    "Workshops, mentorship, and partnerships designed for lasting impact in West Contra Costa County.",
  ctas: [
    { href: "/programs", label: "Explore programs" },
    { href: "/donate", label: "Support us" },
    { href: "/contact", label: "Get in touch" },
  ],
};

export const ImageLeftDefault: Story = {
  args: {
    ...baseArgs,
    backgroundPalette: "color-1",
    imagePosition: "left",
  },
};

export const ImageRight: Story = {
  args: {
    ...baseArgs,
    backgroundPalette: "color-4",
    imagePosition: "right",
  },
};

export const LightCreamPalette: Story = {
  args: {
    ...baseArgs,
    backgroundPalette: "color-3",
    imagePosition: "left",
  },
};

export const AccentOrange: Story = {
  args: {
    ...baseArgs,
    backgroundPalette: "color-2",
    imagePosition: "right",
  },
};

export const Charcoal: Story = {
  args: {
    ...baseArgs,
    backgroundPalette: "color-5",
    imagePosition: "left",
  },
};

/** No image: full-width content column only (image and alt optional in CMS). */
export const ContentOnlyNoImage: Story = {
  args: {
    imageSrc: undefined,
    imageAlt: undefined,
    title: "Title without a hero image.",
    description: "Use this when you want the split hero layout styling with text and CTAs only.",
    backgroundPalette: "color-1",
    imagePosition: "left",
    ctas: [
      { href: "/programs", label: "Explore programs" },
      { href: "/contact", label: "Contact" },
    ],
  },
};
