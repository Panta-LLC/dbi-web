import NextLink from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type LinkVariant = "nav" | "body" | "cta";

type LinkProps = {
  href: string;
  children: ReactNode;
  variant?: LinkVariant;
  className?: string;
  target?: string;
  rel?: string;
  prefetch?: boolean | null;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "target" | "rel">;

const baseStyles =
  "inline-flex items-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background";

const variantStyles: Record<LinkVariant, string> = {
  nav: "nav-item-text text-slate-800 hover:text-primary px-4",
  body: "text-primary underline-offset-4 hover:underline",
  cta: "px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-sm md:text-base",
};

const isExternalHref = (href: string) => /^https?:\/\//.test(href);

export function Link({
  href,
  children,
  variant = "body",
  className = "",
  target,
  rel,
  prefetch,
  ...rest
}: LinkProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();
  const external = isExternalHref(href);
  const computedTarget = target ?? (external ? "_blank" : undefined);
  const computedRel = rel ?? (external ? "noreferrer noopener" : undefined);

  if (external) {
    return (
      <a href={href} className={classes} target={computedTarget} rel={computedRel} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <NextLink
      href={href}
      className={classes}
      target={computedTarget}
      rel={computedRel}
      prefetch={prefetch}
      {...rest}
    >
      {children}
    </NextLink>
  );
}
