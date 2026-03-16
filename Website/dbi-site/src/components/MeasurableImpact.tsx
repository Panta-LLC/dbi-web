import { Link } from "@/components/Link";

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

const PANEL_BG = "#f0f0f0";
const ORANGE_ACCENT = "var(--color-2, #ff7900)";

export function MeasurableImpact({
  title = "Measurable Impact",
  metrics = [],
  className = "",
}: MeasurableImpactProps) {
  if (!metrics.length) return null;

  return (
    <div className={className}>
      <h2 className="heading-2 text-center text-slate-900 mb-8 md:mb-10">
        {title}
      </h2>

      <div className="flex flex-row w-full overflow-hidden" style={{ minHeight: "140px" }}>
          {/* Left orange trapezoid — angles up to the right */}
          <div
            className="shrink-0 w-12 md:w-16 lg:w-20 hidden sm:block"
            style={{
              background: ORANGE_ACCENT,
              clipPath: "polygon(0 0, 100% 0, 70% 100%, 0 100%)",
              WebkitClipPath: "polygon(0 0, 100% 0, 70% 100%, 0 100%)",
            }}
            aria-hidden
          />

          {/* Metric panels with white diagonal dividers */}
          <div className="flex-1 flex flex-row gap-px min-w-0 bg-white overflow-hidden">
            {metrics.map((metric, index) => {
              const isFirst = index === 0;
              const isLast = index === metrics.length - 1;
              const panelClip = isFirst
                ? "polygon(0 0, 100% 0, 98% 100%, 0 100%)"
                : isLast
                  ? "polygon(2% 0, 100% 0, 100% 100%, 0 100%)"
                  : "polygon(2% 0, 100% 0, 98% 100%, 0 100%)";

              const content = (
                <>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
                    {metric.value}
                  </span>
                  <span className="mt-1 text-sm md:text-base text-slate-700 font-normal">
                    {metric.label}
                  </span>
                </>
              );

              return (
                <div
                  key={metric.label + index}
                  className="flex-1 min-w-0 flex flex-col items-center justify-center px-4 py-6 md:py-8 relative"
                  style={{
                    backgroundColor: PANEL_BG,
                    clipPath: panelClip,
                    WebkitClipPath: panelClip,
                  }}
                >
                  {metric.href ? (
                    <Link
                      href={metric.href}
                      variant="cta"
                      className="flex flex-col items-center justify-center text-center touch-target rounded"
                      aria-label={`${metric.value} ${metric.label}`}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      {content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right orange trapezoid — angles up to the left */}
          <div
            className="shrink-0 w-12 md:w-16 lg:w-20 hidden sm:block"
            style={{
              background: ORANGE_ACCENT,
              clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)",
              WebkitClipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)",
            }}
            aria-hidden
          />
        </div>
    </div>
  );
}
