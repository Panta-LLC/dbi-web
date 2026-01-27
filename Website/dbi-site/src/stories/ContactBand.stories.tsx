import type { Meta, StoryObj } from "@storybook/react";
import { ContactBand } from "@/components/ContactBand";

const meta: Meta<typeof ContactBand> = {
  title: "Components/ContactBand",
  component: ContactBand,
};

export default meta;
type Story = StoryObj<typeof ContactBand>;

export const Default: Story = {
  args: {
    title: "Contact",
  },
};
