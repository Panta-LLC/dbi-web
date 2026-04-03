"use client";

import { CtaModalForm } from "@/components/cta-modal-form";
import type { ButtonVariant } from "@/components/Button";
import type { GridCardCtaResolved } from "@/lib/grid-card-cta";
import { Button } from "./Button";

type GridCardCtaTriggerProps = {
  cta: GridCardCtaResolved;
  /** Passed to `Button` / modal trigger (padding and text size differ by card layout). */
  className?: string;
  triggerVariant?: ButtonVariant;
};

/** Shared link button vs contact-modal branch for grid cards (`ContentCard`, `ImageCard`). */
export function GridCardCtaTrigger({
  cta,
  className,
  triggerVariant = "cta-primary",
}: GridCardCtaTriggerProps) {
  if (cta.kind === "link") {
    return (
      <Button href={cta.href} variant={triggerVariant} className={className}>
        {cta.label}
      </Button>
    );
  }
  return (
    <CtaModalForm
      presentation={cta.presentation}
      formId={cta.formId}
      triggerLabel={cta.triggerLabel}
      messageContext={cta.messageContext}
      title={cta.title}
      description={cta.description}
      placeholders={cta.placeholders}
      submitLabel={cta.submitLabel}
      successMessage={cta.successMessage}
      triggerVariant={triggerVariant}
      className={className}
    />
  );
}
