"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/Button";
import { FormModalShell } from "@/components/cta-modal-form";
import {
  findAudienceForJoinParam,
  NEWSLETTER_JOIN_PARAM,
  type NewsletterAudience,
} from "@/lib/newsletter-audiences";

type NewsletterAudiencePickerProps = {
  audiences: NewsletterAudience[];
  triggerLabel: string;
  title?: string;
  description?: string;
  className?: string;
  defaultOpen?: boolean;
};

const subscribeNoop = () => () => {};

/** `?join` value on the current URL: `null` when absent, `""` for a bare `?join`. */
function readJoinParam(): string | null {
  return new URLSearchParams(window.location.search).get(NEWSLETTER_JOIN_PARAM);
}

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
  const join = useSyncExternalStore(subscribeNoop, readJoinParam, () => null);
  const [open, setOpen] = useState(defaultOpen);
  const [joinDismissed, setJoinDismissed] = useState(false);
  /** `undefined` until the visitor picks or goes back; then their choice wins over the invite link. */
  const [choice, setChoice] = useState<string | null | undefined>(undefined);

  // Invite links: `?join=parent` opens the dialog on that audience's form; a bare `?join` opens the picker.
  const joinActive = join !== null && !joinDismissed;
  const joinMatch = joinActive ? findAudienceForJoinParam(audiences, join) : undefined;
  const selectedKey = choice !== undefined ? choice : joinMatch?.formUrl ? joinMatch.key : null;
  const selected = audiences.find((a) => a.key === selectedKey) ?? null;
  const isOpen = open || joinActive;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setChoice(undefined);
      setJoinDismissed(true);
    }
  };

  return (
    <FormModalShell
      presentation={{ mode: "dialog", placement: "center" }}
      tone="brand"
      open={isOpen}
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
            onClick={() => setChoice(null)}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Choose a different option
          </button>
          <iframe
            key={selected.key}
            src={selected.formUrl}
            title={`Newsletter signup — ${selected.label}`}
            className="h-[min(50vh,340px)] w-full border-l-4 border-[color:var(--color-2,#ff7900)] bg-white"
          />
          <a
            href={selected.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[color:var(--color-5,#435963)] underline-offset-4 hover:text-primary hover:underline"
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
                onClick={() => setChoice(a.key)}
                className="group flex w-full items-center justify-between gap-4 border border-l-4 border-[color:var(--color-7,#b9d9f7)] border-l-primary bg-white px-4 py-3.5 text-left transition hover:border-[color:var(--color-2,#ff7900)] hover:border-l-[color:var(--color-2,#ff7900)] hover:bg-[color:var(--color-8,#f7ecd7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-2,#ff7900)] focus-visible:ring-offset-2"
              >
                <span>
                  <span className="block font-semibold text-[color:var(--color-4,#25405a)]">{a.label}</span>
                  {a.description ? (
                    <span className="mt-0.5 block text-sm text-[color:var(--color-5,#435963)]">{a.description}</span>
                  ) : null}
                </span>
                <ChevronRight
                  className="h-5 w-5 shrink-0 text-primary transition group-hover:translate-x-1 group-hover:text-[color:var(--color-2,#ff7900)]"
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
