import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schema";

// SANITY_STUDIO_* for Studio deploy (sanity.studio); NEXT_PUBLIC_* for Next.js embedded use
const projectId =
  process.env.SANITY_STUDIO_API_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_API_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION ?? process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-22";

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity environment variables. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
  );
}

export default defineConfig({
  name: "default",
  title: "Delta Bay Impact",
  projectId,
  dataset,
  apiVersion,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
