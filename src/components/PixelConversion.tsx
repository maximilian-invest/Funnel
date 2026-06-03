"use client";

import { useEffect } from "react";
import { fbqTrack } from "@/lib/fbq";

/**
 * Fires a Meta Pixel conversion event once on mount. Used on the confirmation
 * page so the conversion = a completed "Platz sichern" signup.
 */
export function PixelConversion({ event = "Lead" }: { event?: string }) {
  useEffect(() => {
    fbqTrack(event);
  }, [event]);
  return null;
}
