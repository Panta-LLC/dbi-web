/**
 * Relates a campaign's clock to its fundraising goal.
 *
 * The campaign is cut into equal time segments (days, or weeks for long campaigns), and
 * each segment also stands for an equal share of the goal. Raised money fills segments
 * from the left, so comparing the fill with "today's" segment shows whether giving is
 * ahead of or behind the pace needed to finish on time.
 */

const DAY_MS = 86_400_000;
const MAX_DAY_SEGMENTS = 45;
/** Within this share of the goal of the expected amount counts as "on pace". */
const ON_PACE_TOLERANCE = 0.02;

export type CampaignPhase = "upcoming" | "live" | "ended";
export type PaceStatus = "upcoming" | "ahead" | "on-pace" | "behind" | "final-hours" | "reached" | "ended-short";

export type PaceSegment = {
  index: number;
  start: Date;
  end: Date;
  /** Where the clock is relative to this segment. */
  time: "past" | "current" | "future";
  /** How much of this segment's share of the goal has been raised, 0–1. */
  fill: number;
};

export type CountdownParts = { days: number; hours: number; minutes: number; seconds: number };

export type CampaignPace = {
  phase: CampaignPhase;
  status: PaceStatus;
  /** Share of the campaign's time used, 0–1. */
  timeShare: number;
  /** Share of the goal raised, 0 and up (can exceed 1). */
  raisedShare: number;
  /** What would be raised by now at an even pace. */
  expected: number;
  /** raised − expected; positive means ahead. */
  delta: number;
  /** Amount still needed to reach the goal. */
  remaining: number;
  /** Whole days left (rounded up), 0 once ended. */
  daysLeft: number;
  /** Even daily amount that closes the goal by the end, 0 if reached or ended. */
  perDayNeeded: number;
  /** Time until the end (or until the start while upcoming). */
  countdown: CountdownParts;
  countdownMs: number;
  unit: "day" | "week";
  segments: PaceSegment[];
};

export function toCountdownParts(ms: number): CountdownParts {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function computeCampaignPace({
  goal,
  raised,
  start,
  end,
  now,
}: {
  goal: number;
  raised: number;
  start: Date | string;
  end: Date | string;
  now: Date | string | number;
}): CampaignPace {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const n = new Date(now).getTime();
  const span = Math.max(1, e - s);
  const safeGoal = Math.max(0, goal);
  const safeRaised = Math.max(0, raised);

  const phase: CampaignPhase = n < s ? "upcoming" : n >= e ? "ended" : "live";
  const timeShare = clamp01((n - s) / span);
  const raisedShare = safeGoal > 0 ? safeRaised / safeGoal : 0;
  const expected = safeGoal * timeShare;
  const delta = safeRaised - expected;
  const remaining = Math.max(0, safeGoal - safeRaised);
  const msLeft = Math.max(0, e - n);
  const daysLeft = phase === "ended" ? 0 : Math.ceil(msLeft / DAY_MS);
  const reached = safeGoal > 0 && safeRaised >= safeGoal;
  const perDayNeeded = reached || phase === "ended" ? 0 : remaining / Math.max(1, daysLeft);

  let status: PaceStatus;
  if (reached) status = "reached";
  else if (phase === "upcoming") status = "upcoming";
  else if (phase === "ended") status = "ended-short";
  else if (msLeft <= DAY_MS) status = "final-hours";
  else if (Math.abs(delta) <= safeGoal * ON_PACE_TOLERANCE) status = "on-pace";
  else status = delta > 0 ? "ahead" : "behind";

  const totalDays = Math.max(1, Math.ceil(span / DAY_MS));
  const unit = totalDays > MAX_DAY_SEGMENTS ? "week" : "day";
  const unitMs = unit === "week" ? 7 * DAY_MS : DAY_MS;
  const count = Math.max(1, Math.ceil(span / unitMs));
  const segments: PaceSegment[] = Array.from({ length: count }, (_, index) => {
    const segStart = s + index * unitMs;
    const segEnd = Math.min(e, segStart + unitMs);
    const time = n >= segEnd ? "past" : n < segStart ? "future" : "current";
    // A segment's share of the goal matches its share of the time, so a short final
    // segment carries a smaller share.
    const from = (segStart - s) / span;
    const to = (segEnd - s) / span;
    return {
      index,
      start: new Date(segStart),
      end: new Date(segEnd),
      time,
      fill: clamp01((raisedShare - from) / (to - from)),
    };
  });

  const countdownMs = phase === "upcoming" ? s - n : msLeft;

  return {
    phase,
    status,
    timeShare,
    raisedShare,
    expected,
    delta,
    remaining,
    daysLeft,
    perDayNeeded,
    countdown: toCountdownParts(countdownMs),
    countdownMs,
    unit,
    segments,
  };
}
