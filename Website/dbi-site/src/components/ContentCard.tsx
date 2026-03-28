"use client";

import { CtaModalForm } from "@/components/cta-modal-form";
import type { GridCardCtaResolved } from "@/lib/grid-card-cta";
import { Button } from "./Button";

type ContentCardProps = {
  title: string;
  description?: string;
  cta?: GridCardCtaResolved;
  className?: string;
};

export function ContentCard({ title, description, cta, className = "" }: ContentCardProps) {
  return (
    <div className={`content-card bg-white p-10 px-13 relative ${className}`}>
      <h3 className="display-s text-slate-900">{title}</h3>
      {description ? (
        <p className="mt-3 text-md whitespace-pre-line text-slate-700">{description}</p>
      ) : null}
      {cta ? (
        <div className="mt-6">
          {cta.kind === "link" ? (
            <Button href={cta.href} variant="cta-primary" className="px-4 py-2">
              {cta.label}
            </Button>
          ) : (
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
              triggerVariant="cta-primary"
              className="px-4 py-2"
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
