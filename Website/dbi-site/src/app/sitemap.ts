import type { MetadataRoute } from "next";
import { sanityClient } from "@/sanity/client";
import { publishedPagesForSitemapQuery } from "@/sanity/queries";
import { absoluteUrl } from "@/lib/site-url";

type SanitySitemapRow = { path: string; _updatedAt: string };

/** First-party routes that should appear even if not yet modeled as CMS `page` docs. */
const MINIMUM_SITEMAP_PATHS = [
  "/",
  "/about",
  "/services",
  "/programs",
  "/impact",
  "/get-involved",
  "/resources",
  "/contact",
  "/donate",
] as const;

function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function priorityForPath(path: string): number {
  if (path === "/") return 1;
  if (path === "/donate" || path === "/services" || path === "/programs") return 0.9;
  if (path === "/impact" || path === "/get-involved") return 0.8;
  return 0.7;
}

function changeFrequencyForPath(path: string): MetadataRoute.Sitemap[0]["changeFrequency"] {
  if (path === "/" || path === "/resources") return "weekly";
  if (path === "/contact" || path === "/donate") return "yearly";
  return "monthly";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buildTime = new Date();

  let cmsRows: SanitySitemapRow[] = [];
  try {
    cmsRows = await sanityClient.fetch<SanitySitemapRow[]>(publishedPagesForSitemapQuery);
  } catch {
    cmsRows = [];
  }

  const lastModByPath = new Map<string, Date>();
  for (const row of cmsRows) {
    if (typeof row?.path !== "string" || !row.path.trim()) continue;
    const p = normalizePath(row.path);
    const d = new Date(row._updatedAt);
    if (!Number.isNaN(d.getTime())) {
      lastModByPath.set(p, d);
    }
  }

  const pathSet = new Set<string>();
  for (const p of MINIMUM_SITEMAP_PATHS) {
    pathSet.add(normalizePath(p));
  }
  for (const p of lastModByPath.keys()) {
    pathSet.add(p);
  }

  const sorted = [...pathSet].sort((a, b) => a.localeCompare(b));

  return sorted.map((path) => ({
    url: absoluteUrl(path),
    lastModified: lastModByPath.get(path) ?? buildTime,
    changeFrequency: changeFrequencyForPath(path),
    priority: priorityForPath(path),
  }));
}
