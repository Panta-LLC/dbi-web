"use client";

import { useCallback, useId, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/Button";
import { computeCampaignPace, type CampaignPace, type PaceStatus } from "@/lib/campaign-pace";

export type CampaignMilestone = { date: string; label: string };

type CampaignPaceMeterProps = {
  goal: number;
  raised: number;
  /** ISO date-times; the campaign runs from start up to end. */
  start: string;
  end: string;
  title?: string;
  eyebrow?: string;
  /** Fixed "current time". Leave unset on the site; stories pin it for stable states. */
  now?: string | number | Date;
  /** Tick the countdown every second. */
  live?: boolean;
  milestones?: CampaignMilestone[];
  ctaHref?: string;
  ctaLabel?: string;
  variant?: "full" | "compact";
  className?: string;
};

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const shortDate = (d: Date | number) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/**
 * Current time that ticks once a second. Starts from `now` when given, so a pinned
 * story still counts down; without it the clock is only read after mount, which keeps
 * server and client HTML identical.
 */
const wholeSecond = () => Math.floor(Date.now() / 1000) * 1000;
const noServerClock = () => null;

function useClock(now: CampaignPaceMeterProps["now"], live: boolean) {
  const base = now == null ? null : new Date(now).getTime();
  const [mountedAt] = useState(wholeSecond);
  const subscribe = useCallback(
    (onTick: () => void) => {
      if (!live) return () => {};
      const id = setInterval(onTick, 1000);
      return () => clearInterval(id);
    },
    [live],
  );
  const wall = useSyncExternalStore(subscribe, live ? wholeSecond : () => mountedAt, noServerClock);
  if (wall == null) return base;
  return base == null ? wall : base + (wall - mountedAt);
}

const STATUS_LABEL: Record<PaceStatus, string> = {
  upcoming: "Starting soon",
  ahead: "Ahead of pace",
  "on-pace": "On pace",
  behind: "Behind pace",
  "final-hours": "Final hours",
  reached: "Goal reached",
  "ended-short": "Campaign closed",
};

const STATUS_STYLE: Record<PaceStatus, string> = {
  upcoming: "bg-[var(--color-7)] text-[var(--color-4)]",
  ahead: "bg-[var(--color-1)] text-white",
  "on-pace": "bg-[var(--color-7)] text-[var(--color-4)]",
  behind: "bg-[var(--color-6)] text-[#9a4700]",
  "final-hours": "bg-[var(--color-2)] text-black motion-safe:animate-pulse",
  reached: "bg-[var(--color-2)] text-black",
  "ended-short": "bg-slate-200 text-slate-700",
};

function insight(p: CampaignPace, start: number, end: number, goal: number): string {
  const unitShare = usd(goal / p.segments.length);
  const days = `${p.daysLeft} ${p.daysLeft === 1 ? "day" : "days"}`;
  const fundedThrough = start + Math.min(1, p.raisedShare) * (end - start);
  switch (p.status) {
    case "upcoming":
      return `Launches ${shortDate(start)}. Each ${p.unit} of the campaign carries ${unitShare} of the goal.`;
    case "ahead":
      return `${usd(p.delta)} ahead of pace — gifts so far carry the campaign through ${shortDate(fundedThrough)}.`;
    case "on-pace":
      return `Right on pace. ${usd(p.perDayNeeded)} a day for the next ${days} reaches the goal.`;
    case "behind":
      return `${usd(-p.delta)} behind pace. ${usd(p.perDayNeeded)} a day for the next ${days} still reaches the goal.`;
    case "final-hours":
      return `${usd(p.remaining)} to go before the clock runs out.`;
    case "reached":
      return p.phase === "ended"
        ? `Goal reached at ${Math.round(p.raisedShare * 100)}% — thank you to every donor.`
        : `Goal reached with ${days} to spare. Every gift now goes beyond the goal.`;
    case "ended-short":
      return `Closed at ${Math.round(p.raisedShare * 100)}% of the goal. Thank you to every donor.`;
  }
}

function CountdownTile({ value, label, hot }: { value: number | null; label: string; hot: boolean }) {
  return (
    <div
      className={`flex min-w-[3.25rem] flex-col items-center px-3 py-1.5 -skew-x-12 sm:min-w-[4rem] ${
        hot ? "bg-[var(--color-2)] text-black" : "bg-[var(--color-1)] text-white"
      }`}
    >
      <span className="skew-x-12 font-inter text-2xl font-bold tabular-nums leading-tight sm:text-3xl">
        {value == null ? "--" : String(value).padStart(2, "0")}
      </span>
      <span className="skew-x-12 text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80">{label}</span>
    </div>
  );
}

export function CampaignPaceMeter({
  goal,
  raised,
  start,
  end,
  title = "Year-End Campaign",
  eyebrow,
  now,
  live = true,
  milestones = [],
  ctaHref,
  ctaLabel = "Give now",
  variant = "full",
  className = "",
}: CampaignPaceMeterProps) {
  const headingId = useId();
  const clock = useClock(now, live);
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  const p = computeCampaignPace({ goal, raised, start, end, now: clock ?? startMs });
  const ready = clock != null;
  const full = variant === "full";
  const hot = p.status === "final-hours";
  const c = p.countdown;
  const pct = Math.round(p.raisedShare * 100);
  const showToday = ready && p.phase === "live";
  const summary = insight(p, startMs, endMs, goal);

  return (
    <section
      aria-labelledby={headingId}
      className={`relative overflow-hidden bg-[var(--color-8)] text-slate-900 ${full ? "px-5 py-6 sm:px-8 sm:py-8" : "px-4 py-4"} ${className}`}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-1)]">{eyebrow}</p>
          )}
          <h2 id={headingId} className={full ? "heading-3 mt-1" : "text-base font-semibold"}>
            {title}
          </h2>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className={`font-inter font-bold tabular-nums ${full ? "text-4xl sm:text-5xl" : "text-2xl"}`}>
              {usd(raised)}
            </span>
            <span className="text-sm text-slate-700">
              raised of {usd(goal)} · {pct}%
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[p.status]}`}>
              {STATUS_LABEL[p.status]}
            </span>
          </div>
        </div>

        {p.phase !== "ended" && (
          <div className="shrink-0">
            <div className="flex gap-1.5 pl-2" aria-hidden>
              <CountdownTile value={ready ? c.days : null} label="days" hot={hot} />
              <CountdownTile value={ready ? c.hours : null} label="hrs" hot={hot} />
              <CountdownTile value={ready ? c.minutes : null} label="min" hot={hot} />
              {full && <CountdownTile value={ready ? c.seconds : null} label="sec" hot={hot} />}
            </div>
            <p className="mt-1.5 text-xs text-slate-600 md:text-right">
              {p.phase === "upcoming" ? `until launch on ${shortDate(startMs)}` : `left · ends ${shortDate(endMs - 1)}`}
            </p>
          </div>
        )}
      </div>

      {/* Pace track: one slanted block per day (or week). Blocks are time; the orange
          fill is money, with each block holding an equal share of the goal. */}
      <div className={full ? "mt-8" : "mt-7"}>
        <div
          className="relative"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={goal}
          aria-valuenow={Math.min(raised, goal)}
          aria-valuetext={`${usd(raised)} of ${usd(goal)} raised, ${p.phase === "ended" ? "campaign ended" : `${p.daysLeft} days left`}. ${summary}`}
          aria-label="Fundraising progress against time remaining"
        >
          {showToday && (
            <div
              className="pointer-events-none absolute -top-6 bottom-[-6px] z-10 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${p.timeShare * 100}%` }}
              aria-hidden
            >
              <span className="rounded-sm bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                Today
              </span>
              <span className="w-[2px] flex-1 bg-slate-900" />
            </div>
          )}
          <div className={`flex ${p.segments.length > 30 ? "gap-[2px]" : "gap-[3px]"} px-1.5`} aria-hidden>
            {p.segments.map((seg) => {
              const behindGap = seg.time === "past" && seg.fill < 1;
              return (
                <div
                  key={seg.index}
                  title={`${shortDate(seg.start)}${p.unit === "week" ? `–${shortDate(seg.end.getTime() - 1)}` : ""} · ${Math.round(seg.fill * 100)}% of its share raised`}
                  className={`relative -skew-x-12 overflow-hidden ${full ? "h-14 sm:h-16" : "h-8"} ${
                    seg.time === "future"
                      ? "bg-white ring-1 ring-inset ring-[var(--color-1)]/40"
                      : seg.time === "current"
                        ? "bg-white ring-2 ring-inset ring-slate-900"
                        : "bg-[var(--color-7)]"
                  }`}
                  style={{ flexGrow: seg.end.getTime() - seg.start.getTime(), flexBasis: 0 }}
                >
                  {behindGap && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, transparent 0 4px, rgb(42 87 156 / 0.22) 4px 6px)",
                      }}
                    />
                  )}
                  <div
                    className="absolute inset-y-0 left-0 bg-[var(--color-2)] motion-safe:transition-[width] motion-safe:duration-700"
                    style={{ width: `${seg.fill * 100}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {full && (
          <div className="relative mt-2 h-5 text-xs text-slate-600">
            <span className="absolute left-0">{shortDate(startMs)}</span>
            {milestones.map((m) => {
              const at = (new Date(m.date).getTime() - startMs) / (endMs - startMs);
              if (at <= 0.06 || at >= 0.94) return null;
              return (
                <span
                  key={m.date + m.label}
                  className="absolute -translate-x-1/2 whitespace-nowrap font-semibold text-[var(--color-1)]"
                  style={{ left: `${at * 100}%` }}
                >
                  ▲ {m.label}
                </span>
              );
            })}
            <span className="absolute right-0">{shortDate(endMs - 1)}</span>
          </div>
        )}
      </div>

      {full && (
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="body-md font-medium text-slate-900">{ready ? summary : " "}</p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-4 -skew-x-12 bg-[var(--color-2)]" aria-hidden /> Raised
              </li>
              {p.phase !== "ended" && (
                <li className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-4 -skew-x-12 bg-white ring-1 ring-inset ring-[var(--color-1)]/40" aria-hidden />
                  {p.unit === "week" ? "Week" : "Day"} left · {usd(goal / p.segments.length)} each
                </li>
              )}
              {p.segments.some((s) => s.time === "past" && s.fill < 1) && (
                <li className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-3 w-4 -skew-x-12 bg-[var(--color-7)]"
                    style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 4px, rgb(42 87 156 / 0.22) 4px 6px)" }}
                    aria-hidden
                  />
                  {p.phase === "ended" ? "Short of goal" : "Gap to close"}
                </li>
              )}
            </ul>
          </div>
          {ctaHref && p.phase !== "ended" && (
            <Button href={ctaHref} variant="cta-primary" className="shrink-0 self-start sm:self-center">
              {ctaLabel}
            </Button>
          )}
        </div>
      )}
      {!full && (ready || ctaHref) && (
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-700">{ready ? summary : " "}</p>
          {ctaHref && p.phase !== "ended" && (
            <Button href={ctaHref} variant="cta-primary" className="shrink-0 self-start sm:self-center">
              {ctaLabel}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
