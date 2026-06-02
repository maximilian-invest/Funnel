const MARK_WHITE = "/assets/logo-mark-white.svg";
const WORD_WHITE = "/assets/logo-wordmark-white.svg";

export function Footer({ variant = "full" }: { variant?: "full" | "compact" }) {
  if (variant === "compact") {
    return (
      <footer className="footer">
        <div className="container">
          <div
            className="footer-bottom"
            style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}
          >
            <span className="brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mark" src={MARK_WHITE} alt="Allround.immo" style={{ height: 26 }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="word" src={WORD_WHITE} alt="" style={{ height: 13 }} />
            </span>
            <span className="legal">
              <a href="#">Impressum</a>
              <a href="#">Datenschutz</a>
              <a href="#">Kontakt</a>
            </span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="brand-block">
            <span className="brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mark" src={MARK_WHITE} alt="Allround.immo" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="word" src={WORD_WHITE} alt="" style={{ height: 15 }} />
            </span>
            <p>
              Die KI-gestützte Plattform für Immobilien-Investments. Daten rein — Cashflow,
              Rendite, Risiko und bankfähige Dossiers raus. Investiere wie ein Profi.
            </p>
          </div>
          <div className="footer-col">
            <h4>Webinar</h4>
            <a href="#lernen">Inhalte</a>
            <a href="#fuerwen">Für wen</a>
            <a href="#host">Speaker</a>
            <a href="#anmelden">Anmelden</a>
          </div>
          <div className="footer-col">
            <h4>Rechtliches</h4>
            <a href="#">Impressum</a>
            <a href="#">Datenschutz</a>
            <a href="#">Kontakt</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="copy">
            © 2026 ALLROUND.IMMO · <span className="ph">[Impressum-Angaben]</span>
          </span>
          <span className="legal">
            <a href="#">Impressum</a>
            <a href="#">Datenschutz</a>
            <a href="#">AGB</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
