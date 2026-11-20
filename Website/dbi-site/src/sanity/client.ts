import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-22";

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity environment variables. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // Read the live API, not the CDN. Pages are cached by Next and rebuilt by the Sanity
  // webhook (/api/revalidate) seconds after a publish, often before the CDN has caught
  // up, which left pages showing the old content. Only server code uses this client.
  useCdn: false,
});
