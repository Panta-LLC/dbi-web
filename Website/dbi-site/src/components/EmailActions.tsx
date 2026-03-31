"use client";

import { FaCopy, FaEnvelope } from "react-icons/fa";
import { toast } from "sonner";

type EmailActionsProps = {
  email: string;
};

export function EmailActions({ email }: EmailActionsProps) {
  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Email copied");
    } catch {
      toast.error("Could not copy email");
    }
  };

  return (
    <div className="group inline-flex items-center gap-2">
      <a
        href={`mailto:${email}`}
        className="flex items-center gap-2 text-lg font-semibold transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
        aria-label={`Email ${email}`}
      >
        <FaEnvelope className="h-5 w-5 shrink-0" />
        {email}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex shrink-0 items-center justify-center rounded p-1.5 text-slate-600 opacity-100 transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
        aria-label="Copy email address"
        title="Copy email"
      >
        <FaCopy className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
