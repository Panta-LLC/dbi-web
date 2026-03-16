import type { Meta, StoryObj } from "@storybook/react";
import { TestimonialSlider } from "@/components/TestimonialSlider";

const meta: Meta<typeof TestimonialSlider> = {
  title: "Components/TestimonialSlider",
  component: TestimonialSlider,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TestimonialSlider>;

export const Default: Story = {
  args: {},
};

export const Multiple: Story = {
  args: {
    items: [
      {
        quote: "Delta Bay Impact has changed my life. The mentors have helped me tremendously.",
        attribution: "- Former Mentee",
      },
      {
        quote: "A truly transformative experience for our family. We are grateful for this community.",
        attribution: "- Parent",
      },
      {
        quote: "The programs here open doors. I would not be where I am today without DBI.",
        attribution: "- Program Graduate",
      },
    ],
  },
};
