import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  noPadding?: boolean;
};

export function Section({ children, className = "", id, noPadding = false }: SectionProps) {
  return (
    <section id={id} className={`${noPadding ? "" : "py-10"} ${className}`}>
      {children}
    </section>
  );
}
