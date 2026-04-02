/**
 * Public site origin for metadata, sitemap, and JSON-LD.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://www.example.org).
 */
const DEFAULT_SITE_URL = "https://dbi-site.vercel.app";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return DEFAULT_SITE_URL;
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
