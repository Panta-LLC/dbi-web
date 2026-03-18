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
      <h2 className="heading-2 text-center text-slate-900 mb-6 mt-15">{title}</h2>

      <div
        className="flex flex-row w-full overflow-hidden items-stretch"
        style={{ minHeight: "140px", backgroundColor: ORANGE_ACCENT }}
      >
        {/* Metric panels */}
        <div className="flex-1 flex flex-row min-w-0 bg-white max-w-4xl mx-auto z-10">
          {/* Left orange slanted block */}
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
            const isFirst = index === 0;
            const isLast = index === metrics.length - 1;
            const panelClip = "polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)";

            const content = (
              <>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
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
          {/* Right orange slanted block */}
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
