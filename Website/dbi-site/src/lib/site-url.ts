/**
 * Public site origin for metadata, sitemap, and JSON-LD.
 *
 * - Set `NEXT_PUBLIC_SITE_URL` on your live domain in Vercel (e.g. https://deltabayimpact.org).
 * - On Vercel previews, `VERCEL_URL` is used when the public URL is not set.
 * - Chrome’s Share uses the address bar URL; sharing the production site requires opening that domain.
 */
const DEFAULT_PRODUCTION_SITE_URL = "https://deltabayimpact.org";

/** Default Open Graph / Twitter image (`public/` path). */
export const DEFAULT_SOCIAL_IMAGE_PATH = "/dbi_logo.png" as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  const vercelEnv = process.env.VERCEL_ENV;
  // Preview deployments: use the deployment hostname so shared links match the preview URL.
  if (vercel && vercelEnv === "preview") {
    const host = vercel.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  // Production (including Vercel production without NEXT_PUBLIC_SITE_URL): avoid *.vercel.app in OG/canonical.
  return DEFAULT_PRODUCTION_SITE_URL;
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
