import Image from "next/image";

export type FullWidthImageProps = {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  /**
   * Break out of centered max-width wrappers (e.g. `max-w-7xl`) so the image spans the viewport width.
   */
  bleed?: boolean;
  className?: string;
  /** Frame for `fill` image (default wide banner). */
  aspectClassName?: string;
};

export function FullWidthImage({
  src,
  alt,
  caption,
  priority = false,
  bleed = false,
  className = "",
  aspectClassName = "aspect-[21/9] max-h-[min(85vh,960px)]",
}: FullWidthImageProps) {
  const breakout = bleed
    ? "relative w-screen max-w-[100vw] left-1/2 -translate-x-1/2"
    : "relative w-full";

  return (
    <figure className={`${breakout} ${className}`}>
      <div className={`relative w-full overflow-hidden bg-slate-100 ${aspectClassName}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={bleed ? "100vw" : "(max-width: 1280px) 100vw, 1280px"}
          className="object-cover"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 px-4 text-center text-sm text-slate-600">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
