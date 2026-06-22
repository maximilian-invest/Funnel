"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { WEBINAR, ROUTES } from "@/lib/constants";
import { asset } from "@/lib/asset";

const MARK_WHITE = asset("/assets/logo-mark-white.svg");
const WORD_WHITE = asset("/assets/logo-wordmark-white.svg");
const MARK_DARK = asset("/assets/logo-mark.svg");
const WORD_DARK = asset("/assets/logo-wordmark.svg");

type Variant = "landing" | "solid" | "room";

export function Nav({ variant = "landing" }: { variant?: Variant }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (variant !== "landing") return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  if (variant === "room") {
    return (
      <nav
        className="nav"
        style={{
          background: "rgba(16,16,16,.85)",
          WebkitBackdropFilter: "blur(12px)",
          backdropFilter: "blur(12px)",
          borderBottomColor: "rgba(255,255,255,.08)",
        }}
      >
        <div className="container nav-inner">
          <a
            className="brand"
            href="https://www.allround.immo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="allround.immo"
          >
            <span className="logo-light" style={{ opacity: 1, position: "static" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mark" src={MARK_WHITE} alt="Allround.immo" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="word" src={WORD_WHITE} alt="" />
            </span>
          </a>
          <div className="nav-right">
            <a
              className="nav-site"
              href="https://www.allround.immo"
              target="_blank"
              rel="noopener noreferrer"
            >
              allround.immo
            </a>
            <span className="badge badge-dark">
              <span className="badge-dot live" style={{ background: "#ef4444" }} /> In Kürze
            </span>
          </div>
        </div>
      </nav>
    );
  }

  if (variant === "solid") {
    return (
      <nav className="nav solid">
        <div className="container nav-inner">
          <Link className="brand" href={ROUTES.landing} aria-label="Allround.immo">
            <span className="logo-dark" style={{ opacity: 1, position: "static" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mark" src={MARK_DARK} alt="Allround.immo" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="word" src={WORD_DARK} alt="" />
            </span>
          </Link>
          <div className="nav-right">
            <span className="nav-date">
              <Calendar size={15} /> {WEBINAR.shortLabel}
            </span>
            <Link href={ROUTES.webinar} className="btn btn-secondary">
              Zum Webinar-Raum
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // landing — transparent over the dark hero, solidifies on scroll
  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="container nav-inner">
        <a className="brand" href="#top" aria-label="Allround.immo">
          <span className="logo-light">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="mark" src={MARK_WHITE} alt="Allround.immo" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="word" src={WORD_WHITE} alt="" />
          </span>
          <span className="logo-dark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="mark" src={MARK_DARK} alt="Allround.immo" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="word" src={WORD_DARK} alt="" />
          </span>
        </a>
        <div className="nav-links">
          <a href="#lernen">Inhalte</a>
          <a href="#fuerwen">Für wen</a>
          <a href="#host">Speaker</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="nav-right">
          <span className="nav-date">
            <Calendar size={15} /> {WEBINAR.shortLabel}
          </span>
          <a href="#anmelden" className="btn btn-on-dark">
            Platz sichern
          </a>
        </div>
      </div>
    </nav>
  );
}
