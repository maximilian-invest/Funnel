"use client";

import { useEffect, useState } from "react";
import { WEBINAR } from "@/lib/constants";

const TARGET = WEBINAR.date.getTime();

function pad(n: number) {
  return n < 10 ? "0" + n : "" + n;
}

type Parts = { d: string; h: string; m: string; s: string };
const ZERO: Parts = { d: "00", h: "00", m: "00", s: "00" };

function compute(): Parts {
  let s = Math.max(0, Math.floor((TARGET - Date.now()) / 1000));
  const d = Math.floor(s / 86400);
  s -= d * 86400;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  return { d: String(d), h: pad(h), m: pad(m), s: pad(s) };
}

export function Countdown({ variant = "mini" }: { variant?: "mini" | "big" }) {
  // Start from zeros (matches SSR) then hydrate to the live value to avoid mismatch.
  const [t, setT] = useState<Parts>(ZERO);

  useEffect(() => {
    setT(compute());
    const id = setInterval(() => setT(compute()), 1000);
    return () => clearInterval(id);
  }, []);

  if (variant === "big") {
    const units: [string, string][] = [
      [t.d, "Tage"],
      [t.h, "Stunden"],
      [t.m, "Minuten"],
      [t.s, "Sekunden"],
    ];
    return (
      <div className="bigcount">
        {units.map(([n, l]) => (
          <div className="unit" key={l}>
            <div className="n">{n}</div>
            <div className="l">{l}</div>
          </div>
        ))}
      </div>
    );
  }

  const units: [string, string][] = [
    [t.d, "T"],
    [t.h, "Std"],
    [t.m, "Min"],
    [t.s, "Sek"],
  ];
  return (
    <span className="mini-count">
      {units.map(([n, l], i) => (
        <span key={l} style={{ display: "contents" }}>
          {i > 0 && <span className="sep">:</span>}
          <span className="u">
            <span className="n">{n}</span>
            <span className="l">{l}</span>
          </span>
        </span>
      ))}
    </span>
  );
}
