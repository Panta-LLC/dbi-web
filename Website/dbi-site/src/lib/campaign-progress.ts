import { resolveCampaignUrls } from "@/lib/donate-url";

export type CampaignProgress = {
  title: string;
  goal: number;
  raised: number;
  /** ISO date-times; the campaign runs from start up to (not including) end. */
  start: string;
  end: string;
};

/**
 * Network for Good doesn't publish a start date on the campaign page, so it lives here.
 * The year-end campaign starts Tuesday, November 17, 2026 (Pacific).
 */
const YEAR_END_CAMPAIGN = {
  title: "Year-End Campaign",
  start: "2026-11-17T00:00:00-08:00",
  /** Used only if the campaign page stops showing its end date. */
  fallbackEnd: "2027-01-01T00:00:00-08:00",
};

/** Re-read the Network for Good total at most every 10 minutes. */
const REVALIDATE_SECONDS = 600;

const dollars = (text: string | undefined) => {
  if (!text) return null;
  const n = Number(text.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
};

/**
 * Reads the raised total, goal and end date from the Network for Good campaign page
 * (its `data-describe` hooks). Exported for tests.
 */
export function parseNfgCampaignPage(html: string) {
  const raised = dollars(
    html.match(/data-describe=['"]total-donations-amount['"][^>]*>\s*([^<]+)</)?.[1],
  );
  const goal = dollars(
    html.match(/data-describe=['"]campaign-fundraising-goal['"][^>]*>[^<]*?(\$[\d,.]+)/)?.[1],
  );
  const endDate = html.match(/data-end-date=['"](\d{4}-\d{2}-\d{2})['"]/)?.[1] ?? null;
  return { raised, goal, endDate };
}

/** The day after the last campaign day, at midnight Pacific. */
function endOfDayPacific(isoDate: string): string {
  const next = new Date(`${isoDate}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return `${next.toISOString().slice(0, 10)}T00:00:00-08:00`;
}

/**
 * Live year-end campaign progress for the tracker, or null when no campaign is running
 * or Network for Good can't be read (better to hide the tracker than show a wrong total).
 */
export async function getYearEndCampaignProgress(): Promise<CampaignProgress | null> {
  const urls = resolveCampaignUrls();
  if (!urls) return null;

  try {
    const res = await fetch(urls.eoyCampaignUrl, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const { raised, goal, endDate } = parseNfgCampaignPage(await res.text());
    if (raised == null || !goal) return null;
    return {
      title: YEAR_END_CAMPAIGN.title,
      goal,
      raised,
      start: YEAR_END_CAMPAIGN.start,
      end: endDate ? endOfDayPacific(endDate) : YEAR_END_CAMPAIGN.fallbackEnd,
    };
  } catch {
    return null;
  }
}
