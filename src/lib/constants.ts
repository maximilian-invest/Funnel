// Central facts for the ALLROUND.IMMO webinar funnel.
// The webinar date is a placeholder from the design ([PLATZHALTER-TERMIN]).

export const WEBINAR = {
  /**
   * Live-Start: Mo, 22. Juni 2026, 19:30 Europe/Vienna (CEST = UTC+2).
   * Absolute instant (≙ 17:30 UTC) — identical for every viewer, regardless of
   * their local timezone.
   */
  date: new Date("2026-06-22T19:30:00+02:00"),
  shortLabel: "Mo, 22. Juni · 19:30",
  longLabel: "Mo, 22. Juni 2026 · 19:30 Uhr",
  durationLabel: "~60 Min",
  title:
    "Vom Inserat zur Entscheidung: Cashflow, Rendite & Risiko jedes Objekts auf einen Blick.",
  host: "Maximilian Hölzl",
  hostRole:
    "Konzessionierter Immobilientreuhänder & Marketing-Experte · ALLROUND.IMMO",
  /**
   * Pre-recorded "live" video. Plays wall-clock-synchronized to `date`: late
   * joiners start at the correct position, seeking is disabled, and after
   * `durationSec` the room switches to the end screen.
   */
  video: {
    /**
     * Direct MP4/HLS URL. The env override (Railway / .env) wins; otherwise the
     * committed fallback below is used, so the URL is guaranteed in the build.
     * Paste the final URL between the quotes once the recording is uploaded.
     */
    url:
      process.env.NEXT_PUBLIC_WEBINAR_VIDEO_URL ??
      "https://api.allround.immo/storage/v1/object/public/webinar/0622.mp4?v=2",
    /** Length of the recording in seconds (≈40 min). */
    durationSec: 40 * 60,
  },
  /**
   * Fake "viewers" badge. Set `peak` a bit BELOW your expected turnout so it stays
   * believable. The count ramps up at the start, holds near the peak, and drifts
   * down toward the end — easing ±1 so it never visibly jumps.
   */
  viewers: { peak: 42, startLevel: 0.5, endLevel: 0.78 },
} as const;

export const ROUTES = {
  landing: "/",
  confirm: "/bestaetigung",
  webinar: "/webinar",
} as const;

/** Storage keys shared between the signup form and the confirmation page. */
export const STORAGE = {
  firstName: "ai_vorname",
  email: "ai_email",
} as const;
