/**
 * Seed only Contact Form + Contact CTA documents (and optionally page-contact).
 * Does not touch site settings or other pages. See CONTACT_FORMS_INQUIRY_TYPES.md.
 *
 * Usage:
 *   pnpm seed:sanity:contact
 *   pnpm seed:sanity:contact -- --with-contact-page
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const { createClient } = require("@sanity/client");
const {
  contactFormDefinitionsSeed,
  contactFormCtasSeed,
  pageContactDocument,
} = require("./contact-forms-seed-data.cjs");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-22";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing env vars. Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const withContactPage = process.argv.includes("--with-contact-page");

async function run() {
  await Promise.all(contactFormDefinitionsSeed.map((doc) => client.createOrReplace(doc)));
  await Promise.all(contactFormCtasSeed.map((doc) => client.createOrReplace(doc)));
  let pageNote = "";
  if (withContactPage) {
    await client.createOrReplace(pageContactDocument);
    pageNote = ", 1 contact page (page-contact)";
  }
  console.log(
    `Seeded ${contactFormDefinitionsSeed.length} contact forms, ${contactFormCtasSeed.length} contact CTAs${pageNote}.`,
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
