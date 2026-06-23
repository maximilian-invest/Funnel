"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Countdown } from "./Countdown";
import { Viewers } from "./Viewers";
import { RecordingPlayer } from "./RecordingPlayer";
import { WEBINAR } from "@/lib/constants";

const START = WEBINAR.date.getTime();
const SRC = WEBINAR.video.url;

type Phase = "pre" | "playing";

function phaseFor(nowMs: number): Phase {
  return nowMs < START ? "pre" : "playing";
}

function clock(total: number): string {
  const t = Math.max(0, Math.floor(total || 0));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const pad = (n: number) => (n < 10 ? "0" + n : String(n));
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function WebinarPlayer() {
  return WEBINAR.recording ? <RecordingPlayer /> : <LivePlayer />;
}

function LivePlayer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // `now` starts just before START so the first render is deterministically "pre".
  const [now, setNow] = useState<number>(START - 1);
  const [soundPrompt, setSoundPrompt] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [cur, setCur] = useState(0); // viewer's playback position (s)
  const [dur, setDur] = useState(0); // full recording length (s)
  const [edge, setEdge] = useState(0); // live edge = elapsed since START (s)

  const phase: Phase = phaseFor(now);

  // tick until the room opens
  useEffect(() => {
    if (phase === "playing") return;
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [phase]);

  // live playback: start at the live edge, allow rewind, cap forward seeks at live,
  // and keep the custom seek bar (position + live edge) updated.
  useEffect(() => {
    if (phase !== "playing" || !SRC) return;
    const v = videoRef.current;
    if (!v) return;
    let cancelled = false;
    let loopId: ReturnType<typeof setTimeout>;

    const liveEdge = () => {
      const d = v.duration && isFinite(v.duration) ? v.duration : Infinity;
      return Math.max(0, Math.min((Date.now() - START) / 1000, d));
    };
    const capForward = () => {
      const e = liveEdge();
      if (v.currentTime > e + 1.2) v.currentTime = Math.max(0, e - 0.3);
    };
    const begin = () => {
      if (cancelled) return;
      v.muted = true; // required for autoplay without a user gesture
      setMuted(true);
      const e = liveEdge();
      if (e > 1.5 && v.currentTime < e - 2) v.currentTime = e - 0.3; // late joiners → live
      v.play().then(
        () => !cancelled && setNeedsTap(false),
        () => !cancelled && setNeedsTap(true),
      );
    };

    if (v.readyState >= 1) begin();
    else v.addEventListener("loadedmetadata", begin, { once: true });

    const onMeta = () => setDur(v.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVol = () => setMuted(v.muted);
    if (v.duration) setDur(v.duration);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("volumechange", onVol);
    v.addEventListener("seeking", capForward);

    const loop = () => {
      if (cancelled) return;
      capForward();
      setCur(v.currentTime);
      setEdge(liveEdge());
      loopId = setTimeout(loop, 250);
    };
    loop();

    return () => {
      cancelled = true;
      clearTimeout(loopId);
      v.removeEventListener("loadedmetadata", begin);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("volumechange", onVol);
      v.removeEventListener("seeking", capForward);
    };
  }, [phase]);

  // Heartbeat for the REAL live-viewer count → admin-only email. The client never
  // receives the number; viewers only ever see the decorative badge.
  useEffect(() => {
    if (phase !== "playing" || !SRC) return;
    let id = "";
    try {
      id = sessionStorage.getItem("ai_pid") || "";
      if (!id) {
        id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem("ai_pid", id);
      }
    } catch {
      id = Math.random().toString(36).slice(2);
    }
    const ping = () =>
      fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        keepalive: true,
      }).catch(() => {});
    ping();
    const iv = setInterval(ping, 20_000);
    return () => clearInterval(iv);
  }, [phase]);

  function seekToClientX(clientX: number) {
    const v = videoRef.current;
    const bar = barRef.current;
    if (!v || !bar) return;
    const d = v.duration && isFinite(v.duration) ? v.duration : 0;
    if (!d) return;
    const r = bar.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const live = Math.max(0, Math.min((Date.now() - START) / 1000, d));
    v.currentTime = Math.min(frac * d, live); // rewind freely, never past the live edge
    setCur(v.currentTime);
  }
  function onBarPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    seekToClientX(e.clientX);
    const move = (ev: PointerEvent) => seekToClientX(ev.clientX);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }
  function onBarKeyDown(e: React.KeyboardEvent) {
    const v = videoRef.current;
    if (!v) return;
    if (e.key === "ArrowLeft") {
      v.currentTime = Math.max(0, v.currentTime - 10);
      setCur(v.currentTime);
    } else if (e.key === "ArrowRight") {
      const live = Math.max(0, Math.min((Date.now() - START) / 1000, v.duration || 0));
      v.currentTime = Math.min(v.currentTime + 10, live);
      setCur(v.currentTime);
    }
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }
  function enableSound() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    setMuted(false);
    setSoundPrompt(false);
    setNeedsTap(false);
    v.play().catch(() => setNeedsTap(true));
  }
  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.volume = 1;
    setMuted(v.muted);
  }
  function toggleFullscreen() {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  }

  const pctCur = dur ? Math.min(100, (cur / dur) * 100) : 0;
  const pctEdge = dur ? Math.min(100, (edge / dur) * 100) : 0;

  return (
    <div className="player" ref={wrapRef}>
      <div className="player-stage">
        {SRC ? (
          <video
            ref={videoRef}
            className="player-video"
            src={SRC}
            playsInline
            preload="auto"
            onClick={togglePlay}
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

      {phase === "playing" && SRC && (
        <div className="player-bar">
          <div className="ctrl">
            <button type="button" aria-label={isPlaying ? "Pause" : "Abspielen"} onClick={togglePlay}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
          <div
            className="seekbar"
            ref={barRef}
            onPointerDown={onBarPointerDown}
            onKeyDown={onBarKeyDown}
            role="slider"
            tabIndex={0}
            aria-label="Zeitleiste — Zurückspulen möglich, nicht über den Live-Punkt hinaus"
            aria-valuemin={0}
            aria-valuemax={Math.round(dur)}
            aria-valuenow={Math.round(cur)}
          >
            <div className="rail" />
            {/* background: how far the live video has progressed (its leading edge = live) */}
            <div className="aired" style={{ width: `${pctEdge}%` }} />
            {/* foreground: the viewer's own position */}
            <div className="played" style={{ width: `${pctCur}%` }} />
            <div className="live-dot" style={{ left: `${pctEdge}%` }} title="Live" />
            <div className="thumb" style={{ left: `${pctCur}%` }} />
          </div>
          <span className="tt">{clock(cur)}</span>
          <div className="ctrl">
            <button type="button" aria-label={muted ? "Ton einschalten" : "Stummschalten"} onClick={toggleMute}>
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button type="button" aria-label="Vollbild" onClick={toggleFullscreen}>
              <Maximize size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
