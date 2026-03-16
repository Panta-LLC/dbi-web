import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "cta-primary" | "cta-secondary" | "nav-primary" | "nav-secondary";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseStyles =
  "relative inline-flex items-center justify-center font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background touch-target";

const variantStyles: Record<ButtonVariant, string> = {
  "cta-primary":
    "slanted-button px-3 py-2.5 sm:px-4 sm:py-3 md:px-8 md:py-3.5 lg:px-9 lg:py-4 text-sm sm:text-base md:text-lg text-white",
  "cta-secondary":
    "slanted-button slanted-button--outline px-3 py-2 sm:px-4 sm:py-2.5 md:px-7 md:py-3 lg:px-8 lg:py-3.5 text-sm sm:text-base md:text-lg text-primary",
  "nav-primary":
    "slanted-button py-2 text-xs sm:text-sm uppercase tracking-[0.16em] text-white pl-7 pr-3",
  "nav-secondary":
    "px-2 py-1.5 text-xs sm:text-sm uppercase tracking-[0.16em] text-slate-700 hover:text-primary",
};

export function Button({
  children,
  href,
  variant = "cta-primary",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();
  const isSlanted =
    variant === "cta-primary" || variant === "cta-secondary" || variant === "nav-primary";

  if (href) {
    const content = (
      <span className={`relative inline-flex w-full items-center justify-center`}>
        <span className="relative z-[1]">{children}</span>
      </span>
    );

    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={`${classes} ${
        isSlanted
          ? "transition-transform duration-150 hover:-translate-x-[3px] hover:-translate-y-[3px]"
          : ""
      }`}
      {...rest}
    >
      <span className="relative z-[1]">{children}</span>
    </button>
  );
}
