# Homepage CMS Updates

## Overview
All homepage improvements are now fully wired to Sanity CMS. Content editors can manage impact metrics, trust badges, and story links directly through the Sanity Studio without code changes.

---

## What Changed

### 1. Impact Snapshot Section (New)
A new section appears after the intro statement that highlights key metrics and provides quick navigation.

**CMS Fields (in Sanity Studio):**
- **Eyebrow**: Small label above the title (default: "Impact snapshot")
- **Title**: Main heading (default: "Community-driven work you can verify.")
- **Description**: Supporting text explaining what visitors can explore
- **Metrics**: Array of metric cards, each with:
  - **Value**: The number or text to display prominently (e.g., "4+", "Get involved")
  - **Label**: Descriptive text below the value (e.g., "Community programs")
  - **Link**: Where the card should navigate when clicked

**Fallback Behavior:**
If CMS fields are empty, the section auto-generates metrics from existing content (program count, update count, etc.)

---

### 2. Trust & Transparency Section (New)
A set of links below the impact metrics that direct visitors to accountability resources.

**CMS Fields:**
- **Eyebrow**: Label (default: "Trust & transparency")
- **Links**: Array of link objects:
  - **Label**: Link text (e.g., "About & leadership")
  - **Href**: URL path (e.g., "/about")

**Default Links:**
- About & leadership → `/about`
- Impact reporting → `/impact`
- Ask a question → `/contact`

---

### 3. Story Links in "The Latest" Section (Enhanced)
Each featured story and update can now link to a full article or page.

**New Field:**
- **Link URL** (`href`): Optional path to the full story
  - If empty, defaults to `/impact`
  - Applied to "Read the story" and "Learn more" CTAs

**Also Added:**
- "View all updates" button that navigates to `/impact`
- Visible on all screen sizes (previously hidden on mobile)

---

### 4. Newsletter Overlap Fix
The newsletter signup band now uses responsive negative margins to avoid crowding on smaller screens:
- Mobile: `-mt-24` (96px)
- Tablet: `-mt-32` (128px)
- Desktop: `-mt-40` (160px)

---

### 5. Visual Consistency Fix
Fixed typo in `LogoGrid.tsx`: `slang-clip-tight` → `slant-clip-tight` to ensure partner logos match the site's slant aesthetic.

---

## Files Modified

### Schema & Queries
1. **`src/sanity/schema/documents/homePage.ts`**
   - Added `impactSnapshot` object with eyebrow, title, description, and metrics array
   - Added `trustSection` object with eyebrow and links array
   - Added `href` field to `latest.items[]` for story links

2. **`src/sanity/queries.ts`**
   - Updated `homePageQuery` to fetch new fields:
     - `impactSnapshot { eyebrow, title, description, metrics[] { value, label, href } }`
     - `trustSection { eyebrow, links[] { label, href } }`
     - `latest.items[].href`

### Frontend Components
3. **`src/app/page.tsx`**
   - Replaced hardcoded impact highlights with CMS-driven data
   - Replaced hardcoded trust links with CMS-driven data
   - Added fallback logic for when CMS fields are empty
   - Updated "Latest" section to use story links
   - Added "View all updates" CTA
   - Adjusted newsletter overlap margins for responsive behavior

### Seed Data
4. **`scripts/seed-sanity.js`**
   - Added default `impactSnapshot` data with 3 sample metrics
   - Added default `trustSection` data with 3 transparency links
   - Added `href: "/impact"` to sample story in `latest.items`

### Minor Fixes
5. **`src/components/LogoGrid.tsx`**
   - Fixed class name typo: `slang-clip-tight` → `slant-clip-tight`

---

## How to Update Content

### In Sanity Studio (`/studio`)

#### Update Impact Metrics
1. Navigate to **Home Page** document
2. Scroll to **Impact Snapshot** section
3. Edit:
   - Eyebrow text
   - Title
   - Description
   - Add/remove/edit metric cards:
     - Value (e.g., "50+", "500 students")
     - Label (e.g., "Students served")
     - Link (e.g., "/impact")

#### Update Trust Links
1. In the same Home Page document
2. Scroll to **Trust & Transparency** section
3. Edit the eyebrow label
4. Add/remove/edit links:
   - Label (visible text)
   - Href (URL path)

#### Add Story Links
1. Navigate to **Home Page** → **Latest** section
2. For each story item, fill in the **Link URL** field
   - Example: `/impact/school-supply-drive`
   - Leave empty to default to `/impact`

---

## Reseed the CMS (Optional)

If you need to restore default content:

```bash
npm run seed
```

This will:
- Populate the new fields with sample data
- Preserve existing hero images
- Reset all other content to defaults

---

## Testing Checklist

- [ ] Impact snapshot displays with 3 metrics
- [ ] Metrics link to correct pages when clicked
- [ ] Trust links appear below metrics
- [ ] "View all updates" button is visible and functional
- [ ] Featured story has "Read the story" link
- [ ] Update cards have "Learn more" links
- [ ] Newsletter band doesn't crowd content on mobile
- [ ] Partner logos display with consistent slant clip

---

## Notes for Editors

### When to Use Custom Metrics vs. Auto-Generated
- **Auto-generated** (default): If you leave `impactSnapshot.metrics` empty, the site will show counts based on existing content (programs, updates, etc.)
- **Custom**: Add your own metrics to showcase specific achievements like "500 students served" or "10 years of impact"

### Best Practices
- Keep metric **values** short (3-5 characters ideal)
- Keep metric **labels** concise (2-4 words)
- Ensure all story **Link URLs** start with `/` or use full URLs for external content
- Test trust links to ensure they navigate to the correct pages

---

## Questions or Issues?

If you need to add more fields, adjust layouts, or modify the CMS schema, refer to:
- Sanity schema docs: `src/sanity/schema/`
- Component code: `src/app/page.tsx`
- Query definitions: `src/sanity/queries.ts`
