/**
 * Print document counts per `_type` for the configured Sanity dataset (read-only).
 * Use before removing legacy types from a dataset: `pnpm sanity:type-counts`
 *
 * Requires: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET (no write token).
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const { createClient } = require("@sanity/client");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-22";

if (!projectId || !dataset) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, useCdn: true });

const LEGACY_DOC_TYPES = [
  "homePage",
  "aboutPage",
  "programsPage",
  "contactPage",
  "resourcesPage",
  "getInvolvedPage",
  "donatePage",
  "impactPage",
];

async function main() {
  const query = `{
    "page": count(*[_type == "page"]),
    "site": count(*[_type == "site"]),
    "homePage": count(*[_type == "homePage"]),
    "aboutPage": count(*[_type == "aboutPage"]),
    "programsPage": count(*[_type == "programsPage"]),
    "contactPage": count(*[_type == "contactPage"]),
    "resourcesPage": count(*[_type == "resourcesPage"]),
    "getInvolvedPage": count(*[_type == "getInvolvedPage"]),
    "donatePage": count(*[_type == "donatePage"]),
    "impactPage": count(*[_type == "impactPage"])
  }`;

  const counts = await client.fetch(query);
  console.log("Sanity document counts by _type:\n");
  console.log(JSON.stringify(counts, null, 2));
  const legacyTotal = LEGACY_DOC_TYPES.reduce((sum, t) => sum + (counts[t] ?? 0), 0);
  if (legacyTotal > 0) {
    console.log(
      `\nNote: ${legacyTotal} document(s) use legacy page types (not in Studio schema). Migrate to \`page\` when ready.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
