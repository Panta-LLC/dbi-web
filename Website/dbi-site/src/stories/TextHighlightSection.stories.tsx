import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextHighlightSection } from "@/components/TextHighlightSection";

const meta: Meta<typeof TextHighlightSection> = {
  title: "Components/TextHighlightSection",
  component: TextHighlightSection,
};

export default meta;
type Story = StoryObj<typeof TextHighlightSection>;

export const Default: Story = {
  args: {
    text: "We connect community resources with African American youth and families in West Contra Costa County so every young person can thrive.",
  },
};

export const MultipleSlides: Story = {
  args: {
    items: [
      { text: "We connect community resources with African American youth and families in West Contra Costa County so every young person can thrive." },
      { text: "Second highlight line for carousel demos and multi-slide content from Sanity." },
    ],
    carousel: {
      transition: "fade",
      transitionDurationMs: 680,
      showPagination: true,
      showProgress: false,
    },
  },
};

export const CustomContent: Story = {
  args: {
    children: (
      <p className="display-m font-semibold max-w-3xl text-balance text-center">
        Custom highlight content can be passed as children instead of text.
      </p>
    ),
  },
};
