import type { Meta, StoryObj } from "@storybook/react";
import { PageIntro } from "@/components/PageIntro";

const meta: Meta<typeof PageIntro> = {
  title: "Components/PageIntro",
  component: PageIntro,
};

export default meta;
type Story = StoryObj<typeof PageIntro>;

export const Default: Story = {
  args: {
    title: "About Us",
    lead: "We partner with schools, families, and communities to support African American students.",
    description:
      "Our work strengthens mentorship, advocacy, and culturally responsive programs that build confidence and academic success.",
  },
};
