"use client";

import Image from "next/image";
import { X } from "lucide-react";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ButtonVariant } from "@/components/Button";
import { GridCardCtaTrigger } from "@/components/GridCardCtaTrigger";
import type { GridCardCtaResolved } from "@/lib/grid-card-cta";
import {
  claimUnscopedFragment,
  collectionArticleScrollTargetId,
  parseCollectionArticleHash,
  resetUnscopedHashClaims,
  uniqueAnchorSlugsForItems,
} from "@/lib/slugify-anchor";
import type { PortableTextBlock } from "@portabletext/types";
import { CollectionArticleDescription } from "./CollectionArticleDescription";
import { Container } from "./Container";

export type CollectionArticleItem = {
  heading: string;
  summary?: string;
  /** Article panel line under title; if empty, summary is shown under the title instead. */
  subtitle?: string;
  /** Portable Text blocks from Sanity, or legacy plain string. */
  description?: string | PortableTextBlock[];
  imageSrc?: string;
  imageAlt?: string;
  /** Ordered CTAs with button variant (primary / secondary / tertiary). */
  ctas: Array<{ variant: ButtonVariant; cta: GridCardCtaResolved }>;
};

export type CollectionArticleColumnsPerRow = 2 | 3 | 4 | 5;

export type CollectionArticleCardSize = "sm" | "md" | "lg";

export type CollectionArticleSectionLayout = "cardGrid" | "explorer";

export type CollectionArticleDefaultView = "grid" | "explorer";

/** Masonry: multi-column layout (matches prior grid breakpoints; fills columns top-to-bottom). */
const MASONRY_COLS_CLASS: Record<CollectionArticleColumnsPerRow, string> = {
  2: "columns-1 sm:columns-2",
  3: "columns-1 sm:columns-2 lg:columns-3",
  4: "columns-1 sm:columns-2 lg:columns-4",
  5: "columns-1 sm:columns-2 lg:columns-3 xl:columns-5",
};

const GRID_PADDING: Record<CollectionArticleCardSize, string> = {
  sm: "p-8",
  md: "p-8 p-12",
  lg: "p-12 px-4",
};

/** Card grid image: ~50% taller than 4/3 at equal width → aspect 4/(3×1.5) = 8/9 */
const GRID_IMAGE_BOX: Record<CollectionArticleCardSize, string> = {
  sm: "aspect-[8/9] max-h-[16.5rem]",
  md: "aspect-[8/9]",
  lg: "aspect-[8/9] min-h-[21rem]",
};

const GRID_TITLE: Record<CollectionArticleCardSize, string> = {
  sm: "display-xs font-semibold",
  md: "display-xs",
  lg: "display-l tracking-tight",
};

const GRID_SUMMARY: Record<CollectionArticleCardSize, string> = {
  sm: "text-sm",
  md: "body-md",
  lg: "text-lg",
};

const SIDEBAR_IMAGE_MAX: Record<CollectionArticleCardSize, string> = {
  sm: "max-h-20",
  md: "max-h-32",
  lg: "max-h-40",
};

/**
 * Explorer list: left strip matches row height (thumb fills vertically) so long summaries
 * don’t leave dead space under a short square. `min-h-[7rem]` ≈ former square at w-28.
 */
const EXPLORER_THUMB_BOX =
  "relative h-full min-h-[7rem] w-28 shrink-0 self-stretch overflow-hidden rounded-none sm:w-36";

/** Full-bleed breakout from padded Container. Avoid `overflow-x-hidden` here — it breaks `position:sticky` on the explorer sidebar. */
const EXPLORER_FULL_BLEED = "relative";

function columnsPerRowFromCms(value: number | undefined): CollectionArticleColumnsPerRow {
  if (value === 3 || value === 4 || value === 5) return value;
  return 2;
}

function cardSizeFromProps(
  value: CollectionArticleCardSize | undefined,
): CollectionArticleCardSize {
  if (value === "sm" || value === "lg") return value;
  return "md";
}

function initialSelectedIndex(
  sectionLayout: CollectionArticleSectionLayout,
  expandedMode: boolean,
  defaultView: CollectionArticleDefaultView,
): number | null {
  if (sectionLayout === "explorer") return 0;
  if (!expandedMode) return null;
  return defaultView === "explorer" ? 0 : null;
}

function ArticlePanelCtas({
  rows,
  className = "mt-6",
}: {
  rows: Array<{ variant: ButtonVariant; cta: GridCardCtaResolved }>;
  className?: string;
}) {
  if (!rows.length) return null;
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center ${className}`.trim()}
    >
      {rows.map((row, i) => (
        <GridCardCtaTrigger
          key={`${row.variant}-${row.cta.kind === "link" ? row.cta.href : row.cta.formId}-${i}`}
          cta={row.cta}
          triggerVariant={row.variant}
          className={`px-4 py-2 sm:shrink-0 ${
            row.variant === "nav-secondary" ? "underline underline-offset-2" : ""
          }`.trim()}
        />
      ))}
    </div>
  );
}

function PreviewBlock({
  item,
  imageSizes,
  variant,
  cardSize,
  footer,
  explorerTone,
}: {
  item: CollectionArticleItem;
  imageSizes: string;
  variant: "grid" | "sidebar";
  cardSize: CollectionArticleCardSize;
  footer?: ReactNode;
  /** Explorer sidebar: inactive = color-3; active = color-2 + color-3 text + right-pointing tab */
  explorerTone?: "inactive" | "active";
}) {
  const padding = variant === "sidebar" ? "p-3" : GRID_PADDING[cardSize];
  const imageBoxClass =
    variant === "sidebar" ? `aspect-4/3 ${SIDEBAR_IMAGE_MAX[cardSize]}` : GRID_IMAGE_BOX[cardSize];
  const titleClass = variant === "sidebar" ? "" : `${GRID_TITLE[cardSize]} text-slate-900`;
  const summaryClass =
    variant === "sidebar"
      ? "text-sm py-6"
      : `mt-2 text-slate-700 whitespace-pre-line ${GRID_SUMMARY[cardSize]}`;
  /** Card grid only: light gray surface → orange on hover */
  const gridCardSurface = "group bg-[var(--color-3)] hover:bg-[var(--color-2)]";
  const gridCardTitleHover = "group-hover:text-[var(--color-3)]";
  const gridCardSummaryHover = "group-hover:text-[var(--color-3)]/95";
  const gridCardFooterRule = "border-t border-slate-200/80 group-hover:border-[var(--color-3)]/25";

  const imageInner = item.imageSrc ? (
    <Image
      src={item.imageSrc}
      alt={item.imageAlt ?? item.heading}
      fill
      sizes={imageSizes}
      className="object-cover"
    />
  ) : null;

  /** Right-pointing tab (same fill as --color-2), flush with the preview body like a speech-bubble tail */
  const explorerActiveRightTab = (
    <div
      className="absolute right-[-13px] top-0 bottom-0 z-50 hidden shrink-0 self-stretch m-auto lg:flex"
      aria-hidden
    >
      <span className="h-0 w-0 absolute top-0 bottom-0 m-auto right-[-4px] border-y-[16px] border-l-[14px] border-y-transparent border-l-[var(--color-3)] sm:border-y-[16px] sm:border-l-[14px]" />
      <span className="h-0 w-0 absolute top-0 bottom-0 m-auto right-[4px] border-y-[14px] border-l-[12px] border-y-transparent border-l-[var(--color-4)] sm:border-y-[16px] sm:border-l-[14px]" />
    </div>
  );

  if (explorerTone === "active" || explorerTone === "inactive") {
    const active = explorerTone === "active";
    const shell = active ? "" : "bg-[var(--color-3)]";
    const explorerListThumb = item.imageSrc ? (
      <div className={`${EXPLORER_THUMB_BOX} border-r-8 border-r-white`}>
        <Image
          src={item.imageSrc}
          alt={item.imageAlt ?? item.heading}
          fill
          sizes={imageSizes}
          className="object-cover"
        />
      </div>
    ) : null;

    return (
      <div className={`relative w-full rounded-none border-0 shadow-none`}>
        {active ? (
          <div className="flex min-h-0 w-full items-stretch">
            <div className="flex min-h-0 min-w-0 flex-1 items-stretch gap-0">
              {explorerListThumb}
              <div
                className={`relative flex min-w-0 flex-1 flex-col justify-start ${item.imageSrc ? "px-4 py-4 sm:px-6 sm:py-5" : "px-8 py-8"} ${active ? "" : shell} bg-[var(--color-4)] text-[var(--color-3)]`}
              >
                <h3 className="heading-3 text-[var(--color-3)]">{item.heading}</h3>
                {item.summary ? (
                  <p className="mt-1 text-sm whitespace-pre-line text-[var(--color-3)]/95">
                    {item.summary}
                  </p>
                ) : null}
                {explorerActiveRightTab}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`flex min-h-0 justify-center ${shell} ${item.imageSrc ? "flex-row items-stretch gap-0" : "flex-col items-stretch px-8 py-6"}`}
          >
            {explorerListThumb}
            <div
              className={`flex min-w-0 w-full flex-1 flex-col justify-start ${item.imageSrc ? "px-4 py-6 sm:px-5" : ""}`}
            >
              <h3 className="heading-3 text-[var(--color-4)]">{item.heading}</h3>
              {item.summary ? (
                <p className="mt-1 text-sm whitespace-pre-line text-[var(--color-5)]">
                  {item.summary}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`content-card relative flex min-h-0 flex-col ${variant === "grid" ? "" : "h-full"} ${footer ? "pb-0" : ""}`}
    >
      <div className={`flex min-h-0 flex-col ${footer ? "flex-1" : ""}`}>
        {item.imageSrc ? (
          <div className={`relative w-full overflow-hidden ${imageBoxClass}`}>{imageInner}</div>
        ) : null}
        <div className={`${item.imageSrc ? padding : "px-9 py-5"} ${gridCardSurface}`}>
          <h2
            className={`text-slate-900 display-m text-center ${gridCardTitleHover} ${titleClass}`}
          >
            {item.heading}
          </h2>
          {item.summary ? (
            <p className={`${summaryClass} ${gridCardSummaryHover}`}>{item.summary}</p>
          ) : null}
        </div>
      </div>
      {footer ? (
        <div className={`mt-auto px-0 pb-4 pt-4 ${gridCardFooterRule}`}>{footer}</div>
      ) : null}
    </div>
  );
}

function ArticleTeaser({
  item,
  className = "body-md mt-4 text-slate-600 whitespace-pre-line",
}: {
  item: CollectionArticleItem;
  className?: string;
}) {
  const line = item.subtitle?.trim() || item.summary;
  return line ? <p className={className}>{line}</p> : null;
}

function ExplorerArticleBody({
  item,
  showInsetClose,
  onClose,
  embedded = false,
}: {
  item: CollectionArticleItem;
  showInsetClose: boolean;
  onClose?: () => void;
  embedded?: boolean;
}) {
  /** Align with Container: px-4 sm:px-6 lg:px-8 */
  const containerPad = "px-4 sm:px-6 lg:px-8";
  const shellClass = embedded
    ? `relative ${containerPad} pb-10 sm:pb-12 pt-2 sm:pt-0`
    : `relative ${containerPad} pb-10 pt-10 sm:pt-0 lg:pr-12`;

  /** ~15% taller than 21/9: height scales by 1.15 at equal width → aspect 21/(9×1.15) = 140/69 */
  const heroBoxClass = `relative aspect-[140/69] w-full overflow-hidden rounded-none ${embedded ? "mb-4" : "mb-6 sm:mb-8"}`;

  const heroInner = item.imageSrc ? (
    <Image
      src={item.imageSrc}
      alt={item.imageAlt ?? item.heading}
      fill
      sizes="(max-width: 1024px) 100vw, 75vw"
      className="object-cover"
    />
  ) : null;

  return (
    <div className={shellClass}>
      {showInsetClose && onClose ? (
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-2 z-10 p-2 text-[var(--color-5)] hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-4)] ${embedded ? "right-4 sm:right-6 lg:right-8" : "right-2 sm:right-14 bg-white"}`}
          aria-label="Close"
        >
          <X className="h-6 w-6" aria-hidden />
        </button>
      ) : null}

      {/* Mobile accordion: thumbnail already in list row — skip duplicate hero image */}
      {!embedded && item.imageSrc ? <div className={heroBoxClass}>{heroInner}</div> : null}
      <div className={embedded ? "pt-2" : ""}>
        {embedded ? null : (
          <>
            <h3 className={`text-[var(--color-4)] display-s ${showInsetClose ? "pr-10" : ""}`}>
              {item.heading}
            </h3>

            <ArticleTeaser
              item={item}
              className="body-md mt-4 whitespace-pre-line text-[var(--color-5)]"
            />
          </>
        )}

        <CollectionArticleDescription
          value={item.description}
          className={embedded ? "!mt-0" : ""}
        />

        <ArticlePanelCtas rows={item.ctas ?? []} />
      </div>
    </div>
  );
}

type CollectionArticleSectionProps = {
  title?: string;
  description?: string;
  columnsPerRow?: number;
  /**
   * When false (card grid only), only the tiled grid is shown (no sidebar + article panel).
   * Item CTAs render on each card when present. Ignored when `sectionLayout` is `explorer`.
   */
  expandedMode?: boolean;
  /** Card grid with optional expansion vs always-on explorer split view. */
  sectionLayout?: CollectionArticleSectionLayout;
  /** When card grid + expanded: start on grid vs explorer. */
  defaultView?: CollectionArticleDefaultView;
  cardSize?: CollectionArticleCardSize;
  items: CollectionArticleItem[];
  /** Sanity block `_key`; used for scoped hashes `#key:item-slug` and stable scroll target ids. */
  sectionAnchorKey?: string;
};

export function CollectionArticleSection({
  title,
  description,
  columnsPerRow: columnsPerRowProp,
  expandedMode = true,
  sectionLayout = "cardGrid",
  defaultView = "grid",
  cardSize: cardSizeProp,
  items,
  sectionAnchorKey,
}: CollectionArticleSectionProps) {
  const cardSize = cardSizeFromProps(cardSizeProp);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() =>
    initialSelectedIndex(sectionLayout, expandedMode, defaultView),
  );
  /** Mobile accordion (lg:hidden): multiple panels can be open; desktop uses `selectedIndex` only */
  const [accordionOpen, setAccordionOpen] = useState<Set<number>>(() => {
    const idx = initialSelectedIndex(sectionLayout, expandedMode, defaultView);
    return idx !== null ? new Set([idx]) : new Set();
  });
  const [hashScrollNonce, setHashScrollNonce] = useState(0);
  const pendingScrollIdxRef = useRef<number | null>(null);
  /** Baseline `selectedIndex` after first paint — skip scroll on load; scroll when selection changes after. */
  const prevSelectedForArticleScrollRef = useRef<number | null | undefined>(undefined);
  const desktopArticleRef = useRef<HTMLElement | null>(null);
  const reactId = useId();
  const idPrefix = useMemo(() => reactId.replace(/:/g, ""), [reactId]);
  const sectionAnchorKeyResolved = sectionAnchorKey ?? idPrefix;
  const itemSlugs = useMemo(() => uniqueAnchorSlugsForItems(items.map((i) => i.heading)), [items]);

  const isExplorerLayout = sectionLayout === "explorer";
  const tiledOnly = !isExplorerLayout && !expandedMode;

  useEffect(() => {
    if (!items.length || tiledOnly) return;

    const applyHash = () => {
      const parsed = parseCollectionArticleHash(
        typeof window !== "undefined" ? window.location.hash : "",
      );
      if (!parsed) return;

      if (parsed.scopedPrefix !== null) {
        if (parsed.scopedPrefix !== sectionAnchorKeyResolved) return;
        const idx = itemSlugs.indexOf(parsed.itemSlug);
        if (idx === -1) return;
        setSelectedIndex(idx);
        setAccordionOpen(new Set([idx]));
        pendingScrollIdxRef.current = idx;
        setHashScrollNonce((n) => n + 1);
        return;
      }

      if (!claimUnscopedFragment(parsed.itemSlug, sectionAnchorKeyResolved)) return;
      const idx = itemSlugs.indexOf(parsed.itemSlug);
      if (idx === -1) return;
      setSelectedIndex(idx);
      setAccordionOpen(new Set([idx]));
      pendingScrollIdxRef.current = idx;
      setHashScrollNonce((n) => n + 1);
    };

    applyHash();

    const onHashChange = () => {
      resetUnscopedHashClaims();
      applyHash();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [items.length, tiledOnly, itemSlugs, sectionAnchorKeyResolved]);

  useLayoutEffect(() => {
    if (hashScrollNonce === 0) return;
    const idx = pendingScrollIdxRef.current;
    if (idx === null) return;
    pendingScrollIdxRef.current = null;
    const slug = itemSlugs[idx];
    if (!slug) return;
    const id = collectionArticleScrollTargetId(sectionAnchorKeyResolved, slug);
    document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [hashScrollNonce, itemSlugs, sectionAnchorKeyResolved]);

  /** Desktop explorer: smooth-scroll the article panel to the top when switching items. */
  useLayoutEffect(() => {
    if (typeof window === "undefined" || !items.length) return;
    const selectedItem =
      selectedIndex !== null && items[selectedIndex] !== undefined ? items[selectedIndex] : null;
    const showExplorerPane =
      isExplorerLayout || (expandedMode && selectedIndex !== null && !tiledOnly);

    if (!showExplorerPane || selectedIndex === null || !selectedItem) {
      prevSelectedForArticleScrollRef.current = selectedIndex;
      return;
    }
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const prev = prevSelectedForArticleScrollRef.current;
    if (prev === undefined) {
      prevSelectedForArticleScrollRef.current = selectedIndex;
      return;
    }
    if (prev === selectedIndex) {
      return;
    }
    prevSelectedForArticleScrollRef.current = selectedIndex;

    requestAnimationFrame(() => {
      desktopArticleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [items, selectedIndex, isExplorerLayout, expandedMode, tiledOnly]);

  const masonryColsClass = MASONRY_COLS_CLASS[columnsPerRowFromCms(columnsPerRowProp)];

  if (!items.length) return null;

  const selected =
    selectedIndex !== null && items[selectedIndex] !== undefined ? items[selectedIndex] : null;
  const showExplorer = isExplorerLayout || (expandedMode && selectedIndex !== null && !tiledOnly);
  const showCardGrid = !tiledOnly && !isExplorerLayout && expandedMode && selectedIndex === null;
  const showClose = sectionLayout === "cardGrid" && expandedMode && selectedIndex !== null;

  return (
    <div className="my-10 pl-4 max-w-6xl m-auto">
      {title ? <h2 className="heading-2 text-center mt-10">{title}</h2> : null}
      {description ? (
        <Container maxWidth="narrow" className="mt-6 mb-4 text-center">
          <p className="body-md text-slate-600 whitespace-pre-line">{description}</p>
        </Container>
      ) : null}

      {tiledOnly ? (
        <div className={`mt-8 gap-x-4 ${masonryColsClass}`}>
          {items.map((item, i) => (
            <div key={`${idPrefix}-tile-${i}`} className="mb-4 w-full min-h-0 break-inside-avoid">
              <PreviewBlock
                item={item}
                variant="grid"
                cardSize={cardSize}
                imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                footer={
                  item.ctas.length ? (
                    <ArticlePanelCtas rows={item.ctas} className="my-4" />
                  ) : undefined
                }
              />
            </div>
          ))}
        </div>
      ) : showCardGrid ? (
        <Container>
          <div className={`mt-8 gap-x-4 ${masonryColsClass}`}>
            {items.map((item, i) => (
              <div
                key={`${idPrefix}-grid-${i}`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedIndex(i);
                  setAccordionOpen(new Set([i]));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedIndex(i);
                    setAccordionOpen(new Set([i]));
                  }
                }}
                className="mb-4 w-full min-h-0 cursor-pointer break-inside-avoid rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
              >
                <PreviewBlock
                  item={item}
                  variant="grid"
                  cardSize={cardSize}
                  imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </Container>
      ) : showExplorer && selectedIndex !== null && selected ? (
        <div
          className={`${EXPLORER_FULL_BLEED} mt-12 collection-article-scroll-target`}
          id={collectionArticleScrollTargetId(
            sectionAnchorKeyResolved,
            itemSlugs[selectedIndex] ?? "",
          )}
        >
          {/* Small screens: accordion (preview header + expandable article) */}
          <div className="lg:hidden">
            {showClose ? (
              <div className="flex w-full justify-end px-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIndex(null);
                    setAccordionOpen(new Set());
                  }}
                  className="p-2 text-[var(--color-5)] hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-4)]"
                  aria-label="Back to grid"
                >
                  <X className="h-6 w-6" aria-hidden />
                </button>
              </div>
            ) : null}
            <div
              className="flex flex-col gap-0"
              role="list"
              aria-label={title ?? "Collection items"}
            >
              {items.map((item, i) => {
                const open = accordionOpen.has(i);
                const headingId = `${idPrefix}-acc-h-${i}`;
                const panelId = `${idPrefix}-acc-p-${i}`;
                return (
                  <div
                    key={`${idPrefix}-acc-${i}`}
                    role="listitem"
                    className="w-full border-b border-slate-200 last:border-b-0"
                  >
                    <button
                      type="button"
                      id={headingId}
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => {
                        const willOpen = !accordionOpen.has(i);
                        setAccordionOpen((prev) => {
                          if (prev.has(i)) {
                            return new Set();
                          }
                          return new Set([i]);
                        });
                        if (willOpen) {
                          setSelectedIndex(i);
                        }
                      }}
                      className="w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-2)]"
                    >
                      <PreviewBlock
                        item={item}
                        variant="sidebar"
                        cardSize={cardSize}
                        imageSizes="(max-width: 1024px) 100vw, 20vw"
                        explorerTone={open ? "active" : "inactive"}
                      />
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headingId}
                      aria-hidden={!open}
                      className="grid"
                      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                    >
                      <div className={`min-h-0 overflow-hidden ${open ? "bg-slate-50/95" : ""}`}>
                        <ExplorerArticleBody item={item} embedded showInsetClose={false} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Large screens: sidebar + article */}
          <div className="hidden gap-0 lg:grid lg:grid-cols-12 lg:items-start">
            <div
              className="flex flex-col gap-2 lg:sticky lg:top-25 lg:col-span-5 lg:max-h-[calc(100vh-5.5rem)] lg:self-start lg:overflow-y-auto lg:pr-2 z-50 relative overflow-x-visible"
              role="listbox"
              aria-label={title ?? "Collection items"}
            >
              {items.map((item, i) => {
                const selectedHere = selectedIndex === i;
                return (
                  <div
                    key={`${idPrefix}-side-${i}`}
                    role="option"
                    aria-selected={selectedHere}
                    tabIndex={0}
                    onClick={() => setSelectedIndex(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedIndex(i);
                      }
                    }}
                    className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-2)]"
                  >
                    <PreviewBlock
                      item={item}
                      variant="sidebar"
                      cardSize={cardSize}
                      imageSizes="(max-width: 1024px) 100vw, 20vw"
                      explorerTone={selectedHere ? "active" : "inactive"}
                    />
                  </div>
                );
              })}
            </div>

            <div className="relative min-h-48 min-w-0 overflow-x-hidden lg:col-span-7">
              <article
                ref={desktopArticleRef}
                key={selectedIndex}
                role="article"
                className="collection-explorer-article-panel collection-article-scroll-target relative"
              >
                <ExplorerArticleBody
                  item={selected}
                  showInsetClose={showClose}
                  onClose={() => {
                    setSelectedIndex(null);
                    setAccordionOpen(new Set());
                  }}
                />
              </article>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
