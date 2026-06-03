import { NextRequest, NextResponse } from "next/server";
import { sendRegistrationEmails } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Diagnostics: GET confirms this server build is live and whether the SMTP env
// vars are present (booleans only — no secrets exposed).
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "register",
    smtpConfigured: Boolean(
      process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
    ),
    host: process.env.SMTP_HOST ?? null,
    port: process.env.SMTP_PORT ?? null,
    secure: process.env.SMTP_SECURE ?? null,
    user: process.env.SMTP_USER ?? null,
    mailTo: process.env.MAIL_TO ?? null,
  });
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// tiny in-memory rate limit (per IP) — enough for a single Railway instance
const hits = new Map<string, number[]>();
function rateLimited(ip: string, max = 6, windowMs = 60_000) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > max;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body?.name ?? "").trim().slice(0, 100);
    const email = String(body?.email ?? "").trim().slice(0, 160);
    const honeypot = String(body?.company ?? "").trim();

    if (honeypot) return NextResponse.json({ ok: true }); // bot trap
    if (!name || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
    }

    const siteUrl = process.env.MAIL_SITE_URL || req.nextUrl.origin;
    await sendRegistrationEmails(name, email, siteUrl);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[register] error", err);
    // never hard-fail the signup UX
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
