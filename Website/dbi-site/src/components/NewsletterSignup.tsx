"use client";

import Image from "next/image";
import { CtaModalForm } from "@/components/cta-modal-form";
import { NEWSLETTER_FORM_ID } from "@/lib/contact-submission";

type NewsletterSignupProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  legalText?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

export function NewsletterSignup({
  title = "Keep up with our Work!",
  description = "Subscribe to our newsletter and receive periodic updates from Delta Bay Impact.",
  buttonLabel = "Sign up for our Newsletter",
  legalText,
  imageSrc,
  imageAlt = "Community",
  className = "",
}: NewsletterSignupProps) {
  return (
    <div
      className={`flex flex-col lg:flex-row min-h-[320px] lg:min-h-[380px] overflow-hidden bg-white ${className}`}
    >
      {/* Left: orange slanted panel with content */}
      <div className="relative flex items-stretch flex-1 px-8">
        <div
          className="absolute inset-0 newsletter-panel-left"
          style={{ backgroundColor: "var(--color-2, #ff7900)" }}
          aria-hidden
        />

        <div className="relative flex flex-col justify-center py-12">
          <h2 className="display-m text-white leading-tight max-w-md">{title}</h2>
          <p className="mt-4 text-base md:text-lg text-white/95 max-w-md">{description}</p>

          <div className="mt-6 md:mt-8 max-w-lg">
            <CtaModalForm
              presentation={{ mode: "dialog", placement: "center" }}
              formId={NEWSLETTER_FORM_ID}
              triggerLabel={buttonLabel}
              messageContext="Footer — newsletter"
              title={title}
              description={description}
              placeholders={{
                firstName: "First name",
                lastName: "Last name",
                email: "Email address",
                organization: "Organization",
              }}
              submitLabel="Subscribe"
              successMessage="Thanks — you're on the list."
              fieldVariant="newsletter"
              className="touch-target w-full sm:w-auto relative inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-2,#ff7900)] disabled:opacity-70 disabled:cursor-not-allowed"
            />
          </div>

          {legalText ? (
            <p className="mt-2 text-xs text-white/80 leading-relaxed max-w-md">{legalText}</p>
          ) : null}
        </div>
      </div>

      <div className="relative flex items-stretch flex-1 min-h-[350px] lg:min-h-full lg:-ml-41">
        {imageSrc ? (
          <div className="absolute inset-0 newsletter-panel-right">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-300 newsletter-panel-right-placeholder" />
        )}
      </div>
    </div>
  );
}
