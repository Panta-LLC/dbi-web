"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { ContactFormFields } from "./ContactFormFields";
import { FormModalShell } from "./FormModalShell";
import type { CtaModalFormProps } from "./types";

const defaultPlaceholders = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  organization: "Organization",
};

function resolveMessagePlaceholder(
  triggerLabel: string,
  messageContext: string | undefined,
  explicit: string | undefined,
): string {
  if (explicit !== undefined && explicit.trim() !== "") {
    return explicit;
  }
  if (messageContext !== undefined && messageContext.trim() !== "") {
    return `What would you like to share? You used “${triggerLabel}” from ${messageContext.trim()}.`;
  }
  return `What would you like to share? You used “${triggerLabel}” from this page.`;
}

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
}: CtaModalFormProps) {
  const [open, setOpen] = useState(defaultOpen);

  const mergedPlaceholders = {
    ...defaultPlaceholders,
    ...placeholders,
    message: resolveMessagePlaceholder(triggerLabel, messageContext, placeholders.message),
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
        onSuccess={() => {
          window.setTimeout(() => setOpen(false), 2000);
        }}
      />
    </FormModalShell>
  );
}
