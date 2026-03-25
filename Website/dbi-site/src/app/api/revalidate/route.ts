import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { parseBody } from "next-sanity/webhook";

/**
 * On-demand ISR: call this URL from a Sanity webhook when content changes.
 *
 * Sanity (manage.sanity.io → Project → API → Webhooks):
 * - URL: https://<your-domain>/api/revalidate
 * - Secret: same value as SANITY_REVALIDATE_SECRET in Vercel (used for request signing)
 * - Trigger on create / update / delete for the dataset you publish from
 *
 * Manual test: GET /api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 * or POST with Authorization: Bearer <SANITY_REVALIDATE_SECRET>
 */
async function revalidateSite() {
  revalidatePath("/", "layout");
}

function requireSecret(): string | NextResponse {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, message: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }
  return secret;
}

export async function POST(req: NextRequest) {
  const secretOrError = requireSecret();
  if (typeof secretOrError !== "string") {
    return secretOrError;
  }
  const secret = secretOrError;

  if (req.headers.get(SIGNATURE_HEADER_NAME)) {
    const { isValidSignature } = await parseBody(req, secret);
    if (isValidSignature !== true) {
      return NextResponse.json({ ok: false, message: "Invalid signature" }, { status: 401 });
    }
    await revalidateSite();
    return NextResponse.json({ ok: true, revalidated: true });
  }

  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const querySecret = req.nextUrl.searchParams.get("secret") ?? "";
  if (bearer !== secret && querySecret !== secret) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  await revalidateSite();
  return NextResponse.json({ ok: true, revalidated: true });
}

export async function GET(req: NextRequest) {
  const secretOrError = requireSecret();
  if (typeof secretOrError !== "string") {
    return secretOrError;
  }
  const secret = secretOrError;

  if (req.nextUrl.searchParams.get("secret") !== secret) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  await revalidateSite();
  return NextResponse.json({ ok: true, revalidated: true });
}
