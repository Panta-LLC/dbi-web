import type { ContactPlaceholders, Presentation } from "@/components/cta-modal-form/types";
import {
  isDynamicContactFormDefinition,
  normalizeContactFormFieldDefinitions,
  type ContactFormFieldDef,
} from "@/lib/contact-form-fields";

/** Raw shape from GROQ — referenced Contact Form document. */
export type SanityContactFormDefinitionRef = {
  _id?: string | null;
  adminTitle?: string | null;
  submitLabel?: string | null;
  fieldDefinitions?: unknown;
  fields?: {
    firstNamePlaceholder?: string | null;
    lastNamePlaceholder?: string | null;
    emailPlaceholder?: string | null;
    organizationPlaceholder?: string | null;
    messagePlaceholder?: string | null;
    submitLabel?: string | null;
  } | null;
};

/** Raw shape from GROQ — Contact CTA document (contact page list, etc.) */
export type SanityContactFormPreset = {
  _id?: string | null;
  listLabel?: string | null;
  listDescription?: string | null;
  label?: string | null;
  formId?: string | null;
  messageContext?: string | null;
  modalTitle?: string | null;
  modalDescription?: string | null;
  presentation?: string | null;
  successMessage?: string | null;
  contactFormDefinition?: SanityContactFormDefinitionRef | null;
};

/** Raw shape from GROQ (program CTA or card CTA) */
export type SanityCtaAction = {
  kind?: string | null;
  label?: string | null;
  href?: string | null;
  formId?: string | null;
  messageContext?: string | null;
  modalTitle?: string | null;
  modalDescription?: string | null;
  presentation?: string | null;
  successMessage?: string | null;
  contactForm?: {
    firstNamePlaceholder?: string | null;
    lastNamePlaceholder?: string | null;
    emailPlaceholder?: string | null;
    organizationPlaceholder?: string | null;
    messagePlaceholder?: string | null;
    submitLabel?: string | null;
  } | null;
  contactFormRef?: SanityContactFormDefinitionRef | null;
};

export type ResolvedSanityContactFormCta =
  | {
      mode: "legacy";
      formId: string;
      triggerLabel: string;
      messageContext?: string;
      modalTitle?: string;
      modalDescription?: string;
      presentation?: string;
      successMessage?: string;
      contactForm: NonNullable<SanityCtaAction["contactForm"]>;
      submitLabel: string;
    }
  | {
      mode: "dynamic";
      formId: string;
      triggerLabel: string;
      messageContext?: string;
      modalTitle?: string;
      modalDescription?: string;
      presentation?: string;
      successMessage?: string;
      contactFormDefinitionId: string;
      dynamicFieldDefinitions: ContactFormFieldDef[];
      submitLabel: string;
    };

export function presentationFromSanity(value: string | null | undefined): Presentation {
  switch (value) {
    case "slideBottom":
      return { mode: "slide", edge: "bottom" };
    case "slideTop":
      return { mode: "slide", edge: "top" };
    case "slideLeft":
      return { mode: "slide", edge: "left" };
    case "slideRight":
      return { mode: "slide", edge: "right" };
    case "popover":
      return { mode: "popover", side: "bottom", align: "center" };
    default:
      return { mode: "dialog" };
  }
}

export function contactFormPlaceholdersFromSanity(
  cf: NonNullable<SanityCtaAction["contactForm"]>,
): ContactPlaceholders {
  return {
    firstName: cf.firstNamePlaceholder?.trim() || "First name",
    lastName: cf.lastNamePlaceholder?.trim() || "Last name",
    email: cf.emailPlaceholder?.trim() || "Email",
    organization: cf.organizationPlaceholder?.trim() || "Organization",
    message:
      cf.messagePlaceholder?.trim() !== ""
        ? cf.messagePlaceholder?.trim()
        : undefined,
  };
}

function resolveFromContactFormDefinitionRef(
  ref: SanityContactFormDefinitionRef | null | undefined,
  cta: SanityCtaAction,
): ResolvedSanityContactFormCta | null {
  if (!ref?._id) return null;
  const formId = typeof cta.formId === "string" ? cta.formId.trim() : "";
  const triggerLabel = cta.label?.trim() || "";
  if (!formId || !triggerLabel) return null;

  const base = {
    formId,
    triggerLabel,
    messageContext: cta.messageContext ?? undefined,
    modalTitle: cta.modalTitle ?? undefined,
    modalDescription: cta.modalDescription ?? undefined,
    presentation: cta.presentation ?? undefined,
    successMessage: cta.successMessage ?? undefined,
  };

  if (isDynamicContactFormDefinition(ref)) {
    const defs = normalizeContactFormFieldDefinitions(ref.fieldDefinitions);
    if (defs.length === 0) return null;
    const submitLabel = ref.submitLabel?.trim() || "";
    if (!submitLabel) return null;
    return {
      mode: "dynamic",
      ...base,
      contactFormDefinitionId: ref._id,
      dynamicFieldDefinitions: defs,
      submitLabel,
    };
  }

  const legacy = ref.fields;
  if (!legacy) return null;
  return {
    mode: "legacy",
    ...base,
    contactForm: legacy,
    submitLabel: legacy.submitLabel?.trim() || "Send",
  };
}

/**
 * Merge inline contact-form fields with an optional referenced **Contact Form** document.
 */
export function resolveSanityContactFormCta(
  cta: SanityCtaAction | null | undefined,
): ResolvedSanityContactFormCta | null {
  if (!cta || cta.kind !== "contactForm") return null;

  const fromRef = resolveFromContactFormDefinitionRef(cta.contactFormRef, cta);
  if (fromRef) return fromRef;

  const formId = typeof cta.formId === "string" ? cta.formId.trim() : "";
  const triggerLabel = typeof cta.label === "string" ? cta.label.trim() : "";
  if (!formId || !triggerLabel || !cta.contactForm) return null;

  return {
    mode: "legacy",
    formId,
    triggerLabel,
    messageContext: cta.messageContext ?? undefined,
    modalTitle: cta.modalTitle ?? undefined,
    modalDescription: cta.modalDescription ?? undefined,
    presentation: cta.presentation ?? undefined,
    successMessage: cta.successMessage ?? undefined,
    contactForm: cta.contactForm,
    submitLabel: cta.contactForm.submitLabel?.trim() || "Send",
  };
}

export function isContactFormCta(cta: SanityCtaAction | null | undefined): boolean {
  return resolveSanityContactFormCta(cta) !== null;
}

export function isLinkCta(
  cta: SanityCtaAction | null | undefined,
): cta is SanityCtaAction & { label: string; href: string } {
  if (!cta) return false;
  const kind = cta.kind ?? "link";
  if (kind === "contactForm") return false;
  const href = typeof cta.href === "string" ? cta.href.trim() : "";
  const label = typeof cta.label === "string" ? cta.label.trim() : "";
  return Boolean(href && label);
}
