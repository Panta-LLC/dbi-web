"use client";

import Image from "next/image";
import { Button } from "./Button";

type MailchimpConfig = {
  formActionUrl?: string;
  successRedirectUrl?: string;
  emailFieldName?: string;
};

type NewsletterSignupProps = {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  legalText?: string;
  imageSrc?: string;
  imageAlt?: string;
  mailchimp?: MailchimpConfig | null;
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
  mailchimp,
  className = "",
}: NewsletterSignupProps) {
  const useMailchimp = mailchimp?.formActionUrl;
  const formAction = useMailchimp ? mailchimp.formActionUrl : undefined;
  const emailFieldName = mailchimp?.emailFieldName ?? "EMAIL";
  return (
    <div
      className={`flex flex-col lg:flex-row min-h-[320px] lg:min-h-[380px] overflow-hidden bg-white ${className}`}
    >
      {/* Left: orange slanted panel with content */}
      <div className="relative flex items-stretch flex-1 pl-8 pr-4">
        {/* Slanted orange background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "var(--color-2, #ff7900)",
            clipPath: "polygon(0 0, 100% 0, 76% 100%, 0 100%)",
            WebkitClipPath: "polygon(0 0, 100% 0, 76% 100%, 0 100%)",
          }}
          aria-hidden
        />

        {/* Content */}
        <div className="relative flex flex-col justify-center py-12">
          <h2 className="display-m text-white leading-tight max-w-md">{title}</h2>
          <p className="mt-4 text-base md:text-lg text-white/95 max-w-md">{description}</p>

          <form
            className="mt-6 md:mt-8 gap-1 max-w-lg"
            action={formAction}
            method={useMailchimp ? "post" : undefined}
            target={useMailchimp ? "_blank" : undefined}
            onSubmit={useMailchimp ? undefined : (e) => e.preventDefault()}
          >
            {/* Slanted email field */}
            <div className="relative flex-1 flex-row min-w-[200px] mb-3">
              <div
                className="absolute inset-0 bg-white"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 100%)",
                  WebkitClipPath: "polygon(0 0, 100% 0, 95% 100%, 0 100%)",
                }}
                aria-hidden
              />
              <input
                type="email"
                name={emailFieldName}
                placeholder={placeholder}
                className="touch-target relative z-10 w-full bg-transparent px-4 py-3.5 text-slate-900 placeholder:text-slate-500 text-sm focus:outline-none"
                aria-label="Email address"
              />
            </div>
            {/* Slanted CTA button */}
            <Button
              variant="cta-primary"
              className="touch-target w-full sm:w-auto relative inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-2,#ff7900)]"
            >
              <span className="relative z-10">{buttonLabel}</span>
            </Button>
          </form>

          {legalText ? (
            <p className="mt-2 text-xs text-white/80 leading-relaxed max-w-md">{legalText}</p>
          ) : null}
        </div>
      </div>

      {/* Right: image with matching slanted left edge */}
      <div className="relative flex items-stretch flex-1 min-h-[260px] lg:min-h-full -ml-41">
        {imageSrc ? (
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(25.5% 0, 100% 0, 100% 100%, 0 100%)",
              WebkitClipPath: "polygon(25.5% 0, 100% 0, 100% 100%, 0 100%)",
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
              clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)",
              WebkitClipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)",
            }}
          />
        )}
      </div>
    </div>
  );
}
