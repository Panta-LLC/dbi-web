import { NextResponse } from "next/server";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

function getMailchimpBaseUrl(): string {
  if (!MAILCHIMP_API_KEY) return "";
  const dc = MAILCHIMP_API_KEY.split("-").pop();
  return `https://${dc}.api.mailchimp.com/3.0`;
}

/** GET /api/newsletter/subscribe - Verify Mailchimp config (for admins debugging) */
export async function GET() {
  if (!MAILCHIMP_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "MAILCHIMP_API_KEY is not set in environment" },
      { status: 503 }
    );
  }
  if (!MAILCHIMP_LIST_ID) {
    return NextResponse.json(
      { ok: false, error: "MAILCHIMP_LIST_ID is not set in environment" },
      { status: 503 }
    );
  }

  const dc = MAILCHIMP_API_KEY.split("-").pop();
  const baseUrl = getMailchimpBaseUrl();
  const url = `${baseUrl}/lists/${encodeURIComponent(MAILCHIMP_LIST_ID)}`;
  const auth = Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64");

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
  });
  const data = (await res.json().catch(() => ({}))) as { name?: string; id?: string; status?: number };

  if (!res.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Mailchimp list not found (404)",
        hint: "Check: (1) List ID from Audience → Manage Audience → Settings → Audience ID. (2) API key datacenter (-us1, -us2, etc.) must match where your audience was created.",
        dc,
        listIdLength: MAILCHIMP_LIST_ID.length,
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    listName: data.name,
    dc,
  });
}

export async function POST(request: Request) {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
    return NextResponse.json(
      { error: "Newsletter signup is not configured." },
      { status: 503 }
    );
  }

  let body: { email?: string; firstName?: string; lastName?: string; listId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const listId = typeof body?.listId === "string" && body.listId.trim()
    ? body.listId.trim()
    : MAILCHIMP_LIST_ID;

  if (!listId) {
    return NextResponse.json(
      { error: "Newsletter signup is not configured." },
      { status: 503 }
    );
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const baseUrl = getMailchimpBaseUrl();
  const url = `${baseUrl}/lists/${encodeURIComponent(listId)}/members`;

  const auth = Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64");

  const mergeFields: Record<string, string> = {};
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
  if (firstName) mergeFields.FNAME = firstName;
  if (lastName) mergeFields.LNAME = lastName;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      email_address: email.toLowerCase(),
      status: "subscribed",
      ...(Object.keys(mergeFields).length > 0 && { merge_fields: mergeFields }),
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 400 && data.title === "Member Exists") {
      return NextResponse.json(
        { message: "You're already subscribed. Thanks!" },
        { status: 200 }
      );
    }
    if (response.status === 400 && data.title === "Invalid Resource") {
      return NextResponse.json(
        { error: data.detail || "Invalid email address." },
        { status: 400 }
      );
    }
    const dc = MAILCHIMP_API_KEY.split("-").pop();
    console.error("[Mailchimp API error]", response.status, {
      ...data,
      _hint: "404 usually means wrong list ID or API key datacenter. List ID from Audience → Settings → Audience ID. API key suffix (e.g. -us1) must match audience region.",
      _dc: dc,
      _listIdLength: listId.length,
    });
    return NextResponse.json(
      {
        error:
          response.status === 404
            ? "Newsletter configuration error. Please contact the site administrator."
            : "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Thanks for subscribing!" },
    { status: 200 }
  );
}
