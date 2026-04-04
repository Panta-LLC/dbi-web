/**
 * Canonical public donate URL: Sanity Site → NEXT_PUBLIC_DONATE_URL → /donate.
 *
 * Resolve on the server (SiteLayout, Footer) so the nav Donate button does not rely on
 * client-inlined NEXT_PUBLIC_* at build time only — production env vars apply at request time.
 */
export function resolveDonateHref(cmsDonateUrl: string | null | undefined): string {
  const fromCms = cmsDonateUrl?.trim();
  if (fromCms) return fromCms;
  const fromEnv = process.env.NEXT_PUBLIC_DONATE_URL?.trim();
  if (fromEnv) return fromEnv;
  return "/donate";
}
