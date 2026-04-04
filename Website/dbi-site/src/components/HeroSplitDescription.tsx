import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

type HeroSplitDescriptionProps = {
  value: string | PortableTextBlock[] | undefined | null;
  /** Light cream column vs dark palette columns */
  isLight: boolean;
};

function buildComponents(isLight: boolean): PortableTextComponents {
  const body = isLight ? "text-[var(--color-5)]" : "text-white/95";
  const heading = isLight ? "text-[var(--color-4)]" : "text-white";
  const linkBase = isLight
    ? "font-medium text-[var(--color-1)] underline underline-offset-2 hover:opacity-90"
    : "font-medium text-white underline underline-offset-2 hover:opacity-90";

  return {
    block: {
      normal: ({ children }) => <p className={`body-md ${body}`}>{children}</p>,
      h3: ({ children }) => (
        <h3 className={`heading-3 mt-6 ${heading} first:mt-0`}>{children}</h3>
      ),
      blockquote: ({ children }) => (
        <blockquote
          className={`body-md mt-6 border-l-4 pl-4 ${isLight ? "border-[var(--color-2)]" : "border-white/40"} ${body}`}
        >
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={`body-md mt-4 list-disc space-y-2 pl-6 ${body}`}>{children}</ul>
      ),
      number: ({ children }) => (
        <ol className={`body-md mt-4 list-decimal space-y-2 pl-6 ${body}`}>{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ value, children }) => {
        const href = value?.href as string | undefined;
        if (!href) return <span>{children}</span>;
        const external = /^https?:\/\//.test(href);
        return (
          <a
            href={href}
            className={linkBase}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {children}
          </a>
        );
      },
    },
  };
}

export function HeroSplitDescription({ value, isLight }: HeroSplitDescriptionProps) {
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    return (
      <p
        className={`body-md mt-4 max-w-xl whitespace-pre-line ${isLight ? "text-[var(--color-5)]" : "text-white/95"}`}
      >
        {value}
      </p>
    );
  }
  if (Array.isArray(value) && value.length === 0) return null;
  return (
    <div
      className={`hero-split-rich-text mt-4 max-w-xl space-y-4 [&_a]:break-words ${isLight ? "text-[var(--color-5)]" : "text-white/95"}`}
    >
      <PortableText value={value} components={buildComponents(isLight)} />
    </div>
  );
}
