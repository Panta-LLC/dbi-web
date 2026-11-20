import { getCampaign } from "@/lib/campaign";

export type CampaignUrls = {
  eoyCampaignUrl: string;
  monthlyUrl: string;
};

/**
 * Network for Good campaign pages shown on /donate, or null when no campaign is live.
 * Edited in Sanity under Fundraising Campaign.
 */
export async function resolveCampaignUrls(): Promise<CampaignUrls | null> {
  const campaign = await getCampaign();
  return campaign ? { eoyCampaignUrl: campaign.eoyCampaignUrl, monthlyUrl: campaign.monthlyUrl } : null;
}

/**
 * Canonical public donate URL: /donate while a campaign is live, otherwise
 * Sanity Site → NEXT_PUBLIC_DONATE_URL → /donate.
 *
 * Resolve on the server (SiteLayout, Footer) so the nav Donate button does not rely on
 * client-inlined NEXT_PUBLIC_* at build time only — production env vars apply at request time.
 */
export async function resolveDonateHref(cmsDonateUrl: string | null | undefined): Promise<string> {
  if (await resolveCampaignUrls()) return "/donate";
  const fromCms = cmsDonateUrl?.trim();
  if (fromCms) return fromCms;
  const fromEnv = process.env.NEXT_PUBLIC_DONATE_URL?.trim();
  if (fromEnv) return fromEnv;
  return "/donate";
}
