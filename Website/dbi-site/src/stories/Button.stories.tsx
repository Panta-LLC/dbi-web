import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const CtaPrimary: Story = {
  args: {
    children: "Join a DBI program",
    href: "/programs",
    variant: "cta-primary",
  },
};

export const CtaSecondary: Story = {
  args: {
    children: "Donate or partner",
    href: "/donate",
    variant: "cta-secondary",
  },
};

export const CtaHero: Story = {
  args: {
    children: "Learn more",
    href: "/about",
    variant: "cta-hero",
  },
};

export const NavPrimary: Story = {
  args: {
    children: "Donate",
    href: "/donate",
    variant: "nav-primary",
  },
};

export const NavSecondary: Story = {
  args: {
    children: "Impact stories",
    href: "/impact",
    variant: "nav-secondary",
  },
};

