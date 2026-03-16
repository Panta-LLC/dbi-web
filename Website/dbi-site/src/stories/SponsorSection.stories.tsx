import type { Meta, StoryObj } from "@storybook/react";
import { SponsorSection } from "@/components/SponsorSection";

const meta: Meta<typeof SponsorSection> = {
  title: "Components/SponsorSection",
  component: SponsorSection,
};

export default meta;
type Story = StoryObj<typeof SponsorSection>;

const defaultItems = [
  { name: "Community Health Fund", tagline: "John Muir Health · Building Bridges to Better Health" },
  { name: "Keller Canyon Mitigation Fund" },
  { name: "Antioch Community Foundation" },
];

export const Default: Story = {
  args: {
    titleLine1: "Special Thanks to",
    titleLine2: "Our Sponsors",
    items: defaultItems,
  },
};

export const WithLogos: Story = {
  args: {
    titleLine1: "Special Thanks to",
    titleLine2: "Our Sponsors",
    items: [
      { name: "Community Health Fund", logoSrc: "https://picsum.photos/180/90?random=1", tagline: "Building Bridges to Better Health" },
      { name: "Keller Canyon Mitigation Fund", logoSrc: "https://picsum.photos/180/90?random=2" },
      { name: "Antioch Community Foundation", logoSrc: "https://picsum.photos/180/90?random=3" },
    ],
  },
};

export const Carousel: Story = {
  args: {
    titleLine1: "Special Thanks to",
    titleLine2: "Our Sponsors",
    items: [
      ...defaultItems,
      { name: "Fourth Sponsor" },
      { name: "Fifth Sponsor" },
    ],
  },
};
