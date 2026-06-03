// Thin, type-safe wrapper around the Meta Pixel global (window.fbq).
type FbqFn = (method: string, event: string) => void;

export function fbqTrack(event: string): void {
  if (typeof window === "undefined") return;
  (window as unknown as { fbq?: FbqFn }).fbq?.("track", event);
}
