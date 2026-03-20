"use client";

import Image from "next/image";

type ImageCardProps = {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function ImageCard({ title, subtitle, imageSrc, imageAlt }: ImageCardProps) {
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
            <p className="display-s text-slate-900">{title}</p>
            {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
          </div>
        </>
      ) : (
        <div className="flex min-h-32 flex-col items-center justify-center p-6 text-center bg-muted/50">
          <h2 className="display-s text-slate-900">{title}</h2>
          {subtitle ? <p className="body-md mt-2">{subtitle}</p> : null}
        </div>
      )}
    </div>
  );
}
