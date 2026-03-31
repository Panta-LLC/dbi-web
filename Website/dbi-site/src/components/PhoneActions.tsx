"use client";

import { FaPhone } from "react-icons/fa";

type PhoneActionsProps = {
  phone: string;
};

function telHref(display: string): string {
  const trimmed = display.trim();
  if (!trimmed) return "#";
  const normalized = trimmed.startsWith("+")
    ? `+${trimmed.slice(1).replace(/\D/g, "")}`
    : trimmed.replace(/\D/g, "");
  return normalized ? `tel:${normalized}` : "#";
}

export function PhoneActions({ phone }: PhoneActionsProps) {
  return (
    <a
      href={telHref(phone)}
      className="inline-flex items-center gap-2 text-lg font-semibold transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
      aria-label={`Call ${phone}`}
    >
      <FaPhone className="h-5 w-5 shrink-0" />
      {phone}
    </a>
  );
}
