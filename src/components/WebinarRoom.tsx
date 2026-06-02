"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Maximize,
  Play,
  Send,
  Users,
  Volume2,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { ImageSlot } from "./ImageSlot";
import { WEBINAR } from "@/lib/constants";

type Msg = {
  initials: string;
  color: string;
  name: string;
  host?: boolean;
  text: string;
};

const SEED: Msg[] = [
  {
    initials: "MH",
    color: "#ef4444",
    name: "Maximilian · Host",
    host: true,
    text: "Willkommen! Schreibt gern in den Chat, aus welcher Stadt ihr investiert. 👋",
  },
  {
    initials: "TK",
    color: "#8b5cf6",
    name: "Thomas K.",
    text: "Wien — halte 6 Einheiten, freue mich auf die Stress-Test-Demo.",
  },
  {
    initials: "SB",
    color: "#34d399",
    name: "Sandra B.",
    text: "Endlich mal jemand, der DSCR verständlich erklärt 🙌",
  },
  {
    initials: "JF",
    color: "#ec4899",
    name: "Jakob F.",
    text: "Kann ich auch Inserate von willhaben importieren?",
  },
  {
    initials: "MH",
    color: "#ef4444",
    name: "Maximilian · Host",
    host: true,
    text: "@Jakob: Ja — Link von jeder Plattform reicht. Zeige ich gleich live.",
  },
  {
    initials: "AL",
    color: "#111",
    name: "Anna L.",
    text: "Der Score auf der Landingpage war beeindruckend.",
  },
];

const REACTIONS = ["👍", "🔥", "👏", "❤️"];

export function WebinarRoom() {
  const [overlayHidden, setOverlayHidden] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [draft, setDraft] = useState("");
  const msgsRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      const m = msgsRef.current;
      if (m) m.scrollTop = m.scrollHeight;
    });
  }

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { initials: "DU", color: "#111", name: "Du", text }]);
    setDraft("");
    scrollToBottom();
  }

  function spawnReaction(glyph: string, x: number, y: number) {
    const node = document.createElement("div");
    node.className = "float-react";
    node.textContent = glyph;
    node.style.left = x - 13 + "px";
    node.style.top = y - 20 + "px";
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 2300);
  }

  return (
    <div className="room-grid">
      {/* LEFT: player + title + offer */}
      <div>
        <Reveal as="div" className="player">
          <div className="player-stage">
            <span className="live-pill">
              <span className="badge-dot live" /> LIVE
            </span>
            <span className="viewers">
              <Users size={14} /> 342 sehen zu
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
            <ImageSlot avatar compact label="Foto" />
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
          <div className="ttl">Bring deine Deal-Prüfung auf Profi-Niveau.</div>
          <p>
            Sichere dir ein persönliches Strategiegespräch und prüfe gemeinsam mit unserem Team,
            wie ALLROUND.IMMO deine Objekt-Analyse beschleunigt — von der ersten Kennzahl bis zum
            bankfähigen Dossier.
          </p>
          <ul className="offer-points">
            <li>
              <Check size={17} /> Live-Analyse eines deiner Objekte mit dem Investment-Score
            </li>
            <li>
              <Check size={17} /> Persönliche Einrichtung &amp; 1-Klick-Import deiner Inserate
            </li>
            <li>
              <Check size={17} /> Bankfähige Dossiers für Finanzierung &amp; Steuerberatung
            </li>
          </ul>
          <div className="offer-price">
            <span className="now">
              <span className="ph">[Preis / Angebot]</span>
            </span>
            <span className="ctx">noch festzulegen — Jahres- oder Einmalzahlung für Investoren</span>
          </div>
          <a href="#" className="btn btn-primary btn-lg btn-block btn-arrow">
            Strategiegespräch sichern <ArrowRight size={20} />
          </a>
          <p
            style={{
              fontSize: "12.5px",
              color: "var(--color-muted)",
              textAlign: "center",
              marginTop: 14,
            }}
          >
            Begrenzte Plätze · unverbindliches Erstgespräch
          </p>
        </Reveal>
      </div>

      {/* RIGHT: live chat */}
      <Reveal as="aside" className="chat" delay={0.08} aria-label="Live-Chat">
        <div className="chat-head">
          <span className="ttl">Live-Chat</span>
          <span className="cnt">
            <span
              className="badge-dot live"
              style={{ background: "#34d399", display: "inline-block" }}
            />{" "}
            342 online
          </span>
        </div>
        <div className="chat-msgs" ref={msgsRef}>
          {messages.map((m, i) => (
            <div className="cmsg" key={i}>
              <span className="av" style={{ background: m.color }}>
                {m.initials}
              </span>
              <div className="cm-body">
                <div className={"nm" + (m.host ? " host" : "")}>{m.name}</div>
                <div className="tx">{m.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="reactions">
          {REACTIONS.map((r) => (
            <button
              key={r}
              aria-label={`Reaktion ${r}`}
              onClick={(e) => spawnReaction(r, e.clientX, e.clientY)}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Nachricht schreiben …"
            aria-label="Nachricht"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />
          <button className="send" aria-label="Senden" onClick={send}>
            <Send size={18} />
          </button>
        </div>
      </Reveal>
    </div>
  );
}
