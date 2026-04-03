# Homepage and CMS (Sanity)

## Current architecture

The live site is driven by the **`page`** document type ([`src/sanity/schema/documents/page.ts`](src/sanity/schema/documents/page.ts)): each document has a **`path`** (for example `/`, `/about`, `/services`) and a **`content[]`** array of section blocks (hero, program cards, collection articles, and so on).

Rendering flows from GROQ in [`src/sanity/queries.ts`](src/sanity/queries.ts) through [`src/components/sanity/PageContentRenderer.tsx`](src/components/sanity/PageContentRenderer.tsx) into section components under [`src/components/`](src/components/).

### Editing the homepage

1. Open Sanity Studio → **Page**.
2. Open (or create) the page whose **Path** is `/`.
3. Edit **Content** blocks as needed.

Site chrome (nav, footer, newsletter) comes from the **`site`** document ([`src/sanity/schema/documents/site.ts`](src/sanity/schema/documents/site.ts)).

### Legacy document types in datasets

[`scripts/seed-sanity.js`](scripts/seed-sanity.js) may still insert documents with legacy `_type` values such as `homePage`, `programsPage`, or `contactPage`. Those types are **not** part of the Studio schema registered in [`src/sanity/schema/index.ts`](src/sanity/schema/index.ts). Prefer migrating editorial content into **`page`** documents.

To see how many documents of each legacy type exist in your dataset (read-only):

```bash
pnpm sanity:type-counts
```

Requires `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` (for example in `.env.local`).

---

## Historical note

Earlier iterations of this repo documented a dedicated `homePage` schema and components such as `LogoGrid` / `ContactBand`. That model has been superseded by the **`page`** + block pipeline above. For older detail, use git history.
