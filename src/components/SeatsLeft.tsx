"use client";

import { useEffect, useState } from "react";
import { CAPACITY, seatsLeft } from "@/lib/seats";

/**
 * "Nur noch XX von 50 Plätzen frei" — computed client-side (after mount) so the
 * statically-exported HTML and the first client render match (no hydration
 * mismatch); a neutral fallback shows until then.
 */
export function SeatsLeft({ variant = "pill" }: { variant?: "pill" | "meter" }) {
  const [seats, setSeats] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setSeats(seatsLeft());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (variant === "meter") {
    const pct = seats == null ? 0 : Math.round(((CAPACITY - seats) / CAPACITY) * 100);
    return (
      <div className="seats-meter">
        <div className="seats-meter-row">
          <span className="seats-dot" />
          <span className="seats-lead">
            {seats == null ? (
              <>Begrenzte Teilnehmerzahl — max. {CAPACITY} Plätze</>
            ) : (
              <>
                Nur noch <b>{seats}</b> von {CAPACITY} Plätzen frei
              </>
            )}
          </span>
        </div>
        <div className="seats-track" aria-hidden="true">
          <div className="seats-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  return (
    <span className="seats-pill">
      <span className="seats-dot" />
      {seats == null ? (
        <>Begrenzte Plätze · max. {CAPACITY}</>
      ) : (
        <>
          Nur noch <b>{seats}</b> von {CAPACITY} Plätzen frei
        </>
      )}
    </span>
  );
}
