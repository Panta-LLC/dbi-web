import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const meta: Meta<typeof NewsletterSignup> = {
  title: "Components/NewsletterSignup",
  component: NewsletterSignup,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof NewsletterSignup>;

export const Default: Story = {
  args: {},
};

export const WithImage: Story = {
  args: {
    imageSrc: "https://picsum.photos/800/500",
    imageAlt: "Community gathering",
  },
};

export const CustomContent: Story = {
  args: {
    title: "Stay in the loop!",
    description: "Get the latest news and stories from our community.",
    buttonLabel: "Subscribe",
  },
};

const sampleAudiences = [
  { key: "parent", label: "Parent or Guardian", description: "Updates on programs and events for your student.", formUrl: "https://example.org/" },
  { key: "community", label: "Community Member", description: "News and ways to get involved.", formUrl: "https://example.org/" },
  { key: "donor", label: "Donor", description: "Impact stories and giving updates.", formUrl: "https://example.org/" },
  { key: "partner", label: "Partner or Volunteer", description: "Opportunities for schools, organizations, and volunteers.", formUrl: "https://example.org/" },
];

/** Audience picker → embedded Network for Good form (placeholder URLs). */
export const WithAudiences: Story = {
  args: {
    audiences: sampleAudiences,
  },
};
