"use client";

import Image from "next/image";
import type React from "react";
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

const DEFAULT_HOVER_COLOR = "rgba(42, 87, 156, 0.92)"; // #2A579C

function ProgramCard({ item, isFirst, isLast }: { item: ProgramCardItem; isFirst: boolean; isLast: boolean }) {
  const hoverColor = item.hoverColor ?? DEFAULT_HOVER_COLOR;

  // Diagonal clip: narrow bottom (trapezoid). Slight overlap for separator lines.
  const clipPath = isFirst
    ? "polygon(0 0, 100% 0, 98% 100%, 0 100%)"
    : isLast
      ? "polygon(2% 0, 100% 0, 100% 100%, 0 100%)"
      : "polygon(2% 0, 100% 0, 98% 100%, 0 100%)";

  return (
    <Link
      href={item.href}
      variant="cta"
      className="program-card group relative flex-1 min-w-[240px] sm:min-w-0 shrink-0 flex flex-col overflow-hidden"
      style={
        {
          clipPath,
          WebkitClipPath: clipPath,
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
          />
        ) : null}
      </div>

      {/* Default: top-to-bottom gradient fade (transparent → white at bottom), title at bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,0.95) 100%)",
        }}
        aria-hidden
      />

      {/* Hover: bottom-to-top color overlay (fades in) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(to top, var(--program-card-hover) 0%, var(--program-card-hover) 50%, transparent 100%)`,
        }}
        aria-hidden
      />

      {/* Content: title at bottom by default, slides to vertical center on hover; learn more fades in after */}
      <div className="relative flex flex-col flex-1 min-h-[280px] sm:min-h-[320px] md:min-h-[360px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="absolute left-6 right-6 sm:left-8 sm:right-8 flex flex-col items-center text-center transition-all duration-300 ease-out pb-8 sm:pb-10 bottom-0 group-hover:top-1/2 group-hover:bottom-auto group-hover:translate-y-[-50%] group-focus-visible:top-1/2 group-focus-visible:bottom-auto group-focus-visible:translate-y-[-50%]">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-white group-focus-visible:text-white transition-colors duration-200">
            {item.title}
          </h3>
          <span
            className="mt-2 text-sm font-semibold text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-250"
            style={{ transitionDelay: "320ms" }}
          >
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
    <div
      className={`flex flex-row w-full overflow-x-auto overflow-y-hidden bg-slate-200 ${className}`}
      style={{ minHeight: "320px" }}
    >
      {items.map((item, index) => (
        <ProgramCard
          key={item.title + index}
          item={item}
          isFirst={index === 0}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}
