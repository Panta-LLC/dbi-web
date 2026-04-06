"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import type { ContactFormFieldDef } from "@/lib/contact-form-fields";
import {
  CONTACT_API_PATH,
  NEWSLETTER_SELF_IDENTIFICATION_OPTIONS,
  validateContactBody,
  validateDynamicContactBody,
} from "@/lib/contact-submission";
import type { ContactFieldVariant, ContactPlaceholders } from "./types";

type ContactFormFieldsProps = {
  formId: string;
  triggerLabel: string;
  messageContext?: string;
  placeholders?: ContactPlaceholders & { message: string };
  submitLabel: string;
  successMessage?: string;
  fieldVariant?: ContactFieldVariant;
  onSuccess?: () => void;
  /** When set with `dynamicFields`, renders CMS-defined fields and posts a dynamic payload. */
  contactFormDefinitionId?: string;
  dynamicFields?: ContactFormFieldDef[];
};

export function ContactFormFields({
  formId,
  triggerLabel,
  messageContext,
  placeholders,
  submitLabel,
  successMessage = "Thanks — your message has been sent.",
  fieldVariant = "default",
  onSuccess,
  contactFormDefinitionId,
  dynamicFields,
}: ContactFormFieldsProps) {
  const isDynamic =
    fieldVariant !== "newsletter" &&
    Boolean(
      contactFormDefinitionId?.trim() &&
        dynamicFields &&
        dynamicFields.length > 0,
    );

  if (isDynamic && contactFormDefinitionId && dynamicFields?.length) {
    return (
      <DynamicContactFormFields
        formId={formId}
        triggerLabel={triggerLabel}
        messageContext={messageContext}
        contactFormDefinitionId={contactFormDefinitionId}
        dynamicFields={dynamicFields}
        submitLabel={submitLabel}
        successMessage={successMessage}
        onSuccess={onSuccess}
      />
    );
  }

  if (!placeholders) {
    return null;
  }

  return (
    <LegacyContactFormFields
      formId={formId}
      triggerLabel={triggerLabel}
      messageContext={messageContext}
      placeholders={placeholders}
      submitLabel={submitLabel}
      successMessage={successMessage}
      fieldVariant={fieldVariant}
      onSuccess={onSuccess}
    />
  );
}

function DynamicContactFormFields({
  formId,
  triggerLabel,
  messageContext,
  contactFormDefinitionId,
  dynamicFields,
  submitLabel,
  successMessage,
  onSuccess,
}: {
  formId: string;
  triggerLabel: string;
  messageContext?: string;
  contactFormDefinitionId: string;
  dynamicFields: ContactFormFieldDef[];
  submitLabel: string;
  successMessage: string;
  onSuccess?: () => void;
}) {
  const baseId = useId();
  const initial = useMemo(
    () => Object.fromEntries(dynamicFields.map((f) => [f.name, ""])) as Record<string, string>,
    [dynamicFields],
  );
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const inputClass =
    "touch-target w-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-70";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    const payload = {
      formId,
      triggerLabel,
      ...(messageContext !== undefined && messageContext.trim() !== ""
        ? { messageContext: messageContext.trim() }
        : {}),
      contactFormDefinitionId,
      dynamicFields: values,
      website: honeypot,
    };

    const validated = validateDynamicContactBody(payload, dynamicFields);
    if (!validated.ok) {
      setStatus("error");
      setFeedback(validated.error);
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch(CONTACT_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.data),
      });

      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };

      if (res.ok) {
        setStatus("success");
        setFeedback(data.message ?? successMessage);
        setValues(initial);
        setHoneypot("");
        onSuccess?.();
      } else {
        setStatus("error");
        setFeedback(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setFeedback("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="relative flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      {dynamicFields.map((field, i) => {
        const id = `${baseId}-${field.name}-${i}`;
        const v = values[field.name] ?? "";
        const set = (next: string) => setValues((prev) => ({ ...prev, [field.name]: next }));

        if (field.fieldType === "textarea") {
          return (
            <div key={field.name}>
              <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-800">
                {field.label}
                {field.required ? <span className="text-red-600"> *</span> : null}
              </label>
              <textarea
                id={id}
                name={field.name}
                value={v}
                onChange={(e) => set(e.target.value)}
                placeholder={field.placeholder}
                disabled={status === "loading"}
                rows={field.rows ?? 5}
                className={`${inputClass} min-h-[100px] resize-y`}
              />
            </div>
          );
        }

        if (field.fieldType === "select") {
          const opts = field.selectOptions ?? [];
          return (
            <div key={field.name}>
              <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-800">
                {field.label}
                {field.required ? <span className="text-red-600"> *</span> : null}
              </label>
              <select
                id={id}
                name={field.name}
                value={v}
                onChange={(e) => set(e.target.value)}
                disabled={status === "loading"}
                className={`${inputClass} cursor-pointer pr-10`}
                autoComplete="off"
              >
                <option value="">{field.placeholder || "Select…"}</option>
                {opts.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        const inputType = field.fieldType === "email" ? "email" : "text";
        return (
          <div key={field.name}>
            <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-800">
              {field.label}
              {field.required ? <span className="text-red-600"> *</span> : null}
            </label>
            <input
              id={id}
              type={inputType}
              name={field.name}
              value={v}
              onChange={(e) => set(e.target.value)}
              placeholder={field.placeholder}
              disabled={status === "loading"}
              autoComplete={field.fieldType === "email" ? "email" : "on"}
              className={inputClass}
            />
          </div>
        );
      })}

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute h-px w-px -translate-x-[9999px] opacity-0"
        aria-hidden
      />

      {feedback ? (
        <p
          className={`text-sm ${status === "success" ? "text-green-800" : "text-red-700"}`}
          role="status"
        >
          {feedback}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="cta-primary"
        disabled={status === "loading"}
        className="touch-target w-full justify-center sm:w-auto disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}

function LegacyContactFormFields({
  formId,
  triggerLabel,
  messageContext,
  placeholders,
  submitLabel,
  successMessage,
  fieldVariant,
  onSuccess,
}: {
  formId: string;
  triggerLabel: string;
  messageContext?: string;
  placeholders: ContactPlaceholders & { message: string };
  submitLabel: string;
  successMessage: string;
  fieldVariant: ContactFieldVariant;
  onSuccess?: () => void;
}) {
  const baseId = useId();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [selfIdentification, setSelfIdentification] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const inputClass =
    "touch-target w-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-70";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    const payload = {
      formId,
      triggerLabel,
      ...(messageContext !== undefined && messageContext.trim() !== ""
        ? { messageContext: messageContext.trim() }
        : {}),
      firstName,
      lastName,
      email,
      organization: fieldVariant === "newsletter" ? "" : organization,
      selfIdentification: fieldVariant === "newsletter" ? selfIdentification : "",
      message: fieldVariant === "newsletter" ? "" : message,
      website: honeypot,
    };

    const validated = validateContactBody(payload);
    if (!validated.ok) {
      setStatus("error");
      setFeedback(validated.error);
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch(CONTACT_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.data),
      });

      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };

      if (res.ok) {
        setStatus("success");
        setFeedback(data.message ?? successMessage);
        setFirstName("");
        setLastName("");
        setEmail("");
        setOrganization("");
        setMessage("");
        setSelfIdentification("");
        setHoneypot("");
        onSuccess?.();
      } else {
        setStatus("error");
        setFeedback(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setFeedback("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="relative flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${baseId}-first`} className="sr-only">
            First name
          </label>
          <input
            id={`${baseId}-first`}
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={placeholders.firstName}
            disabled={status === "loading"}
            autoComplete="given-name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${baseId}-last`} className="sr-only">
            Last name
          </label>
          <input
            id={`${baseId}-last`}
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={placeholders.lastName}
            disabled={status === "loading"}
            autoComplete="family-name"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor={`${baseId}-email`} className="sr-only">
          Email
        </label>
        <input
          id={`${baseId}-email`}
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholders.email}
          disabled={status === "loading"}
          autoComplete="email"
          className={inputClass}
        />
      </div>
      {fieldVariant === "newsletter" ? (
        <div>
          <label htmlFor={`${baseId}-self-id`} className="sr-only">
            Self-identification
          </label>
          <select
            id={`${baseId}-self-id`}
            name="selfIdentification"
            value={selfIdentification}
            onChange={(e) => setSelfIdentification(e.target.value)}
            disabled={status === "loading"}
            className={`${inputClass} cursor-pointer pr-10`}
            autoComplete="off"
          >
            <option value="">{"I am a(n)..."}</option>
            {NEWSLETTER_SELF_IDENTIFICATION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {fieldVariant === "default" ? (
        <>
          <div>
            <label htmlFor={`${baseId}-org`} className="sr-only">
              Organization
            </label>
            <input
              id={`${baseId}-org`}
              type="text"
              name="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder={placeholders.organization}
              disabled={status === "loading"}
              autoComplete="organization"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`${baseId}-msg`} className="sr-only">
              Message
            </label>
            <textarea
              id={`${baseId}-msg`}
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={placeholders.message}
              disabled={status === "loading"}
              rows={5}
              className={`${inputClass} min-h-[120px] resize-y`}
            />
          </div>
        </>
      ) : null}

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute h-px w-px -translate-x-[9999px] opacity-0"
        aria-hidden
      />

      {feedback ? (
        <p
          className={`text-sm ${status === "success" ? "text-green-800" : "text-red-700"}`}
          role="status"
        >
          {feedback}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="cta-primary"
        disabled={status === "loading"}
        className="touch-target w-full justify-center sm:w-auto disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}
