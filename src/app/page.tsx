import { ArrowRight, CalendarClock, Check, Minus, PlayCircle, Radio } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Stars } from "@/components/Stars";
import { ScoreCard } from "@/components/ScoreCard";
import { Countdown } from "@/components/Countdown";
import { SignupForm } from "@/components/SignupForm";
import { Faq } from "@/components/Faq";
import { SeatsLeft } from "@/components/SeatsLeft";
import { WEBINAR } from "@/lib/constants";
import { asset } from "@/lib/asset";

const MARK_WHITE = asset("/assets/logo-mark-white.svg");

export default function LandingPage() {
  return (
    <>
      <Nav variant="landing" />

      {/* ===== HERO ===== */}
      <header className="hero" id="top">
        <div className="container">
          <div className="hero-grid">
            <div>
              <Reveal as="p" className="eyebrow eyebrow-dark">
                Kostenloses Webinar · begrenzte Plätze
              </Reveal>
              <Reveal as="h1" delay={0.08}>
                Bewerte jeden Deal in Minuten — wie ein Profi.
              </Reveal>
              <Reveal as="p" className="sub" delay={0.16}>
                Für Investoren und Bestandshalter: Wie du mit dem KI-System von ALLROUND.IMMO
                Cashflow, Rendite und Risiko jedes Objekts sofort sichtbar machst — und in einer
                Demo ein reales Inserat in Minuten durchrechnest.
              </Reveal>

              <Reveal as="div" className="hero-date" delay={0.16}>
                <span className="dt">
                  <CalendarClock size={16} /> Mo, 22. Juni · 19:30 Uhr
                </span>
                <Countdown variant="mini" />
              </Reveal>

              <Reveal as="div" className="hero-cta" delay={0.24} style={{ marginTop: 30 }}>
                <a href="#anmelden" className="btn btn-on-dark btn-lg btn-arrow">
                  Kostenlosen Platz sichern <ArrowRight size={20} />
                </a>
                <a href="#lernen" className="btn btn-ghost-dark btn-lg">
                  <PlayCircle size={20} /> Was dich erwartet
                </a>
              </Reveal>

              <Reveal as="div" className="hero-seats" delay={0.24}>
                <SeatsLeft variant="pill" />
              </Reveal>

              <Reveal as="div" className="hero-meta" delay={0.32}>
                <Stars label="4,9 von 5" />
                <span className="trust-txt">
                  <b>Vertraut von Investoren</b> im gesamten DACH-Raum
                </span>
              </Reveal>
            </div>

            <ScoreCard />
          </div>
        </div>
      </header>

      {/* ===== WAS DU LERNST ===== */}
      <section className="section" id="lernen">
        <div className="container">
          <Reveal as="div" className="section-head">
            <p className="eyebrow">Was du im Webinar lernst</p>
            <h2>In 60 Minuten von „Bauchgefühl“ zu klaren Zahlen.</h2>
            <p className="lede">
              Kein Theorie-Vortrag. Du lernst exakt den Prozess, mit dem Profis jeden Deal
              bewerten — und siehst ihn an einem echten Objekt.
            </p>
          </Reveal>
          <div className="curric-grid">
            <Reveal as="div" className="curric-card" delay={0.08}>
              <span className="num">01</span>
              <div>
                <h3>
                  Die 3 Kennzahlen, an denen Profis in Sekunden erkennen, ob sich ein Objekt
                  rechnet
                </h3>
                <p>
                  Cash-on-Cash, DSCR und IRR — richtig gelesen statt überflogen. Was sie wirklich
                  aussagen und ab welcher Schwelle ein Deal interessant wird.
                </p>
                <div className="metric-pills">
                  <span>CoC</span>
                  <span>DSCR</span>
                  <span>IRR</span>
                </div>
              </div>
            </Reveal>
            <Reveal as="div" className="curric-card" delay={0.16}>
              <span className="num">02</span>
              <div>
                <h3>Wie du jeden Deal mit einem einzigen Wert bewertest — dem Investment-Score</h3>
                <p>
                  Statt dich in Excel-Tabellen zu verlieren: ein Wert, der gut, schlecht oder
                  verhandelbar sagt — und Stärken und Schwächen sofort sichtbar macht.
                </p>
              </div>
            </Reveal>
            <Reveal as="div" className="curric-card" delay={0.08}>
              <span className="num">03</span>
              <div>
                <h3>Wie du Stress-Tests fährst und erkennst, ab wann ein Deal kippt</h3>
                <p>
                  Zinsanstieg, Leerstand, Sanierungsstau — simuliere die Szenarien, die deine
                  Rendite gefährden, bevor du unterschreibst.
                </p>
              </div>
            </Reveal>
            <Reveal as="div" className="curric-card demo" delay={0.16}>
              <span className="num">04</span>
              <div>
                <h3>Demo: ein reales Inserat per Link importieren und komplett durchrechnen</h3>
                <p>
                  Von der Rendite bis zum bankfähigen Dossier — in Minuten statt Stunden. Du siehst
                  die Plattform in Aktion, nicht in Folien.
                </p>
                <span className="demo-tag">
                  <Radio size={14} /> Am echten Objekt
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== FÜR WEN ===== */}
      <section className="section audience" id="fuerwen">
        <div className="container">
          <Reveal as="div" className="section-head">
            <p className="eyebrow">Für wen ist das?</p>
            <h2>Für Menschen, die mit echtem Geld echte Entscheidungen treffen.</h2>
            <p className="lede">
              Dieses Webinar ist bewusst kein Massenprodukt. Es richtet sich an Investoren, die
              ihre Entscheidungen schärfen wollen — nicht an Gelegenheits-Sucher.
            </p>
          </Reveal>
          <div className="aud-grid">
            <Reveal as="div" className="aud-col yes" delay={0.08}>
              <div className="ahd">
                <span className="ic">
                  <Check size={18} />
                </span>
                <h3>Richtig für dich, wenn du …</h3>
              </div>
              <ul className="aud-list">
                {[
                  "als privater oder professioneller Investor regelmäßig Objekte prüfst",
                  "ein Bestandsportfolio hältst und es sauber steuern willst",
                  "als Unternehmer Immobilienvermögen aufbaust oder verwaltest",
                  "schneller und sicherer entscheiden willst — mit Zahlen statt Bauchgefühl",
                ].map((t, i) => (
                  <li key={i}>
                    <span className="ck">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12l5 5L20 6" />
                      </svg>
                    </span>{" "}
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal as="div" className="aud-col no" delay={0.16}>
              <div className="ahd">
                <span className="ic">
                  <Minus size={18} />
                </span>
                <h3>Eher nicht, wenn du …</h3>
              </div>
              <ul className="aud-list">
                {[
                  "eine „schnell-reich“-Abkürzung ohne eigene Arbeit suchst",
                  "noch nie über ein konkretes Investment nachgedacht hast",
                  "nur unverbindlich „mal reinschauen“ möchtest",
                  "nicht bereit bist, deine Analyse zu professionalisieren",
                ].map((t, i) => (
                  <li key={i}>
                    <span className="ck">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </span>{" "}
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== PRESENTER ===== */}
      <section className="section" id="host">
        <div className="container">
          <div className="presenter-grid">
            <Reveal as="div" className="presenter-photo" delay={0.08}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="presenter-img" src="/assets/presenter.jpg" alt="Maximilian Hölzl" />
              <div className="presenter-badge">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="ai" src={MARK_WHITE} alt="" />
                <div className="pb-txt">
                  <div className="a">ALLROUND.IMMO</div>
                  <div className="b">Dein Host für den Abend</div>
                </div>
              </div>
            </Reveal>
            <Reveal as="div" className="presenter-info" delay={0.16}>
              <p className="eyebrow">Dein Speaker</p>
              <div className="name">Maximilian Hölzl</div>
              <div className="role">Konzessionierter Immobilientreuhänder &amp; Marketing-Experte</div>
              <p>
                Maximilian verbindet die Praxis des konzessionierten Immobilientreuhänders mit
                einem klaren Blick für Zahlen und Vermarktung. Er weiß, woran reale Deals
                scheitern — und worauf Banken, Steuerberater und institutionelle Käufer wirklich
                schauen.
              </p>
              <p>
                Im Webinar zeigt er dir nicht Theorie, sondern den exakten Prozess, mit dem ein
                Objekt vom Inserat bis zum bankfähigen Dossier bewertet wird — und wie
                ALLROUND.IMMO diesen Prozess auf Minuten verkürzt.
              </p>
              <div className="cred-row">
                <div className="cred">
                  <div className="cv">22. Juni</div>
                  <div className="ck">Interaktiv · 19:30 Uhr</div>
                </div>
                <div className="cred">
                  <div className="cv">~60 Min</div>
                  <div className="ck">inkl. Demo &amp; Q&amp;A</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="section audience">
        <div className="container">
          <Reveal as="div" className="section-head center mx-auto">
            <p className="eyebrow">Stimmen aus der Praxis</p>
            <h2>Was Investoren über ALLROUND.IMMO sagen.</h2>
          </Reveal>
          <div className="testi-grid">
            <Reveal as="div" className="testi-card" delay={0.08}>
              <Stars label="5 von 5" />
              <p className="quote">
                „ALLROUND.IMMO macht Immobilienanalysen mühelos. Schnelle Auswertungen, klare
                Kennzahlen und ein durchdachtes Interface.“
              </p>
              <div className="testi-top">
                <span className="avatar" style={{ background: "#ef4444" }}>
                  DH
                </span>
                <div>
                  <div className="nm">Dominik Haider</div>
                  <div className="rl">Immobilieninvestor</div>
                </div>
              </div>
            </Reveal>
            <Reveal as="div" className="testi-card" delay={0.16}>
              <Stars label="5 von 5" />
              <p className="quote">
                „Hat unsere Deal-Prüfung brutal beschleunigt — Entscheidungen schneller und mit
                deutlich mehr Sicherheit.“
              </p>
              <div className="testi-top">
                <span className="avatar" style={{ background: "#8b5cf6" }}>
                  SL
                </span>
                <div>
                  <div className="nm">Sophie L.</div>
                  <div className="rl">JPG &amp; Partner</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== ANMELDUNG ===== */}
      <section className="section signup" id="anmelden">
        <div className="container">
          <Reveal as="div" className="signup-card">
            <p className="eyebrow eyebrow-dark">Jetzt anmelden</p>
            <h2>Sichere dir deinen kostenlosen Platz.</h2>
            <div className="signup-date">
              <CalendarClock size={16} /> {WEBINAR.longLabel}
            </div>
            <p className="sub">Trag dich ein — die Zugangsdaten kommen sofort per E-Mail.</p>
            <SignupForm />
            <SeatsLeft variant="meter" />
          </Reveal>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section" id="faq">
        <div className="container">
          <Reveal as="div" className="section-head center mx-auto">
            <p className="eyebrow">Häufige Fragen</p>
            <h2>Gut zu wissen.</h2>
          </Reveal>
          <Reveal as="div" delay={0.08}>
            <Faq />
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
