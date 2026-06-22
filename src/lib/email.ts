import nodemailer from "nodemailer";
import { WEBINAR } from "./constants";

// Credentials come from environment variables (set them on Railway → Variables).
// They are never hard-coded here.
function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 8_000,
    socketTimeout: 15_000,
  });
}

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function pad(n: number) {
  return n < 10 ? "0" + n : "" + n;
}
function countdown(now = Date.now()) {
  let s = Math.max(0, Math.floor((WEBINAR.date.getTime() - now) / 1000));
  const d = Math.floor(s / 86400);
  s -= d * 86400;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  return { d, h, m };
}

/** Premium dark confirmation email for the registrant. */
export function customerEmail(name: string, siteUrl: string) {
  const safe = esc(name) || "Investor";
  const { d, h, m } = countdown();
  const link = `${siteUrl.replace(/\/$/, "")}/webinar`;
  const box = (n: number, label: string) =>
    `<td align="center" style="background:#1f1f1f;border:1px solid #2c2c2c;border-radius:10px;padding:14px 0;">
       <div style="font-family:Arial,Helvetica,sans-serif;font-size:30px;font-weight:800;color:#ffffff;line-height:1;">${pad(n)}</div>
       <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#a1a1aa;letter-spacing:1.5px;text-transform:uppercase;margin-top:7px;">${label}</div>
     </td>`;
  const gap = `<td style="width:10px;"></td>`;

  const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"></head>
<body style="margin:0;padding:0;background:#0b0b0b;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0b;padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#151515;border:1px solid #2a2a2a;border-radius:16px;">
  <tr><td style="padding:34px 36px 0;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:800;letter-spacing:.4px;color:#ffffff;">ALLROUND<span style="color:#ef4444;">.IMMO</span></td></tr>
  <tr><td style="padding:24px 36px 0;">
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:1.6px;color:#ef4444;text-transform:uppercase;">Anmeldung bestätigt</div>
    <h1 style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:29px;line-height:1.2;color:#ffffff;font-weight:800;">Du bist dabei, ${safe}.</h1>
    <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#a1a1aa;">Dein Platz für das kostenlose Webinar ist reserviert. Über den Button unten kommst du direkt in den Webinar-Raum — leg dir den Termin am besten gleich in den Kalender.</p>
  </td></tr>
  <tr><td style="padding:22px 36px 0;">
    <div style="font-family:Arial,Helvetica,sans-serif;background:#1f1f1f;border:1px solid #2c2c2c;border-radius:10px;padding:13px 16px;font-size:14px;color:#ffffff;font-weight:700;">📅&nbsp; Mo, 22. Juni 2026 · 19:30 Uhr</div>
  </td></tr>
  <tr><td style="padding:16px 36px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${box(d, "Tage")}${gap}${box(h, "Stunden")}${gap}${box(m, "Minuten")}</tr></table>
  </td></tr>
  <tr><td style="padding:26px 36px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" bgcolor="#ef4444" style="border-radius:10px;">
      <a href="${link}" style="display:block;padding:16px 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:800;color:#ffffff;text-decoration:none;">Zum Webinar-Raum &rarr;</a>
    </td></tr></table>
  </td></tr>
  <tr><td style="padding:14px 36px 0;font-family:Arial,Helvetica,sans-serif;font-size:12.5px;line-height:1.6;color:#71717a;">Funktioniert der Button nicht? Öffne diesen Link:<br><a href="${link}" style="color:#ef4444;text-decoration:none;">${link}</a></td></tr>
  <tr><td style="padding:28px 36px 34px;">
    <div style="border-top:1px solid #2a2a2a;padding-top:18px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#52525b;">© 2026 ALLROUND.IMMO · Investiere wie ein Profi.</div>
  </td></tr>
</table></td></tr></table></body></html>`;

  const text = `Du bist dabei, ${name || "Investor"}.

Dein Platz für das kostenlose Webinar ist reserviert.
Mo, 22. Juni 2026 · 19:30 Uhr

Zum Webinar-Raum: ${link}

© ALLROUND.IMMO`;

  return { subject: "Du bist dabei — dein Webinar-Zugang ✅", html, text };
}

type Registrant = { name: string; email: string; created_at?: string };

/** Team notification with the full registrant list, newest first. */
export function teamEmail(registrants: Registrant[]) {
  const list = registrants.length ? registrants : [];
  const newest = list[0];
  const total = list.length;
  const fmtWhen = (s?: string) => (s ? new Date(s).toLocaleString("de-AT") : "");

  const rows = list
    .map((r, i) => {
      const hl = i === 0 ? "background:#fff5f5;" : "";
      const neu =
        i === 0
          ? ' <span style="color:#ef4444;font-size:10px;font-weight:700;">NEU</span>'
          : "";
      return `<tr style="border-top:1px solid #eee;${hl}">
        <td style="padding:9px 12px;color:#9ca3af;">${i + 1}</td>
        <td style="padding:9px 12px;color:#111;font-weight:${i === 0 ? 700 : 600};">${esc(r.name)}${neu}</td>
        <td style="padding:9px 12px;"><a href="mailto:${esc(r.email)}" style="color:#111;text-decoration:none;">${esc(r.email)}</a></td>
        <td style="padding:9px 12px;color:#6b7280;white-space:nowrap;">${esc(fmtWhen(r.created_at))}</td>
      </tr>`;
    })
    .join("");

  const html = `<!doctype html><html><body style="margin:0;background:#f5f5f5;padding:24px;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
 <tr><td style="padding:22px 26px 0;">
   <div style="font-size:13px;font-weight:700;letter-spacing:1px;color:#ef4444;text-transform:uppercase;">Neue Webinar-Anmeldung</div>
   <div style="font-size:20px;font-weight:800;color:#111;margin-top:8px;">${esc(newest?.name ?? "")}</div>
   <div style="font-size:14px;color:#374151;margin-top:2px;">${esc(newest?.email ?? "")}</div>
   <div style="font-size:13px;color:#6b7280;margin-top:14px;">Gesamt: <b>${total}</b> Anmeldung${total === 1 ? "" : "en"} · neueste oben</div>
 </td></tr>
 <tr><td style="padding:14px 26px 26px;">
   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;border-collapse:collapse;font-size:14px;">
     <tr style="background:#fafafa;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.04em;">
       <td style="padding:9px 12px;">#</td><td style="padding:9px 12px;">Name</td><td style="padding:9px 12px;">E-Mail</td><td style="padding:9px 12px;">Wann</td>
     </tr>
     ${rows}
   </table>
 </td></tr>
</table></td></tr></table></body></html>`;

  const text =
    `${total} Anmeldung${total === 1 ? "" : "en"} (neueste oben):\n\n` +
    list.map((r, i) => `${i + 1}. ${r.name} — ${r.email}`).join("\n");

  return { subject: `Neue Anmeldung: ${newest?.name ?? ""} · ${total} gesamt`, html, text };
}

async function sendViaResend(p: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: p.from,
      to: [p.to],
      subject: p.subject,
      html: p.html,
      text: p.text,
      ...(p.replyTo ? { reply_to: p.replyTo } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
  }
}

export async function sendRegistrationEmails(
  name: string,
  email: string,
  siteUrl: string,
  registrants: Registrant[] = [{ name, email }],
): Promise<void> {
  const from =
    process.env.MAIL_FROM || `ALLROUND.IMMO <${process.env.SMTP_USER || "onboarding@resend.dev"}>`;
  const teamTo = process.env.MAIL_TO || process.env.SMTP_USER || email;
  const cust = customerEmail(name, siteUrl);
  const team = teamEmail(registrants);

  // Preferred: Resend over HTTPS (works on Railway, where SMTP egress is blocked).
  if (process.env.RESEND_API_KEY) {
    await Promise.all([
      sendViaResend({ from, to: email, subject: cust.subject, html: cust.html, text: cust.text }),
      sendViaResend({ from, to: teamTo, replyTo: email, subject: team.subject, html: team.html, text: team.text }),
    ]);
    return;
  }

  // Fallback: SMTP.
  const t = getTransport();
  if (!t) {
    console.warn("[email] No provider configured (set RESEND_API_KEY or SMTP_* env vars).");
    return;
  }
  await Promise.all([
    t.sendMail({ from, to: email, subject: cust.subject, html: cust.html, text: cust.text }),
    t.sendMail({ from, to: teamTo, replyTo: email, subject: team.subject, html: team.html, text: team.text }),
  ]);
}

/** Admin-only: emails the REAL concurrent live-viewer count. Never shown to viewers. */
export async function sendViewerCountEmail(current: number, peak: number): Promise<void> {
  const to = process.env.VIEWER_REPORT_TO || process.env.MAIL_TO || process.env.SMTP_USER;
  if (!to) return;
  const from =
    process.env.MAIL_FROM || `ALLROUND.IMMO <${process.env.SMTP_USER || "onboarding@resend.dev"}>`;
  const when = new Date().toLocaleString("de-AT", { timeZone: "Europe/Vienna" });
  const subject = `🔴 Live-Zuseher: ${current} (Peak ${peak})`;
  const text = `Aktuell sehen ${current} Personen live zu.\nHöchststand bisher: ${peak}.\nStand: ${when}`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#111">
    <p style="font-size:16px;margin:0 0 6px">Aktuell sehen <b style="font-size:22px">${current}</b> Personen live zu.</p>
    <p style="margin:0 0 6px;color:#374151">Höchststand bisher: <b>${peak}</b></p>
    <p style="margin:0;color:#9ca3af;font-size:12px">Stand: ${when}</p></div>`;
  if (process.env.RESEND_API_KEY) {
    await sendViaResend({ from, to, subject, html, text });
    return;
  }
  const t = getTransport();
  if (!t) return;
  await t.sendMail({ from, to, subject, html, text });
}

/** Connection + auth check (no mail sent) — for diagnostics only. */
export async function verifySmtp(): Promise<{ ok: boolean; error?: string }> {
  const t = getTransport();
  if (!t) return { ok: false, error: "SMTP not configured" };
  try {
    await t.verify();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** Checks the Resend API key and lists the domains + their verification status. */
export async function verifyResend(): Promise<{ ok: boolean; domains?: string[]; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: `Resend ${res.status}: ${JSON.stringify(body).slice(0, 200)}` };
    }
    const domains = (body?.data ?? []).map(
      (d: { name: string; status: string }) => `${d.name} (${d.status})`,
    );
    return { ok: true, domains };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
