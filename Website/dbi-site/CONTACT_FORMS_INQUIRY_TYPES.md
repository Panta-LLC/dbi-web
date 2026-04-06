# Contact forms: inquiry types (Sanity CMS)

This guide documents how to configure **Contact Form** and **Contact CTA** documents in Sanity for each major inquiry type. It is for editors and admins setting up the `/contact` page and related CTAs.

---

## How the pieces fit together


| Piece                   | Sanity type                                                                              | Role                                                                                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Contact Form**        | `contactFormDefinition` ([schema](src/sanity/schema/documents/contactFormDefinition.ts)) | Defines **field definitions** (text, email, textarea, select) and **submit button label**. Reusable across the site.                                       |
| **Contact CTA**         | `contactFormCta` ([schema](src/sanity/schema/documents/contactFormCta.ts))               | Ties a **Form ID**, sidebar/list copy, modal copy, and a **reference** to one Contact Form. Used on the Contact page list and can be referenced elsewhere. |
| **Contact section**     | Block on the `**page`** document ([schema](src/sanity/schema/objects/contactSection.ts)) | **General form** (one Contact Form reference + form ID) + optional **Additional contact form CTAs** (ordered list of Contact CTA documents).               |
| **Section / card CTAs** | `ctaAction` on sections ([schema](src/sanity/schema/objects/ctaAction.ts))               | “Open contact form” actions can reference a **Contact Form** document for field labels; **Form ID** and modal copy live on the CTA.                        |


Submissions go to `POST /api/contact` ([route](src/app/api/contact/route.ts)); **Form ID** and field values appear in notification emails.

---

## Naming conventions (recommended)

These are **editorial conventions**, not enforced by the CMS. Using them consistently makes email routing and analytics easier.

### Admin title (`Contact Form` → Admin title)

Use a clear internal name so the list in Studio is scannable:


| Inquiry type     | Suggested admin title        |
| ---------------- | ---------------------------- |
| General Inquiry  | `Contact — General inquiry`  |
| Partnership      | `Contact — Partnership`      |
| Sponsorship      | `Contact — Sponsorship`      |
| Volunteer        | `Contact — Volunteer`        |
| Advisory / Board | `Contact — Advisory & board` |


### Form ID (on **Contact CTA** or on inline CTAs)

Short, stable IDs (lowercase, hyphens). Used in the email body and for identification:


| Inquiry type     | Suggested `formId`       |
| ---------------- | ------------------------ |
| General Inquiry  | `contact-general`        |
| Partnership      | `contact-partnership`    |
| Sponsorship      | `contact-sponsorship`    |
| Volunteer        | `contact-volunteer`      |
| Advisory / Board | `contact-advisory-board` |


### Field keys (`Contact Form` → Field definitions → Field key)

Use **lowercase** letters, numbers, and underscores only (e.g. `email`, `organization_name`, `availability`). Keys must be **unique** within a single Contact Form.

---

## 1. General Inquiry

**Purpose:** Default channel for questions, introductions, and anything that does not fit a specialized flow. Usually the broadest audience.

**Contact Form — suggested field definitions**


| Field key      | Type      | Required | Notes                                                 |
| -------------- | --------- | -------- | ----------------------------------------------------- |
| `first_name`   | Text      | Yes      |                                                       |
| `last_name`    | Text      | Yes      |                                                       |
| `email`        | Email     | Yes      |                                                       |
| `organization` | Text      | No       | School, org, or “Individual”                          |
| `topic`        | Select    | No       | Options e.g. General question, Programs, Media, Other |
| `message`      | Text area | Yes      | Main question or request                              |


**Submit button label:** e.g. `Send message`

**Contact CTA** (if used as its own list item — see [Contact page checklist](#contact-page-checklist) for the usual pattern)

- **Form ID:** `contact-general`
- **Button / trigger label:** e.g. `General inquiry`
- **Contact page list label:** `General inquiry` (or match your nav tone)
- **Message context (email hint):** e.g. `Contact page — General inquiry`
- **Modal title / intro:** Short welcome line; optional

---

## 2. Partnership

**Purpose:** Organizations, schools, or collaborators exploring programs, co-design, or operational partnerships.

**Contact Form — suggested field definitions**


| Field key              | Type      | Required | Notes                          |
| ---------------------- | --------- | -------- | ------------------------------ |
| `first_name`           | Text      | Yes      |                                |
| `last_name`            | Text      | Yes      |                                |
| `email`                | Email     | Yes      |                                |
| `organization`         | Text      | Yes      |                                |
| `role_title`           | Text      | No       |                                |
| `partnership_interest` | Text area | Yes      | What partnership means to them |
| `timeline`             | Text      | No       | e.g. “Fall 2026”               |


**Submit button label:** e.g. `Submit partnership inquiry`

**Contact CTA**

- **Form ID:** `contact-partnership`
- **Button / trigger label:** e.g. `Partnership`
- **Contact page list label:** `Partnership`
- **List description (optional):** e.g. `Schools, orgs, and collaborators`
- **Message context:** e.g. `Contact page — Partnership`

---

## 3. Sponsorship

**Purpose:** Funders, sponsors, and corporate partners asking about sponsorship levels, recognition, or events.

**Contact Form — suggested field definitions**


| Field key           | Type      | Required | Notes                                              |
| ------------------- | --------- | -------- | -------------------------------------------------- |
| `first_name`        | Text      | Yes      |                                                    |
| `last_name`         | Text      | Yes      |                                                    |
| `email`             | Email     | Yes      |                                                    |
| `organization`      | Text      | Yes      |                                                    |
| `sponsorship_level` | Select    | No       | Options you maintain (e.g. Event, Annual, In-kind) |
| `message`           | Text area | Yes      | Goals, budget band, or questions                   |


**Submit button label:** e.g. `Send sponsorship inquiry`

**Contact CTA**

- **Form ID:** `contact-sponsorship`
- **Button / trigger label:** e.g. `Sponsorship`
- **Contact page list label:** `Sponsorship`
- **Message context:** e.g. `Contact page — Sponsorship`

---

## 4. Volunteer

**Purpose:** Individuals offering time, skills, or mentoring; may include availability and background.

**Contact Form — suggested field definitions**


| Field key          | Type      | Required | Notes                        |
| ------------------ | --------- | -------- | ---------------------------- |
| `first_name`       | Text      | Yes      |                              |
| `last_name`        | Text      | Yes      |                              |
| `email`            | Email     | Yes      |                              |
| `phone`            | Text      | No       |                              |
| `skills_interests` | Text area | Yes      | What they want to contribute |
| `availability`     | Text      | No       | e.g. weekdays, evenings      |
| `background`       | Text area | No       | Relevant experience          |


**Submit button label:** e.g. `Send volunteer interest`

**Contact CTA**

- **Form ID:** `contact-volunteer`
- **Button / trigger label:** e.g. `Volunteer`
- **Contact page list label:** `Volunteer`
- **Message context:** e.g. `Contact page — Volunteer`

---

## 5. Advisory / Board Involvement

**Purpose:** Interest in governance, advisory roles, or board-related conversations (not general volunteering).

**Contact Form — suggested field definitions**


| Field key          | Type      | Required | Notes                                                |
| ------------------ | --------- | -------- | ---------------------------------------------------- |
| `first_name`       | Text      | Yes      |                                                      |
| `last_name`        | Text      | Yes      |                                                      |
| `email`            | Email     | Yes      |                                                      |
| `organization`     | Text      | No       | Current or past affiliation                          |
| `expertise`        | Text area | Yes      | Relevant experience                                  |
| `involvement_type` | Select    | No       | e.g. Advisory, Board, Committee — options you define |
| `message`          | Text area | No       | Additional context                                   |


**Submit button label:** e.g. `Send inquiry`

**Contact CTA**

- **Form ID:** `contact-advisory-board`
- **Button / trigger label:** e.g. `Advisory & board`
- **Contact page list label:** `Advisory & board` (or shorter: `Advisory`)
- **Message context:** e.g. `Contact page — Advisory & board`

---

## Contact page checklist

In this repo (with `SANITY_API_WRITE_TOKEN` and Sanity env vars set): **`pnpm seed:sanity`** runs the full canonical seed—it overwrites **`site`**, **every seeded `page`** (including `/contact`), **and** the five Contact Form documents plus four Contact CTAs. To update **only** contact-related documents without touching other pages or site settings, use **`pnpm seed:sanity:contact`** (five forms + four CTAs). Add **`--with-contact-page`** to also replace the `page-contact` document with the repo’s **Contact section** wiring (`pnpm seed:sanity:contact -- --with-contact-page`). Use a dev dataset first; any command that seeds a document overwrites that document’s `_id`.

Recommended setup so **General** is not duplicated in the sidebar:

1. **Create five Contact Form documents** (one per inquiry type above), each with **Field definitions** and **Submit button label** filled in.
2. **Create four Contact CTA documents** for **Partnership**, **Sponsorship**, **Volunteer**, and **Advisory / Board** — each references the matching Contact Form and uses the **Form ID** and copy from the sections above.
3. Open the **Page** for `/contact` (`[page` document](src/sanity/schema/documents/page.ts)).
4. Add or edit a **Contact section** block:
  - **General form — Contact Form:** reference the **General Inquiry** Contact Form document.
  - **General form — Form ID:** `contact-general` (must match the intent of that form).
  - **Additional contact form CTAs:** add the four Contact CTAs in a sensible order (e.g. Partnership → Sponsorship → Volunteer → Advisory).

The **left column** will show **General contact** (or whatever you set as **General option — list label**) plus the four additional CTAs. **General Inquiry** therefore maps to the section’s **General form** row, not as a fifth duplicate CTA.

1. **Publish** the page and test each option on the live site.

---

## Legacy field labels (deprecated)

Older **Contact Form** documents may still use **Legacy field labels** instead of **Field definitions**. Prefer **Field definitions** for all new work so the site can render the configurable fields and validate submissions correctly. Migrate legacy content when convenient.

---

## Related code

- **Deep links:** On the live site, `/contact#<formId>` opens the Contact section with the matching form selected and scrolls the form panel into view. Use the same **Form ID** as in the CMS for the General form (e.g. `contact-general`) or each Contact CTA (e.g. `contact-partnership`, `contact-volunteer`). The fragment `general` also selects the General form.
- Contact section UI: `[src/components/ContactSection.tsx](src/components/ContactSection.tsx)`
- Dynamic vs legacy submission handling: `[src/lib/contact-submission.ts](src/lib/contact-submission.ts)`
- Field item schema: `[src/sanity/schema/objects/contactFormFieldItem.ts](src/sanity/schema/objects/contactFormFieldItem.ts)`

