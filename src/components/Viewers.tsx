"use client";

import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import { WEBINAR } from "@/lib/constants";

const START = WEBINAR.date.getTime();
const DUR = WEBINAR.video.durationSec;
const { peak: PEAK, startLevel: START_LEVEL, endLevel: END_LEVEL } = WEBINAR.viewers;

function smoothstep(x: number) {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

// Smooth, deterministic "concurrent viewers" for a given elapsed time (seconds):
// ramp up → hold near the peak → gentle decline toward the end, plus a small
// organic wobble. This is the *target*; the component eases toward it ±1 so the
// number never visibly jumps.
function targetAt(elapsedSec: number): number {
  const f = elapsedSec / DUR;
  let level: number;
  if (f <= 0) level = START_LEVEL;
  else if (f < 0.15) level = START_LEVEL + (1 - START_LEVEL) * smoothstep(f / 0.15);
  else if (f < 0.65) level = 1;
  else if (f <= 1) level = 1 - (1 - END_LEVEL) * smoothstep((f - 0.65) / 0.35);
  else level = END_LEVEL * Math.max(0.55, 1 - (f - 1) * 0.4);
  const wobble =
    Math.sin(elapsedSec / 51) * 2.1 +
    Math.sin(elapsedSec / 113) * 1.6 +
    Math.sin(elapsedSec / 211) * 1.2;
  return Math.max(5, Math.round(PEAK * level + wobble));
}

export function Viewers() {
  const [count, setCount] = useState<number | null>(null);
  const cur = useRef(0);

  useEffect(() => {
    // Start at the time-appropriate value so late joiners don't see a fake ramp.
    cur.current = targetAt((Date.now() - START) / 1000);
    setCount(cur.current);

    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const target = targetAt((Date.now() - START) / 1000);
      const diff = target - cur.current;
      if (diff !== 0) {
        const mag = Math.abs(diff) > 5 ? 2 : 1; // tiny catch-up, still no visible jump
        cur.current += Math.sign(diff) * Math.min(mag, Math.abs(diff));
        setCount(cur.current);
      }
      // irregular cadence (4–9 s) → feels human, sometimes holds steady
      timer = setTimeout(tick, 4000 + Math.random() * 5000);
    };
    timer = setTimeout(tick, 4000 + Math.random() * 5000);
    return () => clearTimeout(timer);
  }, []);

  if (count == null) return null;
  return (
    <span className="viewers" aria-hidden="true">
      <span className="badge-dot live" style={{ background: "#34d399" }} />
      <Eye size={14} /> {count} sehen zu
    </span>
  );
}
