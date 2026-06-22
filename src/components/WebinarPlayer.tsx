"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Maximize, Play, Volume2, VolumeX } from "lucide-react";
import { Countdown } from "./Countdown";
import { WEBINAR } from "@/lib/constants";

const START = WEBINAR.date.getTime();
const DURATION = WEBINAR.video.durationSec;
const SRC = WEBINAR.video.url;
const OFFER_URL = "https://my.allround.immo";

type Phase = "pre" | "live" | "ended";

function phaseFor(nowMs: number): Phase {
  const off = (nowMs - START) / 1000;
  if (off < 0) return "pre";
  if (off >= DURATION) return "ended";
  return "live";
}

function clock(totalSec: number): string {
  const t = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const pad = (n: number) => (n < 10 ? "0" + n : String(n));
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function WebinarPlayer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // `now` starts just before START so the first render (server + first client) is
  // deterministically "pre" — no hydration drift; the tick corrects it on mount.
  const [now, setNow] = useState<number>(START - 1);
  const [muted, setMuted] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);
  const [endedEarly, setEndedEarly] = useState(false);

  // Phase is derived from the wall clock — no extra state, no setState-in-effect.
  const phase: Phase = endedEarly ? "ended" : phaseFor(now);

  // wall-clock tick
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, []);

  // drive the <video> while live: seek to the live offset, keep it synced, autoplay muted
  useEffect(() => {
    if (phase !== "live" || !SRC) return;
    const v = videoRef.current;
    if (!v) return;
    let cancelled = false;

    const sync = () => {
      const dur = v.duration && isFinite(v.duration) ? v.duration : DURATION;
      const target = Math.min(Math.max((Date.now() - START) / 1000, 0), dur - 0.3);
      // only correct meaningful drift (buffering / throttled background tab)
      if (Math.abs(v.currentTime - target) > 1.5) v.currentTime = target;
    };
    const begin = () => {
      if (cancelled) return;
      v.muted = true; // muted is required for autoplay without a user gesture
      setMuted(true);
      sync();
      v.play().then(
        () => !cancelled && setNeedsTap(false),
        () => !cancelled && setNeedsTap(true),
      );
    };

    if (v.readyState >= 1) begin();
    else v.addEventListener("loadedmetadata", begin, { once: true });

    const drift = setInterval(() => {
      if (cancelled) return;
      sync();
      if (v.paused) v.play().catch(() => {});
    }, 4000);
    const onVis = () => {
      if (!document.hidden && !cancelled) {
        sync();
        if (v.paused) v.play().catch(() => {});
      }
    };
    const onEnded = () => setEndedEarly(true);
    document.addEventListener("visibilitychange", onVis);
    v.addEventListener("ended", onEnded);

    return () => {
      cancelled = true;
      clearInterval(drift);
      document.removeEventListener("visibilitychange", onVis);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("loadedmetadata", begin);
    };
  }, [phase]);

  // stop playback once the room has ended
  useEffect(() => {
    if (phase === "ended") videoRef.current?.pause();
  }, [phase]);

  function enableSound() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    setMuted(false);
    setNeedsTap(false);
    v.play().catch(() => setNeedsTap(true));
  }
  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    if (!next) {
      v.volume = 1;
      v.play().catch(() => {});
    }
    setMuted(next);
  }
  function toggleFullscreen() {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  }

  const offset = Math.min(Math.max((now - START) / 1000, 0), DURATION);
  const pct = phase === "ended" ? 100 : phase === "live" ? (offset / DURATION) * 100 : 0;

  return (
    <div className="player" ref={wrapRef}>
      <div className="player-stage">
        {SRC ? (
          <video
            ref={videoRef}
            className="player-video"
            src={SRC}
            playsInline
            muted={muted}
            preload="auto"
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
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

        {phase === "pre" && (
          <div className="player-overlay waiting">
            <div className="ov-eyebrow">Das Webinar startet in</div>
            <Countdown variant="big" />
            <div className="ov-txt">{WEBINAR.longLabel}</div>
          </div>
        )}

        {phase === "live" && SRC && (muted || needsTap) && (
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

        {phase === "ended" && (
          <div className="player-overlay ended">
            <div className="ended-ttl">Das Webinar ist beendet.</div>
            <div className="ov-txt">
              Danke fürs Dabeisein! Sichere dir jetzt den Zugang zur Plattform.
            </div>
            <a href={OFFER_URL} className="btn btn-primary btn-lg btn-arrow" style={{ marginTop: 6 }}>
              Hol dir jetzt ALLROUND.IMMO <ArrowRight size={20} />
            </a>
          </div>
        )}
      </div>

      <div className="player-bar">
        <div className="ctrl">
          <button
            type="button"
            aria-label={muted ? "Ton einschalten" : "Stummschalten"}
            onClick={toggleMute}
            disabled={phase !== "live"}
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
        <div className="track">
          <div className="fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="tt">
          {phase === "live"
            ? clock(offset)
            : phase === "ended"
              ? "Beendet"
              : "Startet bald"}
        </span>
        <div className="ctrl">
          <button type="button" aria-label="Vollbild" onClick={toggleFullscreen}>
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
