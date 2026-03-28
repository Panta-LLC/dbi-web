import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect } from "react";
import { CtaModalForm } from "@/components/cta-modal-form";

const placeholders = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email address",
  organization: "Organization (optional)",
};

const meta: Meta<typeof CtaModalForm> = {
  title: "Components/CtaModalForm",
  component: CtaModalForm,
  parameters: {
    layout: "centered",
  },
  args: {
    formId: "story-demo",
    triggerLabel: "Contact us",
    /** Drives the default message placeholder and appears in the outbound email. */
    messageContext: "Storybook — Components/CtaModalForm",
    title: "Send a message",
    description: "We will respond as soon as we can.",
    placeholders,
    submitLabel: "Send message",
    defaultOpen: false,
  },
};

export default meta;
type Story = StoryObj<typeof CtaModalForm>;

function MockContactApi({
  children,
  behave,
}: {
  children: React.ReactNode;
  behave: "ok" | "error";
}) {
  useEffect(() => {
    const orig = global.fetch.bind(global);
    global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof Request
            ? input.url
            : String(input);
      if (url.includes("/api/contact")) {
        if (behave === "error") {
          return new Response(JSON.stringify({ error: "Something went wrong." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(
          JSON.stringify({ message: "Thanks — your message has been sent." }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return orig(input, init);
    };
    return () => {
      global.fetch = orig;
    };
  }, [behave]);
  return <>{children}</>;
}

export const DialogClosed: Story = {
  args: {
    presentation: { mode: "dialog" },
    defaultOpen: false,
  },
};

export const DialogOpen: Story = {
  args: {
    presentation: { mode: "dialog" },
    defaultOpen: true,
  },
};

export const SlideFromBottom: Story = {
  args: {
    presentation: { mode: "slide", edge: "bottom" },
    defaultOpen: true,
  },
};

export const SlideFromTop: Story = {
  args: {
    presentation: { mode: "slide", edge: "top" },
    defaultOpen: true,
  },
};

export const SlideFromLeft: Story = {
  args: {
    presentation: { mode: "slide", edge: "left" },
    defaultOpen: true,
  },
};

export const SlideFromRight: Story = {
  args: {
    presentation: { mode: "slide", edge: "right" },
    defaultOpen: true,
  },
};

export const Popover: Story = {
  args: {
    presentation: { mode: "popover", side: "bottom", align: "center" },
    defaultOpen: true,
  },
};

export const SubmitSuccessMocked: Story = {
  decorators: [
    (Story) => (
      <MockContactApi behave="ok">
        <Story />
      </MockContactApi>
    ),
  ],
  args: {
    presentation: { mode: "dialog" },
    defaultOpen: true,
  },
};

export const SubmitErrorMocked: Story = {
  decorators: [
    (Story) => (
      <MockContactApi behave="error">
        <Story />
      </MockContactApi>
    ),
  ],
  args: {
    presentation: { mode: "dialog" },
    defaultOpen: true,
  },
};

/** Custom `placeholders.message` overrides the contextual default. */
export const ExplicitMessagePlaceholder: Story = {
  args: {
    presentation: { mode: "dialog" },
    defaultOpen: true,
    messageContext: "Get involved page",
    placeholders: {
      ...placeholders,
      message: "Tell us how you’d like to volunteer (custom placeholder).",
    },
  },
};
