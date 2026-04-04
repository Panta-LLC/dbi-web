import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant =
  | "cta-primary"
  | "cta-secondary"
  | "cta-knockout"
  | "cta-hero"
  | "nav-primary"
  | "nav-secondary";

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
    "slanted-button slanted-button--cta-primary pl-2 pr-12 py-2.5 sm:pl-3 sm:pr-14 sm:py-3 md:pl-4 md:pr-8 md:py-1.5 lg:pl-6 lg:pr-10 lg:py-2 text-sm sm:text-base md:text-lg text-white",
  "cta-secondary":
    "slanted-button slanted-button--outline px-3 py-2 sm:px-4 sm:py-2.5 md:px-7 md:py-3 lg:px-8 lg:py-3.5 text-sm sm:text-base md:text-lg text-primary",
  "cta-knockout":
    "slanted-button slanted-button--knockout pl-2 pr-12 py-2.5 sm:pl-3 sm:pr-14 sm:py-3 md:pl-4 md:pr-8 md:py-1.5 lg:pl-6 lg:pr-10 lg:py-2 text-sm sm:text-base md:text-lg text-black",
  /** Hero primary: full rounded pill, no slant — pairs with full-bleed imagery */
  "cta-hero":
    "rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-black/25 transition hover:bg-white/95 hover:shadow-xl sm:text-base md:text-lg",
  "nav-primary": "slanted-button py-2 text-xs sm:text-sm text-white pl-7 pr-3",
  "nav-secondary": "px-2 py-1.5 text-xs sm:text-sm text-slate-700 hover:text-primary",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, href, variant = "cta-primary", className = "", type = "button", ...rest },
  ref,
) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();
  const isSlanted =
    variant === "cta-primary" ||
    variant === "cta-secondary" ||
    variant === "cta-knockout" ||
    variant === "nav-primary";

  if (href) {
    const content = (
      <span className={`relative inline-flex w-full items-center justify-center`}>
        <span className="relative z-[1]">{children}</span>
      </span>
    );
    const isExternal = href.startsWith("http://") || href.startsWith("https://");

    return (
      <Link
        href={href}
        className={classes}
        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
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
});
