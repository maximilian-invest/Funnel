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

  // When the room opens, play "live": position = time elapsed since START. Late
  // joiners jump to the live edge so they're in sync; on-time viewers just start
  // at 0 and stay live as they watch. Viewers may REWIND freely, but cannot seek
  // PAST the live edge (the future hasn't aired) — forward jumps snap back. We do
  // NOT continuously re-seek during playback (that thrashes the buffer); we only
  // cap forward seeks.
  useEffect(() => {
    if (phase !== "playing" || !SRC) return;
    const v = videoRef.current;
    if (!v) return;
    let cancelled = false;

    const liveEdge = () => {
      const dur = v.duration && isFinite(v.duration) ? v.duration : Infinity;
      return Math.max(0, Math.min((Date.now() - START) / 1000, dur));
    };
    // rewind = allowed; jumping ahead of "now" gets snapped back to the live edge
    const capForward = () => {
      const edge = liveEdge();
      if (v.currentTime > edge + 1.2) v.currentTime = Math.max(0, edge - 0.3);
    };
    const begin = () => {
      if (cancelled) return;
      v.muted = true; // required for autoplay without a user gesture
      const edge = liveEdge();
      // jump to live only for late joiners; on-time viewers start at 0
      if (edge > 1.5 && v.currentTime < edge - 2) v.currentTime = edge - 0.3;
      v.play().then(
        () => !cancelled && setNeedsTap(false),
        () => !cancelled && setNeedsTap(true),
      );
    };

    if (v.readyState >= 1) begin();
    else v.addEventListener("loadedmetadata", begin, { once: true });

    v.addEventListener("seeking", capForward);
    v.addEventListener("timeupdate", capForward);
    return () => {
      cancelled = true;
      v.removeEventListener("seeking", capForward);
      v.removeEventListener("timeupdate", capForward);
      v.removeEventListener("loadedmetadata", begin);
    };
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
            controlsList="nodownload noplaybackrate"
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
