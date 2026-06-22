"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2 } from "lucide-react";
import { Countdown } from "./Countdown";
import { Viewers } from "./Viewers";
import { WEBINAR } from "@/lib/constants";

const START = WEBINAR.date.getTime();
const SRC = WEBINAR.video.url;

type Phase = "pre" | "playing";

function phaseFor(nowMs: number): Phase {
  return nowMs < START ? "pre" : "playing";
}

export function WebinarPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // `now` starts just before START so the first render (server + first client) is
  // deterministically "pre" — no hydration drift; the tick corrects it on mount.
  const [now, setNow] = useState<number>(START - 1);
  const [soundPrompt, setSoundPrompt] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);

  const phase: Phase = phaseFor(now);

  // wall-clock tick until the room opens (no need to keep ticking afterwards)
  useEffect(() => {
    if (phase === "playing") return;
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [phase]);

  // When the room opens, autoplay from the start (muted — browser autoplay policy).
  // Viewers then fully control playback via the native controls: play/pause,
  // rewind/seek, volume, fullscreen. We do NOT force a live position, so playback
  // buffers smoothly and customers can scrub freely.
  useEffect(() => {
    if (phase !== "playing" || !SRC) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; // required for autoplay without a user gesture
    v.play().then(
      () => setNeedsTap(false),
      () => setNeedsTap(true),
    );
  }, [phase]);

  function enableSound() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    setSoundPrompt(false);
    setNeedsTap(false);
    v.play().catch(() => setNeedsTap(true));
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
            preload="auto"
            controlsList="nodownload"
            aria-label={WEBINAR.title}
          >
            Ihr Browser unterstützt das Video-Element nicht.
          </video>
        ) : (
          <div className="player-notice">
            ⚠ Kein Video hinterlegt — setze <code>NEXT_PUBLIC_WEBINAR_VIDEO_URL</code> oder{" "}
            <code>WEBINAR.video.url</code> in <code>src/lib/constants.ts</code>.
          </div>
        )}

        {phase === "playing" && SRC && <Viewers />}

        {phase === "pre" && (
          <div className="player-overlay waiting">
            <div className="ov-eyebrow">Das Webinar startet in</div>
            <Countdown variant="big" />
            <div className="ov-txt">{WEBINAR.longLabel}</div>
          </div>
        )}

        {phase === "playing" && SRC && (soundPrompt || needsTap) && (
          <button
            type="button"
            className="player-overlay tap"
            onClick={enableSound}
            aria-label={needsTap ? "Webinar starten" : "Ton einschalten"}
          >
            <span className="play-btn">
              {needsTap ? (
                <Play size={34} fill="#111" stroke="#111" style={{ marginLeft: 4 }} />
              ) : (
                <Volume2 size={34} />
              )}
            </span>
            <span className="ov-txt">
              {needsTap
                ? "Klicken, um das Webinar zu starten"
                : "Klicken, um den Ton einzuschalten"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
