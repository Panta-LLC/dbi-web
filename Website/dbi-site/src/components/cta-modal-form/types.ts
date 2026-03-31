import type { ReactNode } from "react";
import type { ButtonVariant } from "@/components/Button";

export type ContactFieldVariant = "default" | "newsletter";

export type Presentation =
  | { mode: "dialog"; placement?: "center" }
  | { mode: "slide"; edge: "bottom" | "top" | "left" | "right" }
  | { mode: "popover"; side?: "top" | "bottom" | "left" | "right"; align?: "start" | "center" | "end" };

export type ContactPlaceholders = {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  /** If omitted, a contextual hint is generated from `triggerLabel` and `messageContext`. */
  message?: string;
};

export type CtaModalFormProps = {
  presentation: Presentation;
  /** Identifies the submission in email body and routing */
  formId: string;
  triggerLabel: string;
  /**
   * When set, used as the modal trigger instead of the default Button (e.g. full program card surface).
   * Must be a single element that accepts a ref (e.g. forwardRef div) for Radix Dialog.
   */
  customTrigger?: ReactNode;
  /**
   * Where this form is used (page, section, or feature), e.g. "Impact page — stats band".
   * Shapes the default message field placeholder and is included in the outbound email.
   */
  messageContext?: string;
  title?: string;
  description?: string;
  placeholders: ContactPlaceholders;
  submitLabel: string;
  successMessage?: string;
  triggerVariant?: ButtonVariant;
  className?: string;
  /** Useful for Storybook or deep-link previews */
  defaultOpen?: boolean;
  /** Newsletter: first/last/email + self-identification; hides org and message. */
  fieldVariant?: ContactFieldVariant;
};
