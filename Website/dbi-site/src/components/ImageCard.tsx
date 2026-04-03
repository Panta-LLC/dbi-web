"use client";

import Image from "next/image";
import type { GridCardCtaResolved } from "@/lib/grid-card-cta";
import { GridCardCtaTrigger } from "./GridCardCtaTrigger";

type ImageCardProps = {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  cta?: GridCardCtaResolved;
};

export function ImageCard({ title, subtitle, imageSrc, imageAlt, cta }: ImageCardProps) {
  const ctaRow = cta ? (
    <div className="mt-4 flex justify-center">
      <GridCardCtaTrigger cta={cta} className="px-3 py-2 text-sm" />
    </div>
  ) : null;

  return (
    <div className="bg-white overflow-hidden p-4">
      {imageSrc ? (
        <>
          <div className="relative aspect-4/3 w-full">
            <Image
              src={imageSrc}
              alt={imageAlt ?? title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="display-s text-slate-900">{title}</h3>
            {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
            {ctaRow}
          </div>
        </>
      ) : (
        <div className="flex min-h-32 flex-col items-center justify-center p-6 text-center bg-muted/50">
          <h3 className="display-s text-slate-900">{title}</h3>
          {subtitle ? <p className="body-md mt-2">{subtitle}</p> : null}
          {ctaRow}
        </div>
      )}
    </div>
  );
}
