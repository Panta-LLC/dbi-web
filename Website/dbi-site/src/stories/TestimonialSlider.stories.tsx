import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TestimonialSlider } from "@/components/TestimonialSlider";

const sampleItems = [
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
];

const meta: Meta<typeof TestimonialSlider> = {
  title: "Components/TestimonialSlider",
  component: TestimonialSlider,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-width testimonial strip with prev/next controls, transition modes, dot pagination, optional autoplay, and progress bar. Details in TSDoc on `TestimonialSlider.tsx`.",
      },
    },
  },
  argTypes: {
    items: {
      description:
        "Slides (`quote`, optional `attribution`). Omit or pass an empty array to use built-in default copy.",
      control: "object",
    },
    className: {
      description: "Extra classes on the outer section wrapper.",
      control: "text",
    },
    transition: {
      description: "Enter animation when the slide changes.",
      control: "select",
      options: ["fade", "slide", "scale", "blur"],
    },
    transitionDurationMs: {
      description: "Animation duration in milliseconds.",
      control: { type: "number", min: 300, max: 2000, step: 20 },
    },
    autoPlayMs: {
      description:
        "If set, advances after this many ms (hover pauses). Progress bar shows when combined with `showProgress`.",
      control: { type: "number", min: 2000, max: 20000, step: 500 },
    },
    showPagination: {
      description: "Dot navigation (default: on when there is more than one slide).",
      control: "boolean",
    },
    showProgress: {
      description: "Linear autoplay timer bar (default: on when `autoPlayMs` is set).",
      control: "boolean",
    },
    carousel: {
      description: "Sanity `carouselSettings` (transition, duration, autoplay, dots, progress).",
      control: "object",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TestimonialSlider>;

export const Default: Story = {
  args: {},
};

export const Multiple: Story = {
  args: {
    items: sampleItems,
  },
};

export const TransitionSlide: Story = {
  name: "Transition: slide",
  args: {
    items: sampleItems,
    transition: "slide",
    transitionDurationMs: 680,
  },
};

export const TransitionScale: Story = {
  name: "Transition: scale",
  args: {
    items: sampleItems,
    transition: "scale",
  },
};

export const TransitionBlur: Story = {
  name: "Transition: blur",
  args: {
    items: sampleItems,
    transition: "blur",
    transitionDurationMs: 720,
  },
};

export const AutoplayWithProgress: Story = {
  name: "Autoplay + progress",
  args: {
    items: sampleItems,
    transition: "fade",
    autoPlayMs: 8000,
    showProgress: true,
    showPagination: true,
  },
};
