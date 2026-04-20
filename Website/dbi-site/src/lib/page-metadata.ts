import type { Metadata } from "next";
import { sanityClient } from "@/sanity/client";
import { pageMetadataByPathQuery } from "@/sanity/queries";
import { absoluteUrl, DEFAULT_SOCIAL_IMAGE_PATH } from "@/lib/site-url";

export const SITE_BRAND = "Delta Bay Impact";

/** Default meta description (matches root layout). */
export const DEFAULT_SITE_DESCRIPTION =
  "We partner with schools and families to provide mentorship, academic support, and advocacy that creates pathways to belonging, confidence, and success for African American youth in Contra Costa County.";

/** Default `<title>` when home has no usable CMS title. */
export const DEFAULT_HOME_TITLE_ABSOLUTE =
  "Delta Bay Impact | Every African American Student Deserves to Thrive";

const ADMIN_TITLE_PLACEHOLDER = "Content Page";

export type PageMetadataDoc = {
  title: string | null;
  lead: string | null;
  description: string | null;
  _updatedAt?: string;
} | null;

export function normalizePathSegments(segments?: string[]): string {
  if (!segments || segments.length === 0) return "/";
  return `/${segments.join("/")}`;
}

function isUsablePageTitle(title: string | null | undefined): title is string {
  const t = title?.trim();
  return !!t && t !== ADMIN_TITLE_PLACEHOLDER;
}

/** Human-readable title from path when CMS title is missing (e.g. `/get-involved` → "Get Involved"). */
export function fallbackTitleFromPath(path: string): string {
  if (path === "/" || path === "") return SITE_BRAND;
  const segment = path.replace(/^\//, "").split("/").filter(Boolean)[0];
  if (!segment) return SITE_BRAND;
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function metaDescriptionFromDoc(doc: PageMetadataDoc): string {
  const fromDesc = doc?.description?.trim();
  if (fromDesc) return fromDesc;
  const fromLead = doc?.lead?.trim();
  if (fromLead) return fromLead;
  return DEFAULT_SITE_DESCRIPTION;
}

/**
 * Builds Next.js metadata for a route path (matches Sanity `page.path`).
 * Home (`/`) uses `title.absolute` so it does not pick up the global `title.template`.
 */
export async function buildMetadataForPath(path: string): Promise<Metadata> {
  const normalized = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;

  const doc = await sanityClient
    .fetch<PageMetadataDoc>(pageMetadataByPathQuery, { path: normalized })
    .catch(() => null);

  const description = metaDescriptionFromDoc(doc);
  const canonical = absoluteUrl(normalized);

  const openGraph: Metadata["openGraph"] = {
    type: "website",
    locale: "en_US",
    url: canonical,
    siteName: SITE_BRAND,
    title: undefined,
    description,
    images: [{ url: DEFAULT_SOCIAL_IMAGE_PATH, alt: SITE_BRAND }],
  };

  const twitter: Metadata["twitter"] = {
    card: "summary_large_image",
    title: undefined,
    description,
    images: [DEFAULT_SOCIAL_IMAGE_PATH],
  };

  if (normalized === "/") {
    const homeTitle = isUsablePageTitle(doc?.title)
      ? `${doc!.title!.trim()} | ${SITE_BRAND}`
      : DEFAULT_HOME_TITLE_ABSOLUTE;

    const titleMeta: Metadata["title"] = { absolute: homeTitle };
    openGraph.title = homeTitle;
    twitter.title = homeTitle;

    return {
      title: titleMeta,
      description,
      alternates: { canonical },
      openGraph,
      twitter,
    };
  }

  const segmentTitle = isUsablePageTitle(doc?.title) ? doc!.title!.trim() : fallbackTitleFromPath(normalized);

  openGraph.title = segmentTitle;
  twitter.title = `${segmentTitle} | ${SITE_BRAND}`;

  return {
    title: segmentTitle,
    description,
    alternates: { canonical },
    openGraph,
    twitter,
  };
}

export function createMetadataForPath(path: string) {
  return function generateMetadata(): Promise<Metadata> {
    return buildMetadataForPath(path);
  };
}
