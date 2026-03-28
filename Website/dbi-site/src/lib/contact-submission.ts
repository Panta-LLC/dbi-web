/** Shared validation + formatting for POST /api/contact */

export const CONTACT_API_PATH = "/api/contact";

export const MAX_LEN = {
  firstName: 120,
  lastName: 120,
  email: 320,
  organization: 200,
  message: 5000,
  formId: 64,
  triggerLabel: 160,
  messageContext: 240,
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
  message: string;
  /** Honeypot — must be empty */
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
  const message = trimStr(o.message, MAX_LEN.message);

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
  if (!message) {
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
      message,
    },
  };
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
    data.organization ? `Organization: ${data.organization}` : "Organization: (not provided)",
    "",
    "Message:",
    data.message,
  ];

  const text = lines.join("\n");

  const esc = escapeHtml;
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
<tr><td style="padding:4px 8px;font-weight:bold;vertical-align:top;">Organization</td><td style="padding:4px 8px;">${data.organization ? esc(data.organization) : "<em>Not provided</em>"}</td></tr>
</table>
<p style="font-family:sans-serif;font-size:14px;font-weight:bold;margin-top:16px;">Message</p>
<pre style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;margin:0;">${esc(data.message)}</pre>
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
