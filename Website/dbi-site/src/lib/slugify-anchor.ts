/**
 * URL fragment–safe slug for collection article deep links.
 * Empty or invalid input yields a fallback based on index (caller passes index).
 */
export function slugifyAnchorSegment(text: string | undefined, index: number): string {
  const raw = (text ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  if (raw.length > 0) return raw;
  return `item-${index + 1}`;
}

/**
 * Unique slugs per item in one section (duplicate headings → `-2`, `-3`, …).
 */
export function uniqueAnchorSlugsForItems(headings: string[]): string[] {
  const counts = new Map<string, number>();
  return headings.map((heading, index) => {
    const base = slugifyAnchorSegment(heading, index);
    const n = (counts.get(base) ?? 0) + 1;
    counts.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  });
}

export type ParsedHashForCollection = {
  /** `prefix:rest` from `#prefix:rest` */
  scopedPrefix: string | null;
  /** Item slug (rest in scoped form, or full fragment in unscoped form) */
  itemSlug: string;
};

/**
 * Parse location hash for collection article matching.
 * Scoped: `#sectionKey:item-slug` → prefix + rest split on first `:`.
 * Unscoped: `#item-slug` → no prefix, full string is item slug.
 */
export function parseCollectionArticleHash(hash: string): ParsedHashForCollection | null {
  const trimmed = hash.replace(/^#/, "").trim();
  if (!trimmed) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    decoded = trimmed;
  }
  const colon = decoded.indexOf(":");
  if (colon !== -1) {
    const prefix = decoded.slice(0, colon);
    const rest = decoded.slice(colon + 1).trim();
    if (!prefix || !rest) return null;
    return { scopedPrefix: prefix, itemSlug: rest };
  }
  return { scopedPrefix: null, itemSlug: decoded };
}

/** Unscoped `#item-slug` matches the first section in render order that has that slug; clear on hash change. */
const unscopedFragmentClaims = new Map<string, string>();

export function resetUnscopedHashClaims(): void {
  unscopedFragmentClaims.clear();
}

/**
 * Returns true if this section may apply an unscoped match for `fragment`
 * (first claimant wins; same `claimId` always wins).
 */
export function claimUnscopedFragment(fragment: string, claimId: string): boolean {
  const existing = unscopedFragmentClaims.get(fragment);
  if (existing === undefined) {
    unscopedFragmentClaims.set(fragment, claimId);
    return true;
  }
  return existing === claimId;
}

export function collectionArticleScrollTargetId(sectionKey: string, itemSlug: string): string {
  const safe = sectionKey.replace(/[^a-zA-Z0-9_-]/g, "");
  return `collection-item-${safe || "section"}-${itemSlug}`;
}
