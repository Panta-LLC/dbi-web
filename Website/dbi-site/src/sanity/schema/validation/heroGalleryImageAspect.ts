import type { ImageOptions } from "sanity";
import type { SanityClient } from "@sanity/client";

/** Hero gallery slide ratio (882×548). */
export const HERO_GALLERY_ASPECT = 882 / 548;

/** Left “balloon” strip ratio (159×548). */
export const LEFT_STRIP_ASPECT = 159 / 548;

const TOLERANCE = 0.015;

type ImageFieldValue = {
  asset?: { _ref?: string };
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
} | null | undefined;

type ValidationContextLike = { getClient: (opts: { apiVersion: string }) => SanityClient };

function hotspotOptionsForRatio(aspectRatio: number, previewTitle: string): ImageOptions {
  return {
    hotspot: {
      previews: [{ title: previewTitle, aspectRatio }],
    },
  };
}

/**
 * Hotspot UI: single crop preview for the hero gallery frame (882×548).
 */
export const heroGalleryImageHotspotOptions = hotspotOptionsForRatio(
  HERO_GALLERY_ASPECT,
  "882×548 (hero gallery)",
);

/**
 * Hotspot UI: single crop preview for the left strip (159×548).
 */
export const leftStripImageHotspotOptions = hotspotOptionsForRatio(
  LEFT_STRIP_ASPECT,
  "159×548 (left strip)",
);

async function validateCropAspectRatio(
  value: unknown,
  context: ValidationContextLike,
  targetRatio: number,
  label: string,
): Promise<string | true> {
  const v = value as ImageFieldValue;
  if (!v?.asset?._ref) return true;

  const client = context.getClient({ apiVersion: "2025-01-22" });
  const asset = await client.fetch<{
    metadata?: { dimensions?: { width?: number; height?: number } };
  } | null>(`*[_id == $id][0]{metadata}`, { id: v.asset._ref });

  const w = asset?.metadata?.dimensions?.width;
  const h = asset?.metadata?.dimensions?.height;
  if (!w || !h) return true;

  const c = v.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const l = c.left ?? 0;
  const r = c.right ?? 0;
  const t = c.top ?? 0;
  const b = c.bottom ?? 0;

  const cropW = (1 - l - r) * w;
  const cropH = (1 - t - b) * h;
  if (cropW <= 0 || cropH <= 0) {
    return "Invalid crop. Reset the image or adjust crop handles.";
  }

  const ar = cropW / cropH;
  const relErr = Math.abs(ar - targetRatio) / targetRatio;
  if (relErr <= TOLERANCE) return true;

  return `This image must match a ${label} aspect ratio (≈ ${targetRatio.toFixed(4)}:1). After crop, it is ${ar.toFixed(4)}:1. Open the image and adjust the crop until the preview matches.`;
}

/** Enforces 882:548 on hero gallery slides. */
export async function validateHeroGalleryCropAspect(
  value: unknown,
  context: ValidationContextLike,
): Promise<string | true> {
  return validateCropAspectRatio(value, context, HERO_GALLERY_ASPECT, "882×548");
}

/** Enforces 159:548 on the left strip image. */
export async function validateLeftStripCropAspect(
  value: unknown,
  context: ValidationContextLike,
): Promise<string | true> {
  return validateCropAspectRatio(value, context, LEFT_STRIP_ASPECT, "159×548");
}
