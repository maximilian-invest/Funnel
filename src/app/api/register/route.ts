import { NextRequest, NextResponse } from "next/server";
import { sendRegistrationEmails, verifySmtp, verifyResend } from "@/lib/email";
import { supabaseEnabled, addRegistration, listRegistrations } from "@/lib/registrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Diagnostics: GET confirms this server build is live and whether the SMTP env
// vars are present (booleans only — no secrets exposed).
export async function GET(req: NextRequest) {
  const provider = process.env.RESEND_API_KEY ? "resend" : process.env.SMTP_HOST ? "smtp" : "none";
  const base = {
    ok: true,
    endpoint: "register",
    provider,
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    smtpConfigured: Boolean(
      process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
    ),
    supabaseConfigured: supabaseEnabled(),
    mailFrom: process.env.MAIL_FROM ?? null,
    mailTo: process.env.MAIL_TO ?? null,
  };
  // ?selftest=1 → check the active provider (no mail sent) and report any error
  if (req.nextUrl.searchParams.get("selftest")) {
    const verify = process.env.RESEND_API_KEY ? await verifyResend() : await verifySmtp();
    const registrations = supabaseEnabled() ? (await listRegistrations()).length : null;
    return NextResponse.json({ ...base, verify, registrations });
  }
  return NextResponse.json(base);
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

    const siteUrl = process.env.MAIL_SITE_URL || "https://live.allround.immo";

    // persist + build the cumulative list (newest first) for the team email
    let registrants: { name: string; email: string; created_at?: string }[] = [{ name, email }];
    if (supabaseEnabled()) {
      try {
        await addRegistration(name, email);
        const all = await listRegistrations();
        if (all.length) registrants = all;
      } catch (e) {
        console.error("[register] supabase error", e);
      }
    }

    await sendRegistrationEmails(name, email, siteUrl, registrants);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[register] error", err);
    // never hard-fail the signup UX
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
