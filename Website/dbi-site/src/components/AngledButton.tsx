import Link from "next/link";
import type { ReactNode } from "react";

type AngledButtonProps = {
  children: ReactNode;
  href: string;
  className?: string;
};

export function AngledButton({ children, href, className = "" }: AngledButtonProps) {
  return (
    <Link
      href={href}
      className={`bevel-tl-br-sm inline-flex items-center justify-center bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-accent/90 ${className}`}
    >
      {children}
    </Link>
  );
}
