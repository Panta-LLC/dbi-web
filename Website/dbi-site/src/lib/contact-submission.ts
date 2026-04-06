/** Shared validation + formatting for POST /api/contact */

import type { ContactFormFieldDef } from "@/lib/contact-form-fields";

export const CONTACT_API_PATH = "/api/contact";

/** Form id for newsletter signups via CtaModalForm (see NewsletterSignup). */
export const NEWSLETTER_FORM_ID = "newsletter-signup";

/** Fixed choices for newsletter self-identification (must match UI submit values). */
export const NEWSLETTER_SELF_IDENTIFICATION_OPTIONS = [
  "Student",
  "Parent",
  "Community Member",
  "School Staff or Administration",
  "Other",
] as const;

export const MAX_LEN = {
  firstName: 120,
  lastName: 120,
  email: 320,
  organization: 200,
  message: 5000,
  dynamicFieldValue: 5000,
  formId: 64,
  triggerLabel: 160,
  messageContext: 240,
  selfIdentification: 120,
  contactFormDefinitionId: 128,
} as const;

export type ContactPayload = {
  formId: string;
  /** CTA copy — used for the email subject line */
  triggerLabel: string;
  /** Where the form was opened (e.g. page/section); included in the email body */
  messageContext?: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  /** Role / audience (required for newsletter form; optional elsewhere). */
  selfIdentification: string;
  message: string;
  /** Honeypot — must be empty */
  website?: string;
};

/** Custom Contact Form definition submissions (keys match CMS field keys). */
export type DynamicContactPayload = {
  formId: string;
  triggerLabel: string;
  messageContext?: string;
  contactFormDefinitionId: string;
  dynamicFields: Record<string, string>;
  website?: string;
};

export type ContactValidationResult =
  | { ok: true; data: ContactPayload }
  | { ok: false; error: string; status: number };

function trimStr(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactBody(body: unknown): ContactValidationResult {
  if (body === null || typeof body !== "object") {
    return { ok: false, error: "Invalid request body.", status: 400 };
  }

  const o = body as Record<string, unknown>;

  if (typeof o.contactFormDefinitionId === "string" && o.contactFormDefinitionId.trim() !== "") {
    return { ok: false, error: "Use the dynamic contact payload for this form.", status: 400 };
  }

  const website = trimStr(o.website, 200);
  if (website.length > 0) {
    return { ok: false, error: "Invalid request.", status: 400 };
  }

  const formId = trimStr(o.formId, MAX_LEN.formId);
  const triggerLabel = trimStr(o.triggerLabel, MAX_LEN.triggerLabel);
  const messageContextRaw = trimStr(o.messageContext, MAX_LEN.messageContext);
  const messageContext = messageContextRaw.length > 0 ? messageContextRaw : undefined;
  const firstName = trimStr(o.firstName, MAX_LEN.firstName);
  const lastName = trimStr(o.lastName, MAX_LEN.lastName);
  const email = trimStr(o.email, MAX_LEN.email).toLowerCase();
  const organization = trimStr(o.organization, MAX_LEN.organization);
  const selfIdentification = trimStr(o.selfIdentification, MAX_LEN.selfIdentification);
  const message = trimStr(o.message, MAX_LEN.message);

  const isNewsletter = formId === NEWSLETTER_FORM_ID;

  if (!formId) {
    return { ok: false, error: "Form identifier is required.", status: 400 };
  }
  if (!triggerLabel) {
    return { ok: false, error: "Trigger label is required.", status: 400 };
  }
  if (!firstName) {
    return { ok: false, error: "First name is required.", status: 400 };
  }
  if (!lastName) {
    return { ok: false, error: "Last name is required.", status: 400 };
  }
  if (!email) {
    return { ok: false, error: "Email is required.", status: 400 };
  }
  if (!emailRegex.test(email)) {
    return { ok: false, error: "Please enter a valid email address.", status: 400 };
  }
  if (isNewsletter) {
    if (!selfIdentification) {
      return { ok: false, error: "Please select how you identify.", status: 400 };
    }
  } else if (!message) {
    return { ok: false, error: "Message is required.", status: 400 };
  }

  return {
    ok: true,
    data: {
      formId,
      triggerLabel,
      ...(messageContext !== undefined && { messageContext }),
      firstName,
      lastName,
      email,
      organization,
      selfIdentification,
      message,
    },
  };
}

export type DynamicContactValidationResult =
  | { ok: true; data: DynamicContactPayload }
  | { ok: false; error: string; status: number };

/**
 * Validates POST body for CMS-defined fields. Pass the same field list as the Contact Form document
 * (after `normalizeContactFormFieldDefinitions`).
 */
export function validateDynamicContactBody(
  body: unknown,
  definitionFields: ContactFormFieldDef[],
): DynamicContactValidationResult {
  if (body === null || typeof body !== "object") {
    return { ok: false, error: "Invalid request body.", status: 400 };
  }

  const o = body as Record<string, unknown>;

  const website = trimStr(o.website, 200);
  if (website.length > 0) {
    return { ok: false, error: "Invalid request.", status: 400 };
  }

  const formId = trimStr(o.formId, MAX_LEN.formId);
  const triggerLabel = trimStr(o.triggerLabel, MAX_LEN.triggerLabel);
  const messageContextRaw = trimStr(o.messageContext, MAX_LEN.messageContext);
  const messageContext = messageContextRaw.length > 0 ? messageContextRaw : undefined;
  const contactFormDefinitionId = trimStr(o.contactFormDefinitionId, MAX_LEN.contactFormDefinitionId);

  if (!formId) {
    return { ok: false, error: "Form identifier is required.", status: 400 };
  }
  if (!triggerLabel) {
    return { ok: false, error: "Trigger label is required.", status: 400 };
  }
  if (!contactFormDefinitionId) {
    return { ok: false, error: "Contact form definition is required.", status: 400 };
  }

  if (o.dynamicFields === null || typeof o.dynamicFields !== "object" || Array.isArray(o.dynamicFields)) {
    return { ok: false, error: "Invalid field data.", status: 400 };
  }

  const rawFields = o.dynamicFields as Record<string, unknown>;
  const allowedNames = new Set(definitionFields.map((f) => f.name));

  for (const key of Object.keys(rawFields)) {
    if (!allowedNames.has(key)) {
      return { ok: false, error: "Unexpected field in submission.", status: 400 };
    }
  }

  const dynamicFields: Record<string, string> = {};

  for (const def of definitionFields) {
    const raw = rawFields[def.name];
    const s =
      typeof raw === "string" ? raw.trim().slice(0, MAX_LEN.dynamicFieldValue) : "";
    if (def.required && !s) {
      return { ok: false, error: `${def.label} is required.`, status: 400 };
    }
    if (def.fieldType === "email" && s) {
      const lower = s.toLowerCase();
      if (!emailRegex.test(lower)) {
        return { ok: false, error: "Please enter a valid email address.", status: 400 };
      }
      dynamicFields[def.name] = lower;
      continue;
    }
    if (def.fieldType === "select" && s) {
      const opts = def.selectOptions ?? [];
      if (opts.length > 0 && !opts.includes(s)) {
        return { ok: false, error: "Invalid selection.", status: 400 };
      }
    }
    dynamicFields[def.name] = s;
  }

  return {
    ok: true,
    data: {
      formId,
      triggerLabel,
      ...(messageContext !== undefined && { messageContext }),
      contactFormDefinitionId,
      dynamicFields,
    },
  };
}

export function buildContactEmailPartsDynamic(
  data: DynamicContactPayload,
  definitionFields: ContactFormFieldDef[],
): { subject: string; text: string; html: string; replyTo: string | undefined } {
  const esc = escapeHtml;
  const lines: string[] = [
    `Form: ${data.formId}`,
    `CTA: ${data.triggerLabel}`,
    ...(data.messageContext ? [`Context: ${data.messageContext}`] : []),
    `Contact Form definition: ${data.contactFormDefinitionId}`,
    "",
  ];

  let replyTo: string | undefined;
  const htmlRows: string[] = [];

  for (const def of definitionFields) {
    const v = data.dynamicFields[def.name] ?? "";
    lines.push(`${def.label}: ${v || "(not provided)"}`);
    htmlRows.push(
      `<tr><td style="padding:4px 8px;font-weight:bold;vertical-align:top;">${esc(def.label)}</td><td style="padding:4px 8px;">${v ? esc(v) : "<em>Not provided</em>"}</td></tr>`,
    );
    if (def.fieldType === "email" && v && !replyTo) {
      replyTo = v;
    }
  }

  const text = lines.join("\n");

  const subjectLead =
    replyTo ||
    definitionFields.map((d) => data.dynamicFields[d.name]).find((x) => x && x.trim()) ||
    data.formId;
  const subject = `[DBI Website] ${data.triggerLabel} — ${subjectLead}`;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
<tr><td style="padding:4px 8px;font-weight:bold;">Form</td><td style="padding:4px 8px;">${esc(data.formId)}</td></tr>
<tr><td style="padding:4px 8px;font-weight:bold;">CTA</td><td style="padding:4px 8px;">${esc(data.triggerLabel)}</td></tr>
${
  data.messageContext
    ? `<tr><td style="padding:4px 8px;font-weight:bold;vertical-align:top;">Context</td><td style="padding:4px 8px;">${esc(data.messageContext)}</td></tr>`
    : ""
}
${htmlRows.join("")}
</table>
</body></html>`;

  return { subject, text, html, replyTo };
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildContactEmailParts(data: ContactPayload): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `[DBI Website] ${data.triggerLabel} — ${data.firstName} ${data.lastName}`;

  const lines = [
    `Form: ${data.formId}`,
    `CTA: ${data.triggerLabel}`,
    ...(data.messageContext ? [`Context: ${data.messageContext}`] : []),
    `Name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    ...(data.selfIdentification
      ? [`Self-identification: ${data.selfIdentification}`]
      : []),
    data.organization ? `Organization: ${data.organization}` : "Organization: (not provided)",
    ...(data.message
      ? ["", "Message:", data.message]
      : []),
  ];

  const text = lines.join("\n");

  const esc = escapeHtml;
  const selfIdRow = data.selfIdentification
    ? `<tr><td style="padding:4px 8px;font-weight:bold;vertical-align:top;">Self-identification</td><td style="padding:4px 8px;">${esc(data.selfIdentification)}</td></tr>`
    : "";
  const messageBlock =
    data.message.trim().length > 0
      ? `<p style="font-family:sans-serif;font-size:14px;font-weight:bold;margin-top:16px;">Message</p>
<pre style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;margin:0;">${esc(data.message)}</pre>`
      : "";
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
<tr><td style="padding:4px 8px;font-weight:bold;">Form</td><td style="padding:4px 8px;">${esc(data.formId)}</td></tr>
<tr><td style="padding:4px 8px;font-weight:bold;">CTA</td><td style="padding:4px 8px;">${esc(data.triggerLabel)}</td></tr>
${
  data.messageContext
    ? `<tr><td style="padding:4px 8px;font-weight:bold;vertical-align:top;">Context</td><td style="padding:4px 8px;">${esc(data.messageContext)}</td></tr>`
    : ""
}
<tr><td style="padding:4px 8px;font-weight:bold;">Name</td><td style="padding:4px 8px;">${esc(data.firstName)} ${esc(data.lastName)}</td></tr>
<tr><td style="padding:4px 8px;font-weight:bold;">Email</td><td style="padding:4px 8px;"><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></td></tr>
${selfIdRow}
<tr><td style="padding:4px 8px;font-weight:bold;vertical-align:top;">Organization</td><td style="padding:4px 8px;">${data.organization ? esc(data.organization) : "<em>Not provided</em>"}</td></tr>
</table>
${messageBlock}
</body></html>`;

  return { subject, text, html };
}

/** Simple in-memory rate limit (best-effort per server instance; not suitable for strict multi-region limits). */
const bucket = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 8;

export function rateLimitContact(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const prev = bucket.get(ip) ?? [];
  const recent = prev.filter((t) => t > windowStart);
  if (recent.length >= MAX_REQUESTS) {
    bucket.set(ip, recent);
    return false;
  }
  recent.push(now);
  bucket.set(ip, recent);
  return true;
}

export function getClientIp(request: Request): string {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real?.trim()) return real.trim();
  return "unknown";
}
