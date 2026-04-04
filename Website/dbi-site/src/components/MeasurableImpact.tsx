"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type MeasurableImpactMetric = {
  value: string;
  label: string;
  href?: string;
};

type MeasurableImpactProps = {
  title?: string;
  metrics?: MeasurableImpactMetric[];
  className?: string;
};

const PANEL_BG = "var(--color-8)";
const ORANGE_ACCENT = "var(--color-2, #ff7900)";
const COUNT_MS = 750;

type ParsedMetric = {
  prefix: string;
  suffix: string;
  target: number;
};

/** First contiguous digit run (with optional commas / one decimal group). */
function parseMetricValue(raw: string): ParsedMetric | null {
  const trimmed = raw.trim();
  const m = trimmed.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const [, prefix, numPart, suffix] = m;
  const n = parseFloat(numPart.replace(/,/g, ""));
  if (!Number.isFinite(n)) return null;
  return { prefix, suffix, target: n };
}

function formatMetricDisplay(p: ParsedMetric, current: number): string {
  const { prefix, suffix, target } = p;
  const isInt = Number.isInteger(target) || Math.abs(target - Math.round(target)) < 1e-9;
  const rounded = isInt ? Math.min(Math.floor(current), Math.floor(target)) : current;
  const n = isInt ? Math.round(rounded) : Number(rounded.toFixed(2));
  const numStr = isInt
    ? n.toLocaleString("en-US")
    : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${prefix}${numStr}${suffix}`;
}

/** Random value for slot-machine shuffle (same digit scale as target). */
function randomShuffleValue(p: ParsedMetric): number {
  const { target } = p;
  const isInt = Number.isInteger(target) || Math.abs(target - Math.round(target)) < 1e-9;
  if (isInt) {
    const max = Math.max(0, Math.floor(target));
    return Math.floor(Math.random() * (max + 1));
  }
  return Math.random() * target * (0.25 + Math.random() * 1.25);
}

export function MeasurableImpact({
  title = "Measurable Impact",
  metrics = [],
  className = "",
}: MeasurableImpactProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const metricsRef = useRef(metrics);
  useLayoutEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);
  const [revealed, setRevealed] = useState(false);

  const [displayValues, setDisplayValues] = useState<string[]>(() =>
    metrics.map((m) => {
      const p = parseMetricValue(m.value);
      return p ? formatMetricDisplay(p, 0) : m.value;
    }),
  );

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -5% 0px",
        threshold: 0.1,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!revealed) return;

    const list = metricsRef.current;
    if (!list.length) return;

    setDisplayValues(
      list.map((m) => {
        const p = parseMetricValue(m.value);
        return p ? formatMetricDisplay(p, 0) : m.value;
      }),
    );

    let cancelled = false;
    let rafId: number | undefined;
    const animStart = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - animStart;

      setDisplayValues(
        list.map((m, index) => {
          const p = parseMetricValue(m.value);
          if (!p) return m.value;

          const startCount = index * COUNT_MS;
          const endCount = startCount + COUNT_MS;

          if (elapsed < startCount) {
            return formatMetricDisplay(p, randomShuffleValue(p));
          }
          if (elapsed < endCount) {
            const t = (elapsed - startCount) / COUNT_MS;
            return formatMetricDisplay(p, p.target * t);
          }
          return formatMetricDisplay(p, p.target);
        }),
      );

      const n = list.length;
      const lastEnd = n > 0 ? (n - 1) * COUNT_MS + COUNT_MS : 0;
      if (elapsed < lastEnd) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, [revealed]);

  if (!metrics.length) return null;

  return (
    <div ref={rootRef} className={className}>
      <h2 className="heading-2 mt-16 mb-6 text-center text-slate-900">{title}</h2>

      <div
        className="flex flex-row w-full overflow-hidden items-stretch"
        style={{ minHeight: "140px", backgroundColor: ORANGE_ACCENT }}
      >
        <div className="flex-1 flex flex-row min-w-0 bg-white max-w-4xl mx-auto z-10">
          <div
            className="shrink-0 w-10 sm:w-16 md:w-20 lg:w-24"
            style={{
              backgroundColor: ORANGE_ACCENT,
              clipPath: "polygon(0 0, 100% 0, 70% 100%, 0 100%)",
              WebkitClipPath: "polygon(0 0, 100% 0, 70% 100%, 0 100%)",
            }}
            aria-hidden
          />
          {metrics.map((metric, index) => {
            const panelClip = "polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)";

            const content = (
              <>
                <span className="display-l font-bold text-slate-900">{displayValues[index]}</span>
                <span className="mt-1 text-sm md:text-base text-slate-700 font-normal">
                  {metric.label}
                </span>
              </>
            );

            return (
              <div
                key={metric.label + index}
                className="flex-1 min-w-0 flex flex-col items-center justify-center px-4 py-6 md:py-8 ml-[-15px]"
                style={{
                  backgroundColor: PANEL_BG,
                  clipPath: panelClip,
                  WebkitClipPath: panelClip,
                }}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  {content}
                </div>
              </div>
            );
          })}
          <div
            className="shrink-0 w-10 sm:w-16 md:w-20 lg:w-24 ml-[-10px]"
            style={{
              backgroundColor: ORANGE_ACCENT,
              clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)",
              WebkitClipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)",
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
