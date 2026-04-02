import type { MetadataRoute } from "next";
import { sanityClient } from "@/sanity/client";
import { publishedPagePathsQuery } from "@/sanity/queries";
import { absoluteUrl } from "@/lib/site-url";

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
  const lastModified = new Date();

  let cmsPaths: string[] = [];
  try {
    cmsPaths = await sanityClient.fetch<string[]>(publishedPagePathsQuery);
  } catch {
    cmsPaths = [];
  }

  const pathSet = new Set<string>();
  for (const p of MINIMUM_SITEMAP_PATHS) {
    pathSet.add(normalizePath(p));
  }
  for (const p of cmsPaths) {
    if (typeof p === "string" && p.length > 0) {
      pathSet.add(normalizePath(p));
    }
  }

  const sorted = [...pathSet].sort((a, b) => a.localeCompare(b));

  return sorted.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: changeFrequencyForPath(path),
    priority: priorityForPath(path),
  }));
}
