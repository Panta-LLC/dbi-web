"use client";

import Image from "next/image";
import React from "react";
import { Link } from "@/components/Link";

export type ProgramCardItem = {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  href: string;
  /** Hover overlay color (CSS color). Default: primary blue. */
  hoverColor?: string;
};

type ProgramCardsProps = {
  items: ProgramCardItem[];
  className?: string;
};

const DEFAULT_HOVER_COLOR = "#ff7900";

function ProgramCard({ item }: { item: ProgramCardItem }) {
  const hoverColor = item.hoverColor ?? DEFAULT_HOVER_COLOR;

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
      aria-label={`${item.title}, learn more`}
    >
      {/* Image layer */}
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

      {/* Default: top-to-bottom gradient fade (transparent → white at bottom), title at bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          // First-card style: subtle fade into white at the bottom over the photo.
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 10%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,1) 100%)",
        }}
        aria-hidden
      />

      {/* Hover: bottom-to-top color overlay (fades in and slides up) – matches second card */}
      <div
        className="absolute inset-0 opacity-0 translate-y-[50%] group-hover:translate-y-0 group-focus-visible:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 ease-out pointer-events-none"
        style={{
          background: `linear-gradient(to top, var(--program-card-hover) 0%, transparent 70%)`,
        }}
        aria-hidden
      />

      {/* Content: title anchored near bottom; padding-bottom grows on hover, always visible */}
      <div className="relative flex flex-col flex-1 px-6 py-6 sm:px-8 sm:py-8 w-full">
        <div className="absolute left-6 right-6 sm:left-8 sm:right-8 flex flex-col items-center text-center -mb-4 group-hover:pb-5 group-focus-visible:pb-5 bottom-0 transition-all duration-300 ease-out">
          <h3 className="heading-3 text-slate-900 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white">
            {item.title}
          </h3>
          <span className="mt-1 text-sm font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            Learn more
          </span>
        </div>
      </div>
    </Link>
  );
}

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
