import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** `site` matches page column width; `narrow` for intro / section copy (max ~48rem). */
  maxWidth?: "site" | "narrow";
};

const maxWidthClass: Record<NonNullable<ContainerProps["maxWidth"]>, string> = {
  site: "max-w-6xl",
  narrow: "max-w-3xl",
};

export function Container({ children, className = "", maxWidth = "site" }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxWidthClass[maxWidth]} ${className}`}
    >
      {children}
    </div>
  );
}
