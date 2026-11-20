import { getCampaign, type Campaign } from "@/lib/campaign";

export type CampaignProgress = {
  title: string;
  campaign: Campaign;
  goal: number;
  raised: number;
  /** ISO date-times; the campaign runs from start up to (not including) end. */
  start: string;
  end: string;
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

/** Midnight Pacific at the start of a YYYY-MM-DD day. */
const startOfDayPacific = (isoDate: string) => `${isoDate}T00:00:00-08:00`;

/** The day after the last campaign day, at midnight Pacific. */
function endOfDayPacific(isoDate: string): string {
  const next = new Date(`${isoDate}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return `${next.toISOString().slice(0, 10)}T00:00:00-08:00`;
}

/**
 * Live campaign progress for the tracker, or null when no campaign is live or Network for
 * Good can't be read (better to hide the tracker than show a wrong total).
 */
export async function getYearEndCampaignProgress(): Promise<CampaignProgress | null> {
  const campaign = await getCampaign();
  if (!campaign) return null;

  try {
    const res = await fetch(campaign.eoyCampaignUrl, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const { raised, goal, endDate } = parseNfgCampaignPage(await res.text());
    const lastDay = campaign.endDate ?? endDate;
    if (raised == null || !goal || !lastDay) return null;
    return {
      title: campaign.title,
      campaign,
      goal,
      raised,
      start: startOfDayPacific(campaign.startDate),
      end: endOfDayPacific(lastDay),
    };
  } catch {
    return null;
  }
}
