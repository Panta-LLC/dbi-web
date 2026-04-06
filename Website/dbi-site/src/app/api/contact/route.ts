import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { normalizeContactFormFieldDefinitions } from "@/lib/contact-form-fields";
import {
  buildContactEmailParts,
  buildContactEmailPartsDynamic,
  getClientIp,
  rateLimitContact,
  validateContactBody,
  validateDynamicContactBody,
} from "@/lib/contact-submission";
import { sanityClient } from "@/sanity/client";
import { contactFormDefinitionByIdQuery } from "@/sanity/queries";

const SMTP_HOST = process.env.SMTP_HOST?.trim();
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER?.trim();
const SMTP_PASS = process.env.SMTP_PASS?.trim();
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL?.trim();
/** Envelope From; falls back to SMTP user when unset or blank. */
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL?.trim() || SMTP_USER || undefined;

function missingContactEnvVars(): string[] {
  const missing: string[] = [];
  if (!SMTP_HOST) missing.push("SMTP_HOST");
  if (!SMTP_USER) missing.push("SMTP_USER");
  if (!SMTP_PASS) missing.push("SMTP_PASS");
  if (!CONTACT_TO_EMAIL) missing.push("CONTACT_TO_EMAIL");
  return missing;
}

function isConfigured(): boolean {
  return missingContactEnvVars().length === 0;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number.isFinite(SMTP_PORT) ? SMTP_PORT : 587,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

async function fetchContactFormDefinition(id: string) {
  const candidates = [id, id.startsWith("drafts.") ? id : `drafts.${id}`];
  for (const cid of candidates) {
    const doc = await sanityClient.fetch(contactFormDefinitionByIdQuery, { id: cid });
    if (doc) return doc as Parameters<typeof normalizeContactFormFieldDefinitions>[0] & {
      fieldDefinitions?: unknown;
    };
  }
  return null;
}

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      {
        error:
          "Contact form email is not configured. Set SMTP and inbox env vars on the server (see .env.example).",
        missing: missingContactEnvVars(),
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const isDynamic =
    typeof o.contactFormDefinitionId === "string" &&
    o.contactFormDefinitionId.trim() !== "" &&
    o.dynamicFields !== null &&
    typeof o.dynamicFields === "object" &&
    !Array.isArray(o.dynamicFields);

  if (isDynamic) {
    const defDoc = await fetchContactFormDefinition(o.contactFormDefinitionId as string);
    if (!defDoc) {
      return NextResponse.json({ error: "Contact form configuration not found." }, { status: 400 });
    }
    const defs = normalizeContactFormFieldDefinitions(defDoc.fieldDefinitions);
    if (defs.length === 0) {
      return NextResponse.json({ error: "Contact form has no fields." }, { status: 400 });
    }

    const validated = validateDynamicContactBody(body, defs);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: validated.status });
    }

    const ip = getClientIp(request);
    if (!rateLimitContact(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const { data } = validated;
    const { subject, text, html, replyTo } = buildContactEmailPartsDynamic(data, defs);

    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: CONTACT_FROM_EMAIL,
        to: CONTACT_TO_EMAIL,
        replyTo: replyTo ?? CONTACT_FROM_EMAIL,
        subject,
        text,
        html,
      });
    } catch (err) {
      console.error("[contact] sendMail failed", err);
      return NextResponse.json(
        { error: "Something went wrong. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Thanks — your message has been sent." },
      { status: 200 },
    );
  }

  const validated = validateContactBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: validated.status });
  }

  const ip = getClientIp(request);
  if (!rateLimitContact(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const { data } = validated;
  const { subject, text, html } = buildContactEmailParts(data);

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: data.email,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("[contact] sendMail failed", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Thanks — your message has been sent." },
    { status: 200 },
  );
}
