"use client";

import Image from "next/image";

type NewsletterSignupProps = {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  legalText?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

export function NewsletterSignup({
  title = "Keep up with our Work!",
  description = "Subscribe to our newsletter and receive periodic updates from Delta Bay Impact.",
  placeholder = "Your email address",
  buttonLabel = "Sign-up",
  legalText,
  imageSrc,
  imageAlt = "Community",
  className = "",
}: NewsletterSignupProps) {
  return (
    <div className={`grid lg:grid-cols-[1fr_1fr] min-h-[320px] lg:min-h-[380px] overflow-hidden ${className}`}>
      {/* Left: orange panel */}
      <div className="flex flex-col justify-center bg-(--color-2,#ff7900) px-6 py-12 sm:px-10 md:px-12 lg:px-14 xl:px-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          {title}
        </h2>
        <p className="mt-4 text-base md:text-lg text-white/95 max-w-lg">
          {description}
        </p>
        <form
          className="mt-6 md:mt-8 flex flex-col gap-3 max-w-md"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            name="email"
            placeholder={placeholder}
            className="touch-target w-full rounded-lg bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-(--color-2,#ff7900)"
            aria-label="Email address"
          />
          <button
            type="submit"
            className="touch-target w-full sm:w-auto rounded-lg bg-(--color-1,#2a579c) px-6 py-3.5 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-(--color-2,#ff7900)"
          >
            {buttonLabel}
          </button>
          {legalText ? (
            <p className="text-xs text-white/80 leading-relaxed mt-1">
              {legalText}
            </p>
          ) : null}
        </form>
      </div>

      {/* Right: image with diagonal left edge */}
      <div className="relative min-h-[240px] lg:min-h-full">
        {imageSrc ? (
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 0)",
              WebkitClipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 0)",
            }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 bg-slate-300"
            style={{
              clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 0)",
              WebkitClipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 0)",
            }}
          />
        )}
      </div>
    </div>
  );
}
