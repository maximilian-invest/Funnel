import { NextRequest, NextResponse } from "next/server";
import { chatEnabled, addMessage, listMessages } from "@/lib/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// simple per-IP rate limit (single Railway instance)
const hits = new Map<string, number[]>();
function rateLimited(ip: string, max = 12, windowMs = 20_000) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > max;
}

export async function GET(req: NextRequest) {
  if (!chatEnabled()) return NextResponse.json({ messages: [] });
  const afterRaw = Number(req.nextUrl.searchParams.get("after") || 0);
  const after = Number.isFinite(afterRaw) && afterRaw > 0 ? afterRaw : 0;
  return NextResponse.json({ messages: await listMessages(after) });
}

export async function POST(req: NextRequest) {
  if (!chatEnabled()) {
    return NextResponse.json({ ok: false, error: "disabled" }, { status: 503 });
  }
  try {
    const b = await req.json().catch(() => ({}));
    const name = String(b?.name ?? "").trim().slice(0, 40) || "Gast";
    const body = String(b?.body ?? "").trim().slice(0, 400);
    if (!body) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });

    const message = await addMessage(name, body);
    return NextResponse.json({ ok: true, message });
  } catch (e) {
    console.error("[chat] error", e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
