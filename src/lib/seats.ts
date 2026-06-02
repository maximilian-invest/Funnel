import { WEBINAR } from "./constants";

// Artificial scarcity: a believable "seats left" out of a fixed capacity that
// decreases deterministically as the webinar approaches. No backend — the value
// is a pure function of time, so it never flickers and only ever counts down.

export const CAPACITY = 50; // max. erwartete Anmeldungen
const FLOOR = 3; // nie weniger als so viele "frei" anzeigen
const CAMPAIGN_DAYS = 21; // Ramp-Fenster vor dem Termin
const TAKEN_START = 12; // schon vergebene Plätze zu Beginn des Fensters

const DAY = 86_400_000;

/** Monotonically-decreasing seats-left (FLOOR … CAPACITY-TAKEN_START). */
export function seatsLeft(now: number = Date.now()): number {
  const event = WEBINAR.date.getTime();
  const start = event - CAMPAIGN_DAYS * DAY;
  const frac = Math.min(1, Math.max(0, (now - start) / (event - start)));
  const eased = Math.pow(frac, 1.25); // Verknappung zum Ende hin beschleunigen
  const takenEnd = CAPACITY - FLOOR;
  const taken = Math.round(TAKEN_START + (takenEnd - TAKEN_START) * eased);
  return Math.max(FLOOR, CAPACITY - taken);
}
