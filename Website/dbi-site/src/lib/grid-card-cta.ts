import type { ContactPlaceholders, Presentation } from "@/components/cta-modal-form/types";

/** Resolved CTA for text or image grid cards (link button or contact modal). */
export type GridCardCtaResolved =
  | { kind: "link"; label: string; href: string }
  | {
      kind: "contactForm";
      formId: string;
      triggerLabel: string;
      presentation: Presentation;
      messageContext?: string;
      title?: string;
      description?: string;
      placeholders: ContactPlaceholders;
      submitLabel: string;
      successMessage?: string;
    };
