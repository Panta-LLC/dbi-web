import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./src/sanity/schema";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-22";

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
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
});
