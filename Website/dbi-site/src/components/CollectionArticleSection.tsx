"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { CtaModalForm } from "@/components/cta-modal-form";
import type { GridCardCtaResolved } from "@/lib/grid-card-cta";

export type CollectionArticleItem = {
  heading: string;
  summary?: string;
  /** Article panel line under title; if empty, summary is shown under the title instead. */
  subtitle?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  cta?: GridCardCtaResolved;
};

export type CollectionArticleColumnsPerRow = 2 | 3 | 4 | 5;

export type CollectionArticleCardSize = "sm" | "md" | "lg";

export type CollectionArticleSectionLayout = "cardGrid" | "explorer";

export type CollectionArticleDefaultView = "grid" | "explorer";

const GRID_COLS_CLASS: Record<CollectionArticleColumnsPerRow, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
};

const GRID_PADDING: Record<CollectionArticleCardSize, string> = {
  sm: "p-4 px-2",
  md: "p-10 px-3",
  lg: "p-12 px-4",
};

const GRID_IMAGE_BOX: Record<CollectionArticleCardSize, string> = {
  sm: "aspect-4/3 max-h-44",
  md: "aspect-4/3",
  lg: "aspect-4/3 min-h-[14rem]",
};

const GRID_TITLE: Record<CollectionArticleCardSize, string> = {
  sm: "text-base font-semibold",
  md: "heading-3",
  lg: "text-2xl font-semibold tracking-tight",
};

const GRID_SUMMARY: Record<CollectionArticleCardSize, string> = {
  sm: "text-sm line-clamp-3",
  md: "text-md",
  lg: "text-lg line-clamp-6",
};

const SIDEBAR_IMAGE_MAX: Record<CollectionArticleCardSize, string> = {
  sm: "max-h-20",
  md: "max-h-32",
  lg: "max-h-40",
};

/** Explorer sidebar / accordion: one thumbnail size active + inactive; flush edge, no padding on image */
const EXPLORER_LIST_THUMB = "relative size-28 shrink-0 overflow-hidden rounded-none sm:size-36";

/** Full-bleed breakout from padded Container (matches px-4 sm:px-6 lg:px-8) */
const EXPLORER_FULL_BLEED = "relative left-1/2 w-7xl -translate-x-1/2 overflow-x-hidden";

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

function DetailPanelCta({
  cta,
  className = "mt-6",
}: {
  cta: GridCardCtaResolved;
  className?: string;
}) {
  if (cta.kind === "link") {
    return (
      <div className={className}>
        <Button href={cta.href} variant="cta-primary" className="px-4 py-2">
          {cta.label}
        </Button>
      </div>
    );
  }
  return (
    <div className={className}>
      <CtaModalForm
        presentation={cta.presentation}
        formId={cta.formId}
        triggerLabel={cta.triggerLabel}
        messageContext={cta.messageContext}
        title={cta.title}
        description={cta.description}
        placeholders={cta.placeholders}
        submitLabel={cta.submitLabel}
        successMessage={cta.successMessage}
        triggerVariant="cta-primary"
        className="px-4 py-2"
      />
    </div>
  );
}

function PreviewBlock({
  item,
  imageSizes,
  variant,
  cardSize,
  footer,
  imageLayoutId,
  explorerTone,
}: {
  item: CollectionArticleItem;
  imageSizes: string;
  variant: "grid" | "sidebar";
  cardSize: CollectionArticleCardSize;
  footer?: ReactNode;
  /** Shared with article hero for grid → explorer transition */
  imageLayoutId?: string;
  /** Explorer sidebar: inactive = color-3; active = color-2 + color-3 text + right-pointing tab */
  explorerTone?: "inactive" | "active";
}) {
  const padding = variant === "sidebar" ? "p-3" : GRID_PADDING[cardSize];
  const imageBoxClass =
    variant === "sidebar" ? `aspect-4/3 ${SIDEBAR_IMAGE_MAX[cardSize]}` : GRID_IMAGE_BOX[cardSize];
  const titleClass = variant === "sidebar" ? "text-base" : `${GRID_TITLE[cardSize]} text-slate-900`;
  const summaryClass =
    variant === "sidebar"
      ? "text-sm line-clamp-4"
      : `mt-2 text-slate-700 whitespace-pre-line ${GRID_SUMMARY[cardSize]}`;

  const imageInner = item.imageSrc ? (
    <Image
      src={item.imageSrc}
      alt={item.imageAlt ?? item.heading}
      fill
      sizes={imageSizes}
      className="object-cover"
    />
  ) : null;

  const explorerListThumb = item.imageSrc ? (
    <div className={EXPLORER_LIST_THUMB + " mr-2 border-r-8 border-r-white"}>{imageInner}</div>
  ) : null;

  /** Right-pointing tab (same fill as --color-2), flush with the preview body like a speech-bubble tail */
  const explorerActiveRightTab = (
    <div
      className=" absolute right-[-13px] top-0 bottom-0 m-auto z-50 flex shrink-0 self-stretch"
      aria-hidden
    >
      <span className="h-0 w-0 absolute top-0 bottom-0 m-auto right-[-4px] border-y-[16px] border-l-[14px] border-y-transparent border-l-[var(--color-3)] sm:border-y-[16px] sm:border-l-[14px]" />
      <span className="h-0 w-0 absolute top-0 bottom-0 m-auto right-[4px] border-y-[14px] border-l-[12px] border-y-transparent border-l-[var(--color-4)] sm:border-y-[16px] sm:border-l-[14px]" />
    </div>
  );

  if (explorerTone === "active" || explorerTone === "inactive") {
    const active = explorerTone === "active";
    const shell = active ? "" : "bg-[var(--color-3)]";
    return (
      <div className={`relative w-full rounded-none border-0 shadow-none ${active ? "" : shell}`}>
        {active ? (
          <div className="flex w-full items-stretch">
            <div className="flex min-w-0 flex-1 bg-[var(--color-4)] text-[var(--color-3)]">
              {explorerListThumb}
              <div className="min-w-0 flex-1 px-3 py-6 justify-center flex flex-col">
                <h3 className="heading-3 text-[var(--color-3)]">{item.heading}</h3>
                {item.summary ? (
                  <p className="mt-1 line-clamp-4 text-sm whitespace-pre-line text-[var(--color-3)]/95">
                    {item.summary}
                  </p>
                ) : null}
              </div>
            </div>
            {explorerActiveRightTab}
          </div>
        ) : (
          <div
            className={`flex min-h-0 justify-center ${shell} ${item.imageSrc ? "flex-row" : "flex-col px-3 py-6"}`}
          >
            {explorerListThumb}
            <div className={`min-w-0 flex-1 justify-center ${item.imageSrc ? "px-3 py-6" : ""}`}>
              <h3 className="heading-3 text-[var(--color-4)]">{item.heading}</h3>
              {item.summary ? (
                <p className="mt-1 line-clamp-4 text-sm whitespace-pre-line text-[var(--color-5)]">
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
      className={`content-card relative flex h-full min-h-0 flex-col bg-white ${padding} ${footer ? "pb-0" : ""}`}
    >
      <div className={`flex min-h-0 flex-col ${footer ? "flex-1" : ""}`}>
        {item.imageSrc ? (
          imageLayoutId ? (
            <motion.div
              layoutId={imageLayoutId}
              className={`relative w-full overflow-hidden rounded-md ${imageBoxClass}`}
            >
              {imageInner}
            </motion.div>
          ) : (
            <div className={`relative w-full overflow-hidden rounded-md ${imageBoxClass}`}>
              {imageInner}
            </div>
          )
        ) : null}
        <h3 className={`text-slate-900 ${item.imageSrc ? "mt-4" : ""} ${titleClass}`}>
          {item.heading}
        </h3>
        {item.summary ? <p className={summaryClass}>{item.summary}</p> : null}
      </div>
      {footer ? (
        <div className="mt-auto border-t border-slate-100 px-0 pb-4 pt-4">{footer}</div>
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
  /** Set on desktop split view only so grid→explorer layout morph stays unique in the tree */
  heroLayoutId,
}: {
  item: CollectionArticleItem;
  showInsetClose: boolean;
  onClose?: () => void;
  embedded?: boolean;
  heroLayoutId?: string;
}) {
  const shellClass = embedded ? "relative max-md:px-6 max-md:py-6 py-12" : "relative pb-10";

  const heroBoxClass = `relative aspect-21/9 w-full overflow-hidden rounded-none ${embedded ? "mb-4" : "mb-6 sm:mb-8"}`;

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
    <div className={shellClass + " ml-2"}>
      {showInsetClose && onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-10 p-2 text-[var(--color-5)] hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-4)]"
          aria-label="Close"
        >
          <X className="h-6 w-6" aria-hidden />
        </button>
      ) : null}

      {item.imageSrc ? (
        heroLayoutId ? (
          <motion.div layoutId={heroLayoutId} className={heroBoxClass}>
            {heroInner}
          </motion.div>
        ) : (
          <div className={heroBoxClass}>{heroInner}</div>
        )
      ) : null}
      <div className="px-6 py-3">
        <h3
          className={`text-[var(--color-4)] ${embedded ? "text-xl font-semibold tracking-tight sm:text-2xl" : "display-s"} ${showInsetClose ? "pr-10" : ""}`}
        >
          {item.heading}
        </h3>

        <ArticleTeaser
          item={item}
          className="body-md mt-4 whitespace-pre-line text-[var(--color-5)]"
        />

        {item.description ? (
          <p className="mt-6 text-md whitespace-pre-line text-[var(--color-5)]">
            {item.description}
          </p>
        ) : null}

        {item.cta ? <DetailPanelCta cta={item.cta} /> : null}
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
}: CollectionArticleSectionProps) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.22;
  const cardSize = cardSizeFromProps(cardSizeProp);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() =>
    initialSelectedIndex(sectionLayout, expandedMode, defaultView),
  );
  const reactId = useId();
  const idPrefix = useMemo(() => reactId.replace(/:/g, ""), [reactId]);
  const gridColsClass = GRID_COLS_CLASS[columnsPerRowFromCms(columnsPerRowProp)];

  if (!items.length) return null;

  const isExplorerLayout = sectionLayout === "explorer";
  const tiledOnly = !isExplorerLayout && !expandedMode;
  const selected =
    selectedIndex !== null && items[selectedIndex] !== undefined ? items[selectedIndex] : null;
  const showExplorer = isExplorerLayout || (expandedMode && selectedIndex !== null && !tiledOnly);
  const showCardGrid = !tiledOnly && !isExplorerLayout && expandedMode && selectedIndex === null;
  const showClose = sectionLayout === "cardGrid" && expandedMode && selectedIndex !== null;

  const transition = { duration };

  return (
    <>
      {title ? <h2 className="heading-2 text-center">{title}</h2> : null}
      {description ? (
        <p className="body-md mx-auto mt-6 max-w-3xl text-center text-slate-600 whitespace-pre-line">
          {description}
        </p>
      ) : null}

      {tiledOnly ? (
        <motion.div layout className={`mt-8 grid gap-4 ${gridColsClass}`}>
          {items.map((item, i) => (
            <div key={`${idPrefix}-tile-${i}`} className="h-full min-h-0">
              <PreviewBlock
                item={item}
                variant="grid"
                cardSize={cardSize}
                imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                footer={item.cta ? <DetailPanelCta cta={item.cta} className="my-4" /> : undefined}
              />
            </div>
          ))}
        </motion.div>
      ) : showCardGrid ? (
        <motion.div layout className={`mt-8 grid gap-4 ${gridColsClass}`}>
          {items.map((item, i) => (
            <motion.div
              layout
              key={`${idPrefix}-grid-${i}`}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedIndex(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedIndex(i);
                }
              }}
              className="cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            >
              <PreviewBlock
                item={item}
                variant="grid"
                cardSize={cardSize}
                imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                imageLayoutId={`${idPrefix}-collection-hero-${i}`}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : showExplorer && selectedIndex !== null && selected ? (
        <div className={`${EXPLORER_FULL_BLEED} mt-10`}>
          {/* Small screens: accordion (preview header + expandable article) */}
          <div className="lg:hidden">
            {showClose ? (
              <div className="flex w-full justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className="p-2 text-[var(--color-5)] hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-4)]"
                  aria-label="Back to grid"
                >
                  <X className="h-6 w-6" aria-hidden />
                </button>
              </div>
            ) : null}
            <div
              className="flex flex-col gap-2"
              role="list"
              aria-label={title ?? "Collection items"}
            >
              {items.map((item, i) => {
                const open = selectedIndex === i;
                const headingId = `${idPrefix}-acc-h-${i}`;
                const panelId = `${idPrefix}-acc-p-${i}`;
                return (
                  <div key={`${idPrefix}-acc-${i}`} role="listitem" className="w-full">
                    <button
                      type="button"
                      id={headingId}
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setSelectedIndex(i)}
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
                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={headingId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={transition}
                        >
                          <ExplorerArticleBody item={item} embedded showInsetClose={false} />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Large screens: sidebar + article */}
          <motion.div layout className="hidden gap-0 lg:grid lg:grid-cols-6">
            <div
              className="flex flex-col gap-0 lg:col-span-3"
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

            <div className="relative min-h-48 lg:col-span-3">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={selectedIndex}
                  role="article"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                  className="relative"
                >
                  <ExplorerArticleBody
                    item={selected}
                    heroLayoutId={`${idPrefix}-collection-hero-${selectedIndex}`}
                    showInsetClose={showClose}
                    onClose={() => setSelectedIndex(null)}
                  />
                </motion.article>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      ) : null}
    </>
  );
}
