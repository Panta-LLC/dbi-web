import type { ContactFormFieldDef } from "@/lib/contact-form-fields";
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
      successMessage?: string;
      formLayout: "legacy";
      placeholders: ContactPlaceholders;
      submitLabel: string;
    }
  | {
      kind: "contactForm";
      formId: string;
      triggerLabel: string;
      presentation: Presentation;
      messageContext?: string;
      title?: string;
      description?: string;
      successMessage?: string;
      formLayout: "dynamic";
      contactFormDefinitionId: string;
      dynamicFields: ContactFormFieldDef[];
      submitLabel: string;
    };
