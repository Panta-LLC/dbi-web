"use client";

import Image from "next/image";
import React, { forwardRef } from "react";
import { CtaModalForm } from "@/components/cta-modal-form";
import type { ContactPlaceholders, Presentation } from "@/components/cta-modal-form/types";
import { Link } from "@/components/Link";

const DEFAULT_HOVER_COLOR = "#ff7900";

export type ProgramCardContactModal = {
  formId: string;
  triggerLabel: string;
  presentation: Presentation;
  messageContext?: string;
  title?: string;
  description?: string;
  placeholders: ContactPlaceholders;
  submitLabel: string;
  successMessage?: string;
};

export type ProgramCardItem = {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Hover overlay color (CSS color). Default: primary orange. */
  hoverColor?: string;
  /** Fallback link when the card is not a contact modal. */
  href: string;
  /** When set, the card opens the contact form instead of navigating. */
  contactModal?: ProgramCardContactModal;
  /** Shown on hover for link cards when Card CTA is a link with a label. */
  linkCtaLabel?: string;
};

type ProgramCardFaceProps = {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  hoverColor: string;
  learnMoreLabel: string;
};

const ProgramCardFace = forwardRef<HTMLDivElement, ProgramCardFaceProps>(function ProgramCardFace(
  { title, imageSrc, imageAlt, hoverColor, learnMoreLabel },
  ref,
) {
  return (
    <div
      ref={ref}
      className="program-card group relative flex-1 sm:min-w-0 shrink-0 flex flex-col overflow-hidden bg-white min-h-[50vw] sm:min-h-[260px] md:min-h-[320px] cursor-pointer touch-target"
      style={
        {
          "--program-card-hover": hoverColor,
        } as React.CSSProperties
      }
      aria-label={`${title}, ${learnMoreLabel}`}
    >
      <div className="absolute inset-0 bg-slate-300">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            unoptimized
          />
        ) : null}
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 10%, rgba(255,255,255,0.1) 55%, rgba(255,255,255,1) 100%)",
        }}
        aria-hidden
      />

      <div
        className="absolute inset-0 opacity-0 translate-y-[50%] group-hover:translate-y-0 group-focus-visible:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 ease-out pointer-events-none"
        style={{
          background: `linear-gradient(to top, var(--program-card-hover) 0%, transparent 70%)`,
        }}
        aria-hidden
      />

      <div className="relative flex flex-col flex-1 px-6 py-6 sm:px-8 sm:py-8 w-full">
        <div className="absolute left-6 right-6 sm:left-8 sm:right-8 flex flex-col items-center text-center -mb-4 group-hover:pb-5 group-focus-visible:pb-5 bottom-0 transition-all duration-300 ease-out">
          <h3 className="heading-3 text-slate-900 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white">
            {title}
          </h3>
          <span className="mt-1 text-sm font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            {learnMoreLabel}
          </span>
        </div>
      </div>
    </div>
  );
});

function ProgramCard({ item }: { item: ProgramCardItem }) {
  const hoverColor = item.hoverColor ?? DEFAULT_HOVER_COLOR;
  const learnMoreLabel =
    item.contactModal?.triggerLabel ?? item.linkCtaLabel ?? "Learn more";

  if (item.contactModal) {
    const m = item.contactModal;
    return (
      <CtaModalForm
        presentation={m.presentation}
        formId={m.formId}
        triggerLabel={m.triggerLabel}
        messageContext={m.messageContext}
        title={m.title}
        description={m.description}
        placeholders={m.placeholders}
        submitLabel={m.submitLabel}
        successMessage={m.successMessage}
        customTrigger={
          <ProgramCardFace
            title={item.title}
            imageSrc={item.imageSrc}
            imageAlt={item.imageAlt}
            hoverColor={hoverColor}
            learnMoreLabel={learnMoreLabel}
          />
        }
      />
    );
  }

  return (
    <Link
      href={item.href}
      variant="cta"
      className="program-card group relative flex-1 sm:min-w-0 shrink-0 flex flex-col overflow-hidden bg-white min-h-[50vw] sm:min-h-[260px] md:min-h-[320px]"
      style={
        {
          "--program-card-hover": hoverColor,
        } as React.CSSProperties
      }
      aria-label={`${item.title}, ${learnMoreLabel}`}
    >
      <div className="absolute inset-0 bg-slate-300">
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.imageAlt ?? item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            unoptimized
          />
        ) : null}
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 10%, rgba(255,255,255,0.1) 55%, rgba(255,255,255,1) 100%)",
        }}
        aria-hidden
      />

      <div
        className="absolute inset-0 opacity-0 translate-y-[50%] group-hover:translate-y-0 group-focus-visible:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 ease-out pointer-events-none"
        style={{
          background: `linear-gradient(to top, var(--program-card-hover) 0%, transparent 70%)`,
        }}
        aria-hidden
      />

      <div className="relative flex flex-col flex-1 px-6 py-6 sm:px-8 sm:py-8 w-full">
        <div className="absolute left-6 right-6 sm:left-8 sm:right-8 flex flex-col items-center text-center -mb-4 group-hover:pb-5 group-focus-visible:pb-5 bottom-0 transition-all duration-300 ease-out">
          <h3 className="heading-3 text-slate-900 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white">
            {item.title}
          </h3>
          <span className="mt-1 text-sm font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            {learnMoreLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Compact program-style card for tab strips (e.g. services). */
export function ProgramCardCompactTab({
  title,
  imageSrc,
  imageAlt,
  hoverColor = DEFAULT_HOVER_COLOR,
  selected,
  onClick,
  tabId,
}: {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  hoverColor?: string;
  selected: boolean;
  onClick: () => void;
  tabId: string;
}) {
  return (
    <div
      role="tab"
      id={tabId}
      tabIndex={0}
      aria-selected={selected}
      aria-controls={`${tabId}-panel`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative flex min-h-[120px] w-[min(100%,200px)] flex-1 shrink-0 cursor-pointer flex-col overflow-hidden rounded-md bg-white touch-target transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 sm:min-h-[140px] sm:w-auto sm:min-w-[140px] md:min-h-[160px] md:min-w-[160px] ${
        selected ? "ring-2 ring-[#ff7900] ring-offset-2" : "ring-1 ring-slate-200 hover:ring-slate-300"
      }`}
      style={
        {
          "--program-card-hover": hoverColor,
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 bg-slate-300">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            sizes="(max-width: 768px) 45vw, 180px"
            className="object-cover"
            unoptimized
          />
        ) : null}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 10%, rgba(255,255,255,0.1) 55%, rgba(255,255,255,1) 100%)",
        }}
        aria-hidden
      />

      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        }`}
        style={{
          background: `linear-gradient(to top, var(--program-card-hover) 0%, transparent 70%)`,
        }}
        aria-hidden
      />

      <div className="relative flex w-full flex-1 flex-col justify-end px-3 py-3 sm:px-4 sm:py-4">
        <h3
          className={`heading-3 text-center text-sm leading-tight sm:text-base ${
            selected ? "text-white" : "text-slate-900 transition-colors group-hover:text-white group-focus-visible:text-white"
          }`}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}

type ProgramCardsProps = {
  items: ProgramCardItem[];
  className?: string;
};

export function ProgramCards({ items, className = "" }: ProgramCardsProps) {
  if (!items?.length) return null;

  return (
    <div className={`relative w-full ${className} `}>
      <div
        className="relative z-10 gap-3 mx-auto flex w-full flex-col sm:flex-row items-stretch justify-center overflow-x-auto bg-white px-3 max-w-5xl"
        style={{ minHeight: "280px" }}
      >
        {items.map((item, index) => (
          <ProgramCard key={item.title + index} item={item} />
        ))}
      </div>
    </div>
  );
}
