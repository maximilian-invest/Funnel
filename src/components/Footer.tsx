import { asset } from "@/lib/asset";

const MARK_WHITE = asset("/assets/logo-mark-white.svg");
const WORD_WHITE = asset("/assets/logo-wordmark-white.svg");

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-min">
          <span className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="mark" src={MARK_WHITE} alt="Allround.immo" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="word" src={WORD_WHITE} alt="" style={{ height: 15 }} />
          </span>
        </div>
      </div>
    </footer>
  );
}
