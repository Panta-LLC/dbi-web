import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  buildContactEmailParts,
  getClientIp,
  rateLimitContact,
  validateContactBody,
} from "@/lib/contact-submission";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? SMTP_USER;

function isConfigured(): boolean {
  return Boolean(
    SMTP_HOST && CONTACT_TO_EMAIL && CONTACT_FROM_EMAIL && SMTP_USER && SMTP_PASS
  );
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

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Contact form is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validated = validateContactBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: validated.status });
  }

  const ip = getClientIp(request);
  if (!rateLimitContact(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
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
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Thanks — your message has been sent." },
    { status: 200 }
  );
}
