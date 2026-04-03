"use client";

import type { GridCardCtaResolved } from "@/lib/grid-card-cta";
import { GridCardCtaTrigger } from "./GridCardCtaTrigger";

type ContentCardProps = {
  title: string;
  description?: string;
  cta?: GridCardCtaResolved;
  className?: string;
};

export function ContentCard({ title, description, cta, className = "" }: ContentCardProps) {
  return (
    <div className={`content-card bg-white p-10 px-13 relative ${className}`}>
      <h3 className="heading-3 text-slate-900">{title}</h3>
      {description ? (
        <p className="mt-3 body-md whitespace-pre-line text-slate-700">{description}</p>
      ) : null}
      {cta ? (
        <div className="mt-6">
          <GridCardCtaTrigger cta={cta} className="px-4 py-2" />
        </div>
      ) : null}
    </div>
  );
}
