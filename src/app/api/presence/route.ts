import { NextRequest, NextResponse } from "next/server";
import { touch, concurrent, getPeak, claimEmailSlot } from "@/lib/presence";
import { sendViewerCountEmail } from "@/lib/email";
import { WEBINAR } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const START = WEBINAR.date.getTime();
const END = START + WEBINAR.video.durationSec * 1000 + 30 * 60_000; // live window + buffer

// Anonymous heartbeat from the webinar page. NEVER returns the count — the real
// number goes only to the admin by email; viewers see only the decorative badge.
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const id = String(b?.id ?? "").slice(0, 60);
  if (id) touch(id);
  const count = concurrent(); // updates peak + prunes

  const now = Date.now();
  if (now >= START && now <= END && count > 0 && claimEmailSlot()) {
    void sendViewerCountEmail(count, getPeak()).catch(() => {}); // fire-and-forget
  }
  return NextResponse.json({ ok: true });
}
