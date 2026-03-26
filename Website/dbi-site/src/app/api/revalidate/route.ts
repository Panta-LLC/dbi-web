import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { parseBody } from "next-sanity/webhook";

/**
 * On-demand ISR: call this URL from a Sanity webhook when content changes.
 *
 * Sanity (manage.sanity.io → Project → API → Webhooks):
 * - URL: https://<your-domain>/api/revalidate
 * - Secret: same value as SANITY_REVALIDATE_SECRET or REVALIDATE_SECRET in the host env (signing)
 * - Trigger on create / update / delete for the dataset you publish from
 *
 * Manual test: GET /api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 * or POST with Authorization: Bearer <SANITY_REVALIDATE_SECRET>
 */
async function revalidateSite() {
  revalidatePath("/", "layout");
}

function getRevalidateSecret(): string | undefined {
  return process.env.SANITY_REVALIDATE_SECRET ?? process.env.REVALIDATE_SECRET;
}

function requireSecret(): string | NextResponse {
  const secret = getRevalidateSecret();
  if (!secret) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Set SANITY_REVALIDATE_SECRET (or REVALIDATE_SECRET) in the host env (e.g. Vercel → Settings → Environment Variables), same value as the Sanity webhook secret, then redeploy.",
      },
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
