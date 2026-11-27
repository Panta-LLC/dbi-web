import { cache } from "react";
import { sanityClient } from "@/sanity/client";
import { activeCampaignQuery } from "@/sanity/queries";

/** The live fundraising campaign, as edited in Sanity (Fundraising Campaign). */
export type Campaign = {
  title: string;
  eoyCampaignUrl: string;
  monthlyUrl: string;
};

type SanityCampaign = {
  title?: string;
  active?: boolean;
  campaignUrl?: string;
  monthlyUrl?: string;
};

/**
 * Used only when Sanity has no Fundraising Campaign documents or can't be reached, so the
 * site behaves as it did before the campaign moved into Sanity.
 */
const FALLBACK_CAMPAIGN: Campaign = {
  title: "Year-End Campaign",
  eoyCampaignUrl: "https://deltabayimpact.networkforgood.com/projects/309021-year-end-2026",
  monthlyUrl: "https://deltabayimpact.networkforgood.com/projects/309025-monthly-giving",
};

function fromSanity(doc: SanityCampaign): Campaign | null {
  if (!doc.campaignUrl || !doc.monthlyUrl) return null;
  return {
    title: doc.title?.trim() || FALLBACK_CAMPAIGN.title,
    eoyCampaignUrl: doc.campaignUrl,
    monthlyUrl: doc.monthlyUrl,
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
