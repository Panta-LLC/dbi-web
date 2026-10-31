export type CampaignUrls = {
  eoyCampaignUrl: string;
  monthlyUrl: string;
};

/** Network for Good campaign pages shown on /donate. Null until both are configured. */
export function resolveCampaignUrls(): CampaignUrls | null {
  const eoyCampaignUrl = process.env.NEXT_PUBLIC_NFG_EOY_CAMPAIGN_URL?.trim();
  const monthlyUrl = process.env.NEXT_PUBLIC_NFG_MONTHLY_URL?.trim();
  return eoyCampaignUrl && monthlyUrl ? { eoyCampaignUrl, monthlyUrl } : null;
}

/**
 * Canonical public donate URL: /donate when campaign pages are configured, otherwise
 * Sanity Site → NEXT_PUBLIC_DONATE_URL → /donate.
 *
 * Resolve on the server (SiteLayout, Footer) so the nav Donate button does not rely on
 * client-inlined NEXT_PUBLIC_* at build time only — production env vars apply at request time.
 */
export function resolveDonateHref(cmsDonateUrl: string | null | undefined): string {
  if (resolveCampaignUrls()) return "/donate";
  const fromCms = cmsDonateUrl?.trim();
  if (fromCms) return fromCms;
  const fromEnv = process.env.NEXT_PUBLIC_DONATE_URL?.trim();
  if (fromEnv) return fromEnv;
  return "/donate";
}
