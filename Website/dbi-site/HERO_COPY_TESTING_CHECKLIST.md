# Hero Copy Optimization - Testing Checklist

**Implementation Date**: January 2026  
**Status**: Ready for QA Testing

---

## What Changed

### Hero Headline
**Before**: "Building Belonging, Opportunity, and Academic Success for African American Youth"  
**After**: "Every African American Student in Contra Costa County Deserves to Thrive"

**Change**: 17 words → 11 words (35% reduction)

### Hero Subtitle
**Before**: "Delta Bay Impact partners with schools, families, and communities to support African American students through mentorship, advocacy, and culturally responsive programs that strengthen well-being, confidence, and academic success."

**After**: "We partner with schools and families to provide mentorship, academic support, and advocacy that creates pathways to belonging, confidence, and success for African American youth."

**Change**: 71 words → 29 words (59% reduction)

### Call-to-Action Buttons
**Before**:
- Primary: "Learn how we support students"
- Secondary: "Partner with us"

**After**:
- Primary: "See How We Support Students"
- Secondary: "Partner with Delta Bay Impact"

---

## Visual QA Testing Required

### Desktop Testing

**Breakpoints to Test**:
- [ ] **1920px** (Large desktop)
  - Verify headline fits on 1-2 lines maximum
  - Check subtitle spacing and readability
  - Ensure CTAs are properly aligned
  - Confirm hero image scales correctly

- [ ] **1440px** (Standard desktop)
  - Check headline line breaks (avoid orphaned words)
  - Verify subtitle doesn't wrap awkwardly
  - Test CTA button spacing
  - Confirm overall visual balance

- [ ] **1280px** (Small desktop/laptop)
  - Ensure headline remains on 1-2 lines
  - Check subtitle readability
  - Verify CTA buttons don't crowd
  - Test hero content/image balance

### Mobile Testing

**Devices to Test**:
- [ ] **iPhone (375px)**
  - Headline should fit 2-3 lines
  - Subtitle remains readable (not too small)
  - CTAs stack vertically or wrap appropriately
  - Hero image displays properly
  - Check that "Contra Costa County" doesn't break awkwardly

- [ ] **Large phone (414px - iPhone Pro Max)**
  - Similar to 375px but more breathing room
  - Verify improved spacing
  - Check line breaks

- [ ] **Tablet (768px - iPad)**
  - Test both portrait and landscape
  - Verify hero layout transitions smoothly
  - Check if two-column layout activates

### Typography Verification

- [ ] **Headline (`heading-1` class)**
  - Font size scales appropriately (clamp function working)
  - Line height provides adequate spacing
  - No awkward line breaks (check "Contra Costa County")
  - Bold weight displays correctly

- [ ] **Subtitle (`body-md` class)**
  - Font size is readable (min 16px on mobile)
  - Line height comfortable (1.4 or higher)
  - Text color has sufficient contrast
  - Spacing between headline and subtitle feels balanced

- [ ] **CTA Buttons**
  - Text is fully visible (no truncation)
  - Hover states work correctly
  - Focus states visible for accessibility
  - Mobile tap targets meet 44px minimum

---

## Content Review Checklist

### Message Clarity
- [ ] Headline immediately communicates who you serve (African American students)
- [ ] Geographic focus is clear (Contra Costa County)
- [ ] Value proposition is understandable at a glance
- [ ] Tone feels empowering and aspirational
- [ ] "Deserves to Thrive" resonates emotionally

### Accuracy & Consistency
- [ ] Service description matches what you actually provide
- [ ] Geographic area is correct (serving Bay Point, Concord, Pittsburg)
- [ ] CTAs lead to appropriate pages (/programs, /contact)
- [ ] Copy aligns with brand voice and mission
- [ ] No spelling or grammar errors

### SEO & Meta Tags
- [ ] Page title updated: "Delta Bay Impact | Every African American Student Deserves to Thrive"
- [ ] Meta description reflects new hero copy
- [ ] Open Graph title matches headline
- [ ] Twitter Card description updated
- [ ] Structured data schema updated with new description

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through hero section
- [ ] All interactive elements receive focus
- [ ] Focus indicators are visible
- [ ] Tab order is logical (headline → subtitle → CTA1 → CTA2)

### Screen Reader Testing
- [ ] Headline announced correctly
- [ ] Subtitle is readable without interruption
- [ ] CTA button labels are clear and actionable
- [ ] Hero image alt text is descriptive

### Color Contrast
- [ ] Headline text meets WCAG AA (4.5:1 minimum)
- [ ] Subtitle text meets WCAG AA
- [ ] CTA button text readable on background
- [ ] Hover/focus states maintain contrast

---

## Performance Testing

### Page Load
- [ ] Hero image loads quickly (prioritized with `priority` attribute)
- [ ] No layout shift when content loads
- [ ] Text appears before images (progressive enhancement)
- [ ] Mobile load time < 3 seconds

### Lighthouse Scores
Run in Chrome DevTools (Cmd+Shift+I → Lighthouse tab):
- [ ] Performance: Target 90+
- [ ] Accessibility: Target 95+
- [ ] Best Practices: Target 95+
- [ ] SEO: Target 100

---

## Social Media Preview Testing

### Facebook
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter URL: https://dbi-site.vercel.app
3. Click "Scrape Again" to refresh
4. Verify:
   - [ ] Title: "Every African American Student in Contra Costa County Deserves to Thrive"
   - [ ] Description matches new subtitle
   - [ ] DBI logo displays correctly

### Twitter/X
1. Go to: https://cards-dev.twitter.com/validator
2. Enter URL: https://dbi-site.vercel.app
3. Preview card
4. Verify:
   - [ ] Title: "Every African American Student Deserves to Thrive | Delta Bay Impact"
   - [ ] Description matches new copy
   - [ ] Image displays

### LinkedIn
1. Use LinkedIn Post Composer
2. Paste URL: https://dbi-site.vercel.app
3. Verify preview displays correctly
4. Check:
   - [ ] Title appears
   - [ ] Description is readable
   - [ ] Image renders

---

## Browser Compatibility Testing

Test on multiple browsers to ensure consistency:

- [ ] **Chrome** (latest)
- [ ] **Safari** (latest) - especially important for iOS users
- [ ] **Firefox** (latest)
- [ ] **Edge** (latest)
- [ ] **Mobile Safari** (iOS)
- [ ] **Chrome Mobile** (Android)

### What to Check
- Font rendering (weights, sizes)
- Button styles
- Layout integrity
- Animation timing (hero entrance)
- Image rendering

---

## User Experience Observations

### First Impressions (Ask 2-3 people)
- [ ] Does the headline immediately communicate what DBI does?
- [ ] Is the location (Contra Costa County) clear?
- [ ] Do CTAs feel actionable and inviting?
- [ ] Does the message feel empowering/inspiring?
- [ ] Any confusing or unclear language?

### Reading Flow
- [ ] Eye naturally flows from headline → subtitle → CTAs
- [ ] No awkward pauses or confusion
- [ ] Information hierarchy is clear
- [ ] White space feels balanced

---

## Analytics Baseline (BEFORE Launch)

### Record Current Metrics (7-day average)

**From Google Analytics**:
- [ ] Bounce rate: ____%
- [ ] Avg. session duration: ____ seconds
- [ ] Pages per session: ____
- [ ] CTA click-through rate: ____%
- [ ] Newsletter signups per day: ____
- [ ] Contact form submissions per week: ____

**From Google Search Console**:
- [ ] Avg. click-through rate: ____%
- [ ] Avg. position: ____
- [ ] Impressions per day: ____

---

## Post-Launch Monitoring Plan

### Week 1 (Days 1-7)
- [ ] **Day 1**: Check for any broken elements or console errors
- [ ] **Day 3**: Review heatmap data (if using Hotjar/Clarity)
- [ ] **Day 7**: Compare bounce rate and session duration to baseline

### Week 2 (Days 8-14)
- [ ] **Day 10**: Check CTA click-through rates
- [ ] **Day 14**: Full analytics review:
  - Bounce rate change
  - Session duration change
  - Scroll depth (are users scrolling past hero?)
  - CTA performance (primary vs. secondary)

### Week 3-4 (Days 15-30)
- [ ] **Day 21**: Review search console data (impressions, clicks)
- [ ] **Day 30**: Comprehensive report:
  - Overall traffic changes
  - Conversion rate changes
  - User feedback (if collected)
  - Decision: keep, tweak, or revert

---

## Expected Improvements

### Readability
- **Target**: 50% faster comprehension (29 words vs. 71 words)
- **Measure**: Session time in first 30 seconds

### SEO
- **Target**: 20-30% increase in local search traffic
- **Measure**: Google Search Console impressions for "African American youth [city]"

### Conversion
- **Target**: 15-25% increase in CTA click-through rate
- **Measure**: GA4 event tracking on hero buttons

---

## Known Considerations

### Typography
- New headline is shorter but uses longer words ("Contra Costa County")
- Monitor for awkward line breaks on mobile
- "Deserves to Thrive" may orphan on some screens

### Messaging
- More direct/bold than previous copy
- Emphasizes "every student" (universal) vs. "building" (process)
- Geographic specificity may help or limit (testing will tell)

---

## Issue Reporting

If you encounter any problems during testing:

**Visual Issues**:
- Take screenshot
- Note device/browser
- Describe expected vs. actual behavior

**Content Issues**:
- Copy exact text that needs changing
- Suggest alternative wording
- Note context (where does this appear?)

**Technical Issues**:
- Check browser console for errors (F12 → Console tab)
- Note steps to reproduce
- Include error messages if any

---

## Rollback Plan

If hero copy underperforms after 2 weeks:

1. **Revert seed file**:
   ```bash
   git checkout HEAD~1 scripts/seed-sanity.js
   ```

2. **Reseed CMS**:
   ```bash
   npm run seed:sanity
   ```

3. **Revert meta tags**:
   ```bash
   git checkout HEAD~1 src/app/layout.tsx
   git checkout HEAD~1 src/components/StructuredData.tsx
   ```

4. **Monitor for 48 hours** to confirm reversion took effect

---

## Success Criteria (30 Days)

The new hero copy is considered successful if:

- [ ] Bounce rate decreases by 10% or more
- [ ] CTA click-through rate increases by 15% or more
- [ ] Session duration increases by 20% or more
- [ ] Organic search traffic increases (any amount)
- [ ] No negative feedback from stakeholders/users
- [ ] Social shares maintain or improve

**Decision Date**: [Set 30 days from launch]

---

## Next Steps

1. [ ] Complete all visual QA checks on this list
2. [ ] Test social media previews
3. [ ] Record baseline analytics metrics
4. [ ] Deploy to production (if on staging)
5. [ ] Set calendar reminder for Week 1, 2, and 4 reviews
6. [ ] Share with board/stakeholders for feedback

---

## Contact for Questions

If you have questions about the new copy or implementation:
- Review original plan: `hero_copy_optimization_dfde0daa.plan.md`
- Check strategic roadmap: `STRATEGIC_ROADMAP.md`
- Review quick wins doc: `QUICK_WINS_IMPLEMENTED.md`
