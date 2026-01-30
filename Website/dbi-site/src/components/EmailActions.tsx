"use client";

import { useState } from "react";
import { FaCopy, FaEnvelope, FaEnvelopeOpenText } from "react-icons/fa";

type EmailActionsProps = {
  email: string;
};

export function EmailActions({ email }: EmailActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const show = (x: number, y: number) => {
    setPosition({ x, y });
    setIsOpen(true);
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    show(event.clientX, event.clientY);
  };

  const handleMouseLeave = () => setIsOpen(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    show(event.clientX, event.clientY);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLButtonElement>) => {
    const touch = event.touches[0];
    if (touch) {
      show(touch.clientX, touch.clientY);
    }
  };

  return (
    <div className="relative inline-flex flex-col items-start gap-2">
      <button
        type="button"
        className="flex items-center gap-2 text-lg font-semibold transition hover:text-primary focus:outline-none"
        aria-label={`Show email actions for ${email}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
      >
        <FaEnvelope className="h-5 w-5" />
        {email}
      </button>
      <div
        className={`fixed z-50 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm transition-all duration-200 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
        style={{ left: position.x, top: position.y, transform: "translate(-50%, -120%)" }}
      >
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center justify-center rounded-full border border-border px-3 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:-translate-x-[2px] hover:-translate-y-[2px]"
          aria-label="Open email"
          title="Email"
        >
          <FaEnvelopeOpenText className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center rounded-full border border-border px-3 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:-translate-x-[2px] hover:-translate-y-[2px]"
          aria-label={copied ? "Email copied" : "Copy email address"}
          title={copied ? "Copied" : "Copy"}
        >
          <FaCopy className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
