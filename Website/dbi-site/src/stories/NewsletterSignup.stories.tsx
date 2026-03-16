import type { Meta, StoryObj } from "@storybook/react";
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
    placeholder: "Enter your email",
    buttonLabel: "Subscribe",
  },
};
