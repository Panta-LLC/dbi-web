"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/Button";
import { FormModalShell } from "@/components/cta-modal-form";
import type { NewsletterAudience } from "@/lib/newsletter-audiences";

type NewsletterAudiencePickerProps = {
  audiences: NewsletterAudience[];
  triggerLabel: string;
  title?: string;
  description?: string;
  className?: string;
  defaultOpen?: boolean;
};

/**
 * Two-step newsletter signup: the visitor picks the audience that fits them,
 * then completes that audience's Network for Good signup form (embedded).
 */
export function NewsletterAudiencePicker({
  audiences,
  triggerLabel,
  title = "Sign up for updates",
  description,
  className = "",
  defaultOpen = false,
}: NewsletterAudiencePickerProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selected = audiences.find((a) => a.key === selectedKey) ?? null;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setSelectedKey(null);
  };

  return (
    <FormModalShell
      presentation={{ mode: "dialog", placement: "center" }}
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        <Button type="button" variant="cta-primary" className={`touch-target ${className}`.trim()}>
          {triggerLabel}
        </Button>
      }
      title={title}
      description={
        selected
          ? `Signing up as: ${selected.label}`
          : (description ?? "Which best describes you? We'll send the updates that fit.")
      }
    >
      {selected?.formUrl ? (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setSelectedKey(null)}
            className="inline-flex w-fit items-center gap-1 text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Choose a different option
          </button>
          <iframe
            key={selected.key}
            src={selected.formUrl}
            title={`Newsletter signup — ${selected.label}`}
            className="h-[min(60vh,420px)] w-full rounded-lg border border-slate-200"
          />
          <a
            href={selected.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-slate-500 underline-offset-4 hover:text-slate-800 hover:underline"
          >
            Form not loading? Open it in a new tab
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      ) : (
        <ul className="flex flex-col gap-3" aria-label="Choose how you identify">
          {audiences.map((a) => (
            <li key={a.key}>
              <button
                type="button"
                onClick={() => setSelectedKey(a.key)}
                className="group flex w-full items-center justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3 text-left transition hover:border-[color:var(--color-2,#ff7900)] hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-2,#ff7900)]"
              >
                <span>
                  <span className="block font-semibold text-slate-900">{a.label}</span>
                  {a.description ? (
                    <span className="mt-0.5 block text-sm text-slate-600">{a.description}</span>
                  ) : null}
                </span>
                <ChevronRight
                  className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700"
                  aria-hidden
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </FormModalShell>
  );
}
