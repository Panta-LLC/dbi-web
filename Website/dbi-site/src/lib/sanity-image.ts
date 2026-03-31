import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

const builder =
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }) : null;

/**
 * Builds a Sanity CDN URL that respects hotspot and crop from Studio.
 * Raw `image.asset->url` in GROQ does not — use this with a projected `image { crop, hotspot, asset }`.
 */
export function urlForSanityImage(
  source: SanityImageSource | null | undefined,
  options?: { width?: number; height?: number; quality?: number },
): string | undefined {
  if (!builder || !source) return undefined;
  try {
    const chain = builder.image(source);
    const w = options?.width ?? 2400;
    let b = chain.width(w).auto("format");
    if (options?.height != null) b = b.height(options.height);
    if (options?.quality != null) b = b.quality(options.quality);
    return b.url();
  } catch {
    return undefined;
  }
}
