import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, Mail } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Countdown } from "@/components/Countdown";
import { SuccessRing } from "@/components/SuccessRing";
import { GreetName } from "@/components/GreetName";
import { CalendarButtons } from "@/components/CalendarButtons";
import { ShareRow } from "@/components/ShareRow";
import { PixelConversion } from "@/components/PixelConversion";
import { ROUTES, WEBINAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ALLROUND.IMMO · Du bist angemeldet",
};

const AGENDA: { time: string; title: string; body: string; delay: number }[] = [
  {
    time: "00:00",
    title: "Die 3 Kennzahlen der Profis",
    body: "Cash-on-Cash, DSCR und IRR — richtig gelesen. Woran du in Sekunden erkennst, ob sich ein Objekt rechnet.",
    delay: 0.08,
  },
  {
    time: "00:15",
    title: "Ein Wert statt Excel-Chaos: der Investment-Score",
    body: "Wie du jeden Deal mit einem einzigen Wert bewertest — gut, schlecht oder verhandelbar — inkl. Stärken & Schwächen.",
    delay: 0.08,
  },
  {
    time: "00:30",
    title: "Live-Demo: vom Link-Import zum bankfähigen Dossier",
    body: "Ein reales Inserat importieren und in Minuten komplett durchrechnen — von der Rendite bis zum Stress-Test.",
    delay: 0.16,
  },
  {
    time: "00:50",
    title: "Deine Fragen — Live-Q&A",
    body: "Bring dein Objekt oder deine Frage mit. Maximilian beantwortet sie direkt im Webinar.",
    delay: 0.16,
  },
];

export default function ConfirmationPage() {
  return (
    <>
      <Nav variant="solid" />
      <PixelConversion event="Lead" />

      {/* ===== CONFIRMATION ===== */}
      <section className="confirm">
        <div className="confirm-main">
          <div className="container">
            <div className="confirm-card">
              <SuccessRing />
              <Reveal as="p" className="eyebrow eyebrow-dark">
                Anmeldung bestätigt
              </Reveal>
              <Reveal as="h1" delay={0.08}>
                Du bist dabei, <GreetName />.
              </Reveal>
              <Reveal as="p" className="lede" delay={0.08}>
                Dein Platz für das Live-Webinar ist reserviert. Die Zugangsdaten sind unterwegs in
                dein Postfach — leg dir den Termin am besten gleich in den Kalender.
              </Reveal>

              <Reveal as="div" delay={0.16}>
                <Countdown variant="big" />
              </Reveal>

              <Reveal
                as="div"
                className="signup-date"
                delay={0.16}
                style={{ margin: "0 0 30px" }}
              >
                <CalendarClock size={16} /> {WEBINAR.longLabel}
              </Reveal>

              <Reveal as="div" delay={0.24}>
                <CalendarButtons />
              </Reveal>

              <Reveal as="div" className="spam-note" delay={0.24}>
                <Mail size={16} /> Keine E-Mail erhalten? Sieh kurz im Spam- oder Werbe-Ordner nach
                und markiere uns als „kein Spam“.
              </Reveal>

              <Reveal as="div" delay={0.24}>
                <ShareRow />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AGENDA ===== */}
      <section className="agenda">
        <div className="container">
          <Reveal as="div" className="section-head center mx-auto">
            <p className="eyebrow">Was dich erwartet</p>
            <h2>60 Minuten, die deine Deal-Prüfung verändern.</h2>
            <p className="lede">
              „Vom Inserat zur Entscheidung: Cashflow, Rendite &amp; Risiko jedes Objekts auf einen
              Blick.“
            </p>
          </Reveal>
          <div className="agenda-list">
            {AGENDA.map((a) => (
              <Reveal as="div" className="agenda-item" delay={a.delay} key={a.time}>
                <span className="time">{a.time}</span>
                <div className="ag-body">
                  <h4>{a.title}</h4>
                  <p>{a.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal as="div" className="center" delay={0.16} style={{ marginTop: 48 }}>
            <Link href={ROUTES.webinar} className="btn btn-primary btn-lg btn-arrow">
              Zur Webinar-Vorschau <ArrowRight size={20} />
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
