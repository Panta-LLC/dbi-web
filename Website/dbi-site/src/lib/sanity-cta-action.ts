import type { ContactPlaceholders, Presentation } from "@/components/cta-modal-form/types";

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

export function isContactFormCta(
  cta: SanityCtaAction | null | undefined,
): cta is SanityCtaAction & {
  kind: "contactForm";
  formId: string;
  label: string;
  contactForm: NonNullable<SanityCtaAction["contactForm"]>;
} {
  if (!cta || cta.kind !== "contactForm") return false;
  const formId = typeof cta.formId === "string" ? cta.formId.trim() : "";
  const label = typeof cta.label === "string" ? cta.label.trim() : "";
  if (!formId || !label || !cta.contactForm) return false;
  return true;
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
