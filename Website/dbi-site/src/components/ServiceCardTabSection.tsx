"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { ContentCard } from "@/components/ContentCard";
import { GridCardCtaTrigger } from "@/components/GridCardCtaTrigger";
import type { GridCardCtaResolved } from "@/lib/grid-card-cta";
import { ProgramCardCompactTab } from "@/components/ProgramCards";
import { Container } from "@/components/Container";

export type ServiceCardTabItem = {
  title: string;
  description?: string;
  /** Shown in detail panel; falls back to `description`. */
  detail?: string;
  imageSrc?: string;
  imageAlt?: string;
  hoverColor?: string;
  cta?: GridCardCtaResolved;
};

export type CardGridColumnsPerRow = 2 | 3 | 4;

const GRID_COLS_CLASS: Record<CardGridColumnsPerRow, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

function columnsPerRowFromCms(value: number | undefined): CardGridColumnsPerRow {
  if (value === 3 || value === 4) return value;
  return 2;
}

type ServiceCardTabSectionProps = {
  title?: string;
  description?: string;
  /** Cards per row on large screens (default 2). */
  columnsPerRow?: number;
  items: ServiceCardTabItem[];
};

function DetailPanelCta({ cta }: { cta: GridCardCtaResolved }) {
  return (
    <div className="mt-6">
      <GridCardCtaTrigger cta={cta} triggerVariant="cta-primary" className="px-4 py-2" />
    </div>
  );
}

function panelBody(item: ServiceCardTabItem): string | undefined {
  const d = item.detail?.trim();
  if (d) return d;
  return item.description?.trim();
}

export function ServiceCardTabSection({
  title,
  description,
  columnsPerRow: columnsPerRowProp,
  items,
}: ServiceCardTabSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const reactId = useId();
  const idPrefix = useMemo(() => reactId.replace(/:/g, ""), [reactId]);
  const tabId = (i: number) => `${idPrefix}-tab-${i}`;
  const gridColsClass = GRID_COLS_CLASS[columnsPerRowFromCms(columnsPerRowProp)];

  if (!items.length) return null;

  return (
    <>
      {title ? <h2 className="heading-2 text-center">{title}</h2> : null}
      {description ? (
        <Container maxWidth="narrow" className="mt-6 text-center">
          <p className="body-md text-slate-600 whitespace-pre-line">{description}</p>
        </Container>
      ) : null}

      {selectedIndex === null ? (
        <div className={`mt-8 grid gap-4 ${gridColsClass}`}>
          {items.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
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
              <ContentCard
                title={item.title}
                description={item.description}
                className="pointer-events-none h-full"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <div
            role="tablist"
            aria-label={title ?? "Services"}
            className="relative z-10 mx-auto flex w-full max-w-5xl flex-col flex-wrap items-stretch justify-center gap-3 overflow-x-auto bg-white px-3 sm:flex-row"
          >
            {items.map((item, i) => (
              <ProgramCardCompactTab
                key={`${item.title}-tab-${i}`}
                tabId={tabId(i)}
                title={item.title}
                imageSrc={item.imageSrc}
                imageAlt={item.imageAlt}
                hoverColor={item.hoverColor}
                selected={selectedIndex === i}
                onClick={() => {
                  if (selectedIndex === i) setSelectedIndex(null);
                  else setSelectedIndex(i);
                }}
              />
            ))}
          </div>

          {items.map((item, i) => {
            const isShown = selectedIndex === i;
            const body = panelBody(item);
            return (
              <div
                key={`${item.title}-panel-${i}`}
                role="tabpanel"
                id={`${tabId(i)}-panel`}
                hidden={!isShown}
                aria-labelledby={tabId(i)}
                className={
                  isShown
                    ? "content-card relative mx-auto mt-8 max-w-3xl bg-white p-10 px-13"
                    : "hidden"
                }
              >
                {isShown ? (
                  <>
                    <h3 className="display-s text-slate-900">{item.title}</h3>
                    {body ? (
                      <p className="mt-3 body-md whitespace-pre-line text-slate-700">{body}</p>
                    ) : null}
                    {item.cta ? <DetailPanelCta cta={item.cta} /> : null}
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
