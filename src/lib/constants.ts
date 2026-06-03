// Central facts for the ALLROUND.IMMO webinar funnel.
// The webinar date is a placeholder from the design ([PLATZHALTER-TERMIN]).

export const WEBINAR = {
  /** Mo, 22. Juni 2026, 19:30 — local time. */
  date: new Date(2026, 5, 22, 19, 30, 0),
  shortLabel: "Mo, 22. Juni · 19:30",
  longLabel: "Mo, 22. Juni 2026 · 19:30 Uhr · Live online",
  durationLabel: "~60 Min",
  title:
    "Vom Inserat zur Entscheidung: Cashflow, Rendite & Risiko jedes Objekts auf einen Blick.",
  host: "Maximilian Hölzl",
  hostRole:
    "Konzessionierter Immobilientreuhänder & Marketing-Experte · ALLROUND.IMMO",
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
