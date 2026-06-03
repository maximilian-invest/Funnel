"use client";

import { useState } from "react";
import { ArrowRight, Maximize, Play, Volume2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { ImageSlot } from "./ImageSlot";
import { WebinarChat } from "./WebinarChat";
import { WEBINAR } from "@/lib/constants";

export function WebinarRoom() {
  const [overlayHidden, setOverlayHidden] = useState(false);

  return (
    <div className="room-grid">
      {/* LEFT: player + title + offer */}
      <div>
        <Reveal as="div" className="player">
          <div className="player-stage">
            <span className="live-pill">
              <span className="badge-dot live" /> LIVE
            </span>
            <ImageSlot label="Webinar-Standbild / Folie ablegen" />
            {!overlayHidden && (
              <div
                className="player-overlay"
                onClick={() => setOverlayHidden(true)}
                style={{ transition: "opacity .3s ease" }}
              >
                <button className="play-btn" aria-label="Webinar starten">
                  <Play size={34} fill="#111" stroke="#111" style={{ marginLeft: 4 }} />
                </button>
                <span className="ov-txt">Klicken, um das Webinar zu starten</span>
              </div>
            )}
          </div>
          <div className="player-bar">
            <div className="ctrl">
              <button aria-label="Play/Pause">
                <Play size={20} />
              </button>
              <button aria-label="Ton">
                <Volume2 size={20} />
              </button>
            </div>
            <div className="track">
              <div className="fill" />
            </div>
            <span className="tt">20:14 / 58:30</span>
            <div className="ctrl">
              <button aria-label="Vollbild">
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal as="div" className="room-title" delay={0.08}>
          <h1>{WEBINAR.title}</h1>
          <div className="room-host">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="host-img" src="/assets/presenter.jpg" alt="Maximilian Hölzl" />
            <div className="rh-txt">
              <div className="a">{WEBINAR.host}</div>
              <div className="b">{WEBINAR.hostRole}</div>
            </div>
          </div>
        </Reveal>

        <Reveal as="div" className="offer-card" delay={0.16}>
          <span className="badge badge-accent" style={{ marginBottom: 14 }}>
            <span className="badge-dot" /> Nur für Webinar-Teilnehmer
          </span>
          <div className="ttl">Investiere ab jetzt wie ein Profi.</div>
          <a
            href="https://my.allround.immo"
            className="btn btn-primary btn-lg btn-block btn-arrow"
            style={{ marginTop: 4 }}
          >
            Hol dir jetzt ALLROUND.IMMO <ArrowRight size={20} />
          </a>
          <p
            style={{
              fontSize: "12.5px",
              color: "var(--color-muted)",
              textAlign: "center",
              marginTop: 14,
            }}
          >
            Direkt zur Plattform · my.allround.immo
          </p>
        </Reveal>
      </div>

      {/* RIGHT: live chat (backend-mediated, no Supabase key in the browser) */}
      <WebinarChat />
    </div>
  );
}
