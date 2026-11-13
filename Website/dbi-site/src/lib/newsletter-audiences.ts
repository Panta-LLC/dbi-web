/**
 * Newsletter audiences: visitors self-identify, then subscribe through the
 * Network for Good signup form for that audience's email list.
 * Editors manage these in Sanity (Site → Footer → Newsletter Signup → Audiences).
 */

export type NewsletterAudience = {
  key: string;
  label: string;
  description?: string;
  /** Hosted Network for Good signup form URL (https only). */
  formUrl?: string;
};

const NFG_FORMS_BASE = "https://deltabayimpact.dm.networkforgood.com/forms";

/**
 * Used when Sanity has no audiences. Each form lives in Network for Good Donor Management
 * (Communication → Forms) and adds submitters to its "Newsletter – …" contact group.
 */
export const DEFAULT_NEWSLETTER_AUDIENCES: NewsletterAudience[] = [
  {
    key: "parent",
    label: "Parent or Guardian",
    description: "Updates on programs and events for your student.",
    formUrl: `${NFG_FORMS_BASE}/319212?iframe=1`,
  },
  {
    key: "community",
    label: "Community Member",
    description: "News and ways to get involved in the community.",
    formUrl: `${NFG_FORMS_BASE}/319213?iframe=1`,
  },
  {
    key: "donor",
    label: "Donor",
    description: "Impact stories and giving updates.",
    formUrl: `${NFG_FORMS_BASE}/319214?iframe=1`,
  },
  {
    key: "partner",
    label: "Partner or Volunteer",
    description: "Opportunities for schools, organizations, and volunteers.",
    formUrl: `${NFG_FORMS_BASE}/319215?iframe=1`,
  },
];

/** Accept only absolute https URLs so editors can't embed arbitrary schemes. */
export function safeFormUrl(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

type RawAudience = { _key?: string; label?: string; description?: string; formUrl?: string };

/** Normalizes CMS audiences; returns only entries with a label. Falls back to the defaults when the CMS has none. */
export function normalizeNewsletterAudiences(raw: unknown): NewsletterAudience[] {
  if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_NEWSLETTER_AUDIENCES;
  return (raw as RawAudience[])
    .filter((a) => a && typeof a.label === "string" && a.label.trim())
    .map((a, i) => ({
      key: a._key ?? `audience-${i}`,
      label: a.label!.trim(),
      description: a.description?.trim() || undefined,
      formUrl: safeFormUrl(a.formUrl),
    }));
}

/** The picker is used only once every audience has a working form URL. */
export function audiencesReady(audiences: NewsletterAudience[]): boolean {
  return audiences.length > 0 && audiences.every((a) => Boolean(a.formUrl));
}
