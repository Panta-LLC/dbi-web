import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
};

const baseStyles =
  "inline-flex items-center justify-center px-12 py-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  secondary: "text-primary hover:bg-primary/10 bg-white",
  tertiary: "text-primary hover:bg-primary/10 bg-orange-400 text-white",
  ghost: "text-primary hover:bg-primary/10",
};

export function Button({ children, href, variant = "primary", className = "" }: ButtonProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${className} transition-transform duration-150 hover:-translate-x-[3px] hover:-translate-y-[3px]`;

  if (href) {
    return (
      <Link href={href}>
        <div
          className={`w-full h-full ${classes}`}
          style={{
            clipPath: "polygon(96% 0%, 100% 100%, 4% 100%, 0% 0%)",
            WebkitClipPath: "polygon(96% 0%, 100% 100%, 4% 100%, 0% 0%)",
          }}
        >
          {children}
        </div>
      </Link>
    );
  }

  return (
    <button
      className={classes}
    >
      {children}
    </button>
  );
}
