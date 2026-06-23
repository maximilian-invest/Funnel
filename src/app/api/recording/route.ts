import { NextRequest, NextResponse } from "next/server";
import { sendRecordingRequestEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// A visitor entered their e-mail to watch the recording → notify the team.
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const email = String(b?.email ?? "").trim().slice(0, 160);
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  try {
    await sendRecordingRequestEmail(email);
  } catch (e) {
    console.error("[recording] email error", e);
  }
  return NextResponse.json({ ok: true });
}
