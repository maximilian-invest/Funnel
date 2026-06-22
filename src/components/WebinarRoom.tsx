"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { WebinarPlayer } from "./WebinarPlayer";
import { WEBINAR } from "@/lib/constants";

export function WebinarRoom() {
  return (
    <div className="room-stage">
      {/* Synchronized "live" video: plays in lock-step with the wall clock. */}
      <WebinarPlayer />

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
  );
}
