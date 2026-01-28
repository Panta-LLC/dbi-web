"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  noPadding?: boolean;
  reveal?: boolean;
  slant?: "top" | "bottom";
};

export function Section({
  children,
  className = "",
  id,
  noPadding = false,
  reveal = true,
  slant,
}: SectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const slantClass = slant === "top" ? "section-slant-top" : slant === "bottom" ? "section-slant-bottom" : "";

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -20% 0px",
        threshold: 0.1,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={sectionRef} className={`${slantClass} ${noPadding ? "" : "py-10"} ${className}`}>
      <div className={reveal ? `reveal ${isVisible ? "is-visible" : ""}` : ""}>{children}</div>
    </section>
  );
}
