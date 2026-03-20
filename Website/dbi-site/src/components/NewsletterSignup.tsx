"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "./Button";

type MailchimpConfig = {
  listId?: string;
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          ...(mailchimp?.listId && { listId: mailchimp.listId }),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };

      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "Thanks for subscribing!");
        setFirstName("");
        setLastName("");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

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

          <form className="mt-6 md:mt-8 gap-1 max-w-lg" onSubmit={handleSubmit}>
            {/* First and last name row */}
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                disabled={status === "loading"}
                className="touch-target flex-1 w-full bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-70"
                aria-label="First name"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                disabled={status === "loading"}
                className="touch-target flex-1 w-full bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-70"
                aria-label="Last name"
              />
            </div>
            {/* Email field */}
            <div className="mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                disabled={status === "loading"}
                className="touch-target w-full bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-70"
                aria-label="Email address"
                required
              />
            </div>
            {message ? (
              <p
                className={`mb-3 text-sm ${status === "success" ? "text-white" : "text-white/90"}`}
                role="status"
              >
                {message}
              </p>
            ) : null}
            {/* Slanted CTA button */}
            <Button
              type="submit"
              variant="cta-primary"
              disabled={status === "loading"}
              className="touch-target w-full sm:w-auto relative inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-2,#ff7900)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {status === "loading" ? "Subscribing…" : buttonLabel}
              </span>
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
