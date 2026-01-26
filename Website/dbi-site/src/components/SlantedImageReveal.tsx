"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type SlantedImageRevealProps = {
  src: string;
  alt: string;
  className?: string;
  direction?: "left" | "right";
  trigger?: "load" | "scroll";
  tall?: boolean;
  long?: boolean;
  variant?: "framed" | "mask";
};

export function SlantedImageReveal({
  src,
  alt,
  className = "",
  direction = "right",
  trigger = "load",
  tall = true,
  long = false,
  variant = "mask",
}: SlantedImageRevealProps) {
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (trigger === "load") {
      const frame = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(frame);
    }

    if (trigger !== "scroll") {
      return;
    }

    const node = rootRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [trigger]);

  return (
    <div
      ref={rootRef}
      style={
        tall
          ? { height: "140%", marginBottom: "-30%", marginTop: "-10%" }
          : long
            ? { height: "140%", marginTop: "-30%" }
            : undefined
      }
      className={`slant-frame ${variant === "mask" ? "slant-frame--mask" : "slant-frame--framed"} ${
        tall ? "slant-frame--tall" : ""
      } ${direction === "right" ? "slant-frame--right" : "slant-frame--left"} ${className}`}
    >
      <div className={`slant-frame__inner ${variant === "mask" ? "slant-frame__inner--mask" : ""}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className={`slant-image ${active ? "slant-image--active" : ""}`}
          sizes="(min-width: 1024px) 40vw, 80vw"
        />
      </div>
    </div>
  );
}
