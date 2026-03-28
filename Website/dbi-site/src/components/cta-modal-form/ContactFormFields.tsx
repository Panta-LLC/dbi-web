"use client";

import { useId, useState } from "react";
import { Button } from "@/components/Button";
import { CONTACT_API_PATH, validateContactBody } from "@/lib/contact-submission";
import type { ContactPlaceholders } from "./types";

type ContactFormFieldsProps = {
  formId: string;
  triggerLabel: string;
  messageContext?: string;
  placeholders: ContactPlaceholders & { message: string };
  submitLabel: string;
  successMessage?: string;
  onSuccess?: () => void;
};

export function ContactFormFields({
  formId,
  triggerLabel,
  messageContext,
  placeholders,
  submitLabel,
  successMessage = "Thanks — your message has been sent.",
  onSuccess,
}: ContactFormFieldsProps) {
  const baseId = useId();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
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
      organization,
      message,
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
