"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { WEBINAR } from "@/lib/constants";

const SRC = WEBINAR.video.url;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const KEY = "ai_recording_unlocked";

// Post-webinar mode: the recording sits behind a soft e-mail gate. On submit we
// notify the team and unlock the video (normal controls, free seeking).
export function RecordingPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [bad, setBad] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "1") setUnlocked(true);
    } catch {
      /* ignore */
    }
  }, []);

  // returning (already-unlocked) visitors: best-effort start; autoplay may be
  // blocked without a gesture, in which case the native controls take over.
  useEffect(() => {
    if (unlocked) videoRef.current?.play().catch(() => {});
  }, [unlocked]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mail = email.trim();
    if (!EMAIL_RE.test(mail)) {
      setBad(true);
      return;
    }
    setSubmitting(true);
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    // notify the team (non-blocking) — don't make the viewer wait on it
    void fetch("/api/recording", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: mail }),
    }).catch(() => {});
    setUnlocked(true);
    // play within the click gesture so sound is allowed
    videoRef.current?.play().catch(() => {});
  }

  return (
    <div className="player">
      <div className="player-stage">
        {SRC ? (
          <video
            ref={videoRef}
            className="player-video"
            src={SRC}
            controls
            playsInline
            preload={unlocked ? "auto" : "none"}
            controlsList="nodownload"
            aria-label={WEBINAR.title}
          >
            Ihr Browser unterstützt das Video-Element nicht.
          </video>
        ) : (
          <div className="player-notice">⚠ Kein Video hinterlegt.</div>
        )}

        {!unlocked && (
          <div className="player-overlay gate">
            <div className="ov-eyebrow">Webinar-Aufzeichnung</div>
            <div className="gate-ttl">Aufzeichnung ansehen</div>
            <p className="ov-txt">
              Gib deine E-Mail-Adresse ein, um die Aufzeichnung des Webinars zu starten.
            </p>
            <form className="gate-form" onSubmit={onSubmit} noValidate>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="deine@email.de"
                aria-label="E-Mail-Adresse"
                className={"gate-input" + (bad ? " invalid" : "")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (bad) setBad(false);
                }}
              />
              <button type="submit" className="btn btn-primary btn-arrow" disabled={submitting}>
                {submitting ? (
                  "Wird geladen …"
                ) : (
                  <>
                    Aufzeichnung ansehen <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
            <p className="gate-fine">
              Mit dem Absenden stimmst du zu, dass wir dich per E-Mail kontaktieren dürfen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
