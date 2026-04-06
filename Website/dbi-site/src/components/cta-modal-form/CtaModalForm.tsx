"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { ContactFormFields } from "./ContactFormFields";
import { FormModalShell } from "./FormModalShell";
import { resolveContactMessagePlaceholder } from "./messagePlaceholder";
import type { CtaModalFormProps } from "./types";

const defaultPlaceholders = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  organization: "Organization",
};

export function CtaModalForm({
  presentation,
  formId,
  triggerLabel,
  messageContext,
  title,
  description,
  placeholders,
  submitLabel,
  successMessage,
  triggerVariant = "cta-primary",
  className = "",
  defaultOpen = false,
  customTrigger,
  fieldVariant = "default",
  contactFormDefinitionId,
  dynamicFields,
}: CtaModalFormProps) {
  const [open, setOpen] = useState(defaultOpen);

  const isDynamic = Boolean(contactFormDefinitionId?.trim() && dynamicFields && dynamicFields.length > 0);

  const mergedPlaceholders =
    isDynamic || !placeholders
      ? undefined
      : {
          ...defaultPlaceholders,
          ...placeholders,
          message:
            fieldVariant === "newsletter"
              ? ""
              : resolveContactMessagePlaceholder(
                  triggerLabel,
                  messageContext,
                  placeholders.message,
                ),
        };

  const trigger =
    customTrigger ??
    (
      <Button type="button" variant={triggerVariant} className={`touch-target ${className}`.trim()}>
        {triggerLabel}
      </Button>
    );

  return (
    <FormModalShell
      presentation={presentation}
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title={title}
      description={description}
    >
      <ContactFormFields
        formId={formId}
        triggerLabel={triggerLabel}
        messageContext={messageContext}
        placeholders={mergedPlaceholders}
        submitLabel={submitLabel}
        successMessage={successMessage}
        fieldVariant={fieldVariant}
        onSuccess={() => {
          window.setTimeout(() => setOpen(false), 2000);
        }}
        contactFormDefinitionId={contactFormDefinitionId}
        dynamicFields={dynamicFields}
      />
    </FormModalShell>
  );
}
