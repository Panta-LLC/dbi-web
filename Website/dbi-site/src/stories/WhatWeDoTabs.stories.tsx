import type { Meta, StoryObj } from "@storybook/react";
import { WhatWeDoTabs } from "@/components/WhatWeDoTabs";
import { whatWeDoItems } from "@/data/siteContent";

const meta: Meta<typeof WhatWeDoTabs> = {
  title: "Components/WhatWeDoTabs",
  component: WhatWeDoTabs,
};

export default meta;
type Story = StoryObj<typeof WhatWeDoTabs>;

export const Default: Story = {
  args: {
    items: whatWeDoItems,
  },
};
