"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="body-md">{children}</p>,
    h3: ({ children }) => (
      <h4 className="heading-4 text-[var(--color-4)]">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="body-md border-l-4 border-[var(--color-2)] pl-4">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="body-md list-disc space-y-2 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="body-md list-decimal space-y-2 pl-6">{children}</ol>
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
          className="font-medium text-[var(--color-1)] underline underline-offset-2 hover:opacity-90"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

type CollectionArticleDescriptionProps = {
  value: string | PortableTextBlock[] | undefined | null;
  /** Merged onto the outer wrapper (e.g. `!mt-0` when headline/teaser sit above in another view). */
  className?: string;
};

export function CollectionArticleDescription({ value, className = "" }: CollectionArticleDescriptionProps) {
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    return (
      <p
        className={`body-md mt-6 whitespace-pre-line text-[var(--color-5)] first:mt-0 ${className}`.trim()}
      >
        {value}
      </p>
    );
  }
  if (Array.isArray(value) && value.length === 0) return null;
  return (
    <div className={`mt-6 space-y-4 text-[var(--color-5)] first:mt-0 [&_a]:break-words ${className}`.trim()}>
      <PortableText value={value} components={components} />
    </div>
  );
}
