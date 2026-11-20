import { cache } from "react";
import { sanityClient } from "@/sanity/client";
import { activeCampaignQuery } from "@/sanity/queries";

export type CampaignMilestoneConfig = { label: string; date: string };

/** The live fundraising campaign, as edited in Sanity (Fundraising Campaign). */
export type Campaign = {
  title: string;
  eoyCampaignUrl: string;
  monthlyUrl: string;
  /** First and last campaign days, YYYY-MM-DD (Pacific). endDate null = use Network for Good's. */
  startDate: string;
  endDate: string | null;
  eyebrow: string;
  showOnHomepage: boolean;
  homepageCtaLabel: string;
  donateCtaLabel: string;
  milestones: CampaignMilestoneConfig[];
};

type SanityCampaign = {
  title?: string;
  active?: boolean;
  campaignUrl?: string;
  monthlyUrl?: string;
  startDate?: string;
  endDate?: string;
  tracker?: {
    eyebrow?: string;
    showOnHomepage?: boolean;
    homepageCtaLabel?: string;
    donateCtaLabel?: string;
    milestones?: { label?: string; date?: string }[];
  };
};

/**
 * Used only when Sanity has no Fundraising Campaign documents or can't be reached, so the
 * site behaves as it did before the campaign moved into Sanity.
 */
const FALLBACK_CAMPAIGN: Campaign = {
  title: "Year-End Campaign",
  eoyCampaignUrl: "https://deltabayimpact.networkforgood.com/projects/309021-year-end-2026",
  monthlyUrl: "https://deltabayimpact.networkforgood.com/projects/309025-monthly-giving",
  startDate: "2026-11-17",
  endDate: null,
  eyebrow: "Bigger impact in 2027",
  showOnHomepage: true,
  homepageCtaLabel: "Give now",
  donateCtaLabel: "Choose how to give",
  milestones: [{ label: "Giving Tuesday", date: "2026-12-01" }],
};

const text = (value: string | undefined, fallback: string) => value?.trim() || fallback;

function fromSanity(doc: SanityCampaign): Campaign | null {
  if (!doc.campaignUrl || !doc.monthlyUrl || !doc.startDate) return null;
  const tracker = doc.tracker ?? {};
  return {
    title: text(doc.title, FALLBACK_CAMPAIGN.title),
    eoyCampaignUrl: doc.campaignUrl,
    monthlyUrl: doc.monthlyUrl,
    startDate: doc.startDate,
    endDate: doc.endDate ?? null,
    eyebrow: tracker.eyebrow?.trim() ?? "",
    showOnHomepage: tracker.showOnHomepage ?? true,
    homepageCtaLabel: text(tracker.homepageCtaLabel, FALLBACK_CAMPAIGN.homepageCtaLabel),
    donateCtaLabel: text(tracker.donateCtaLabel, FALLBACK_CAMPAIGN.donateCtaLabel),
    milestones: (tracker.milestones ?? []).filter(
      (m): m is CampaignMilestoneConfig => Boolean(m.label && m.date),
    ),
  };
}

/** Env vars override the Network for Good links (e.g. to test against other pages). */
function withEnvOverrides(campaign: Campaign): Campaign {
  return {
    ...campaign,
    eoyCampaignUrl: process.env.NEXT_PUBLIC_NFG_EOY_CAMPAIGN_URL?.trim() || campaign.eoyCampaignUrl,
    monthlyUrl: process.env.NEXT_PUBLIC_NFG_MONTHLY_URL?.trim() || campaign.monthlyUrl,
  };
}

/**
 * The live campaign, or null when no campaign is live. Once any Fundraising Campaign
 * document exists in Sanity, Sanity decides; the built-in campaign is only a fallback.
 */
export const getCampaign = cache(async (): Promise<Campaign | null> => {
  const docs = await sanityClient
    .fetch<SanityCampaign[]>(activeCampaignQuery)
    .catch(() => null);
  if (!docs?.length) return withEnvOverrides(FALLBACK_CAMPAIGN);

  const live = docs.find((doc) => doc.active);
  const campaign = live ? fromSanity(live) : null;
  return campaign ? withEnvOverrides(campaign) : null;
});
