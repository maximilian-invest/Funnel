// In-memory presence for the REAL concurrent live-viewer count. Runs on the single
// long-running Railway instance (same assumption as the chat rate-limiter). The
// webinar page sends anonymous heartbeats; "concurrent" = sessions seen within the
// last WINDOW. The real number is emailed ONLY to the admin — it is never returned
// to any client, so viewers can't see it.
const WINDOW_MS = 45_000;
const EMAIL_EVERY_MS = 5 * 60_000;

type Store = { seen: Map<string, number>; peak: number; lastEmail: number };
const g = globalThis as unknown as { __webinarPresence?: Store };
const store: Store = (g.__webinarPresence ??= { seen: new Map(), peak: 0, lastEmail: 0 });

export function touch(id: string): void {
  store.seen.set(id, Date.now());
}

/** Concurrent viewers right now (prunes stale sessions, tracks the running peak). */
export function concurrent(): number {
  const cutoff = Date.now() - WINDOW_MS;
  let n = 0;
  for (const [id, t] of store.seen) {
    if (t < cutoff) store.seen.delete(id);
    else n++;
  }
  if (n > store.peak) store.peak = n;
  return n;
}

export function getPeak(): number {
  return store.peak;
}

/** True at most once per EMAIL_EVERY_MS — claims the slot synchronously (no dupes). */
export function claimEmailSlot(): boolean {
  const now = Date.now();
  if (now - store.lastEmail < EMAIL_EVERY_MS) return false;
  store.lastEmail = now;
  return true;
}
