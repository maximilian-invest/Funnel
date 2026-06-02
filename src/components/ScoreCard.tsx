"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Link as LinkIcon } from "lucide-react";

const MARK_WHITE = "/assets/logo-mark-white.svg";

type Verdict = "good" | "mid" | "weak";
type Prop = {
  url: string;
  name: string;
  loc: string;
  type: string;
  score: number;
  verdict: Verdict;
  tag: string;
  icon: keyof typeof VERDICT_ICON;
  desc: string;
  coc: number;
  irr: number;
  dscr: number;
  cf: number;
};

const VERDICT_ICON = {
  "check-circle-2":
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.4 12 2.3 2.3L16 9"/></svg>',
  scale:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M7 21h10"/><path d="M5 7h14"/><path d="m5 7-3 6h6Z"/><path d="m19 7 3 6h-6Z"/></svg>',
  "alert-triangle":
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 4 2.3 18A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
} as const;

const PROPS: Prop[] = [
  {
    url: "immoscout24.de/expose/148209534",
    name: "Stadtquartier Lindenau",
    loc: "Leipzig · 14 Einheiten · Baujahr 1998",
    type: "Zinshaus",
    score: 84,
    verdict: "good",
    tag: "GUTER DEAL",
    icon: "check-circle-2",
    desc: "Solide Rendite bei robustem Cashflow — Stärken & Schwächen sofort sichtbar.",
    coc: 6.4,
    irr: 8.9,
    dscr: 1.38,
    cf: 420,
  },
  {
    url: "willhaben.at/iad/immobilien/d/12876510",
    name: "Gründerzeit-Altbau",
    loc: "Wien 1090 · 6 Einheiten · Baujahr 1901",
    type: "Altbau",
    score: 62,
    verdict: "mid",
    tag: "VERHANDELBAR",
    icon: "scale",
    desc: "Potenzial vorhanden — rechnet sich erst nach Kaufpreis-Verhandlung und Sanierungsplan.",
    coc: 4.1,
    irr: 5.6,
    dscr: 1.12,
    cf: 180,
  },
  {
    url: "immowelt.de/expose/2Q4K8X9",
    name: "Wohn- & Geschäftshaus",
    loc: "München · 9 Einheiten · Baujahr 1975",
    type: "Gemischt",
    score: 39,
    verdict: "weak",
    tag: "HOHES RISIKO",
    icon: "alert-triangle",
    desc: "Negativer Cashflow und schwache Schuldendeckung — in der aktuellen Struktur kein tragfähiger Deal.",
    coc: 2.2,
    irr: 3.1,
    dscr: 0.94,
    cf: -150,
  },
];

const COLOR: Record<Verdict, string> = { good: "#34d399", mid: "#ffffff", weak: "#f87171" };
const TAGBG: Record<Verdict, string> = {
  good: "rgba(16,185,129,.16)",
  mid: "rgba(255,255,255,.1)",
  weak: "rgba(239,68,68,.16)",
};

export function ScoreCard() {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const prog = card.querySelector<SVGCircleElement>(".gauge .prog");
    if (!prog) return;
    const C = 2 * Math.PI * prog.r.baseVal.value;

    if (reduced) {
      const p0 = PROPS[0];
      prog.style.strokeDasharray = String(C);
      prog.style.strokeDashoffset = String(C * (1 - p0.score / 100));
      prog.style.stroke = COLOR[p0.verdict];
      return;
    }

    const q = (sel: string) => card.querySelector(sel) as HTMLElement;
    const el = {
      url: q("[data-url]"),
      go: q("[data-go]"),
      name: q("[data-name]"),
      loc: q("[data-loc]"),
      type: q("[data-type]"),
      val: q("[data-val]"),
      tag: q("[data-tag]"),
      desc: q("[data-desc]"),
      objline: q(".obj-line"),
      coc: q('[data-m="coc"]'),
      irr: q('[data-m="irr"]'),
      dscr: q('[data-m="dscr"]'),
      cf: q('[data-m="cf"]'),
    };

    let alive = true;
    const timers = new Set<number>();
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          res();
        }, ms);
        timers.add(id);
      });

    const fmt = (v: number, dec: number) =>
      v.toLocaleString("de-DE", { minimumFractionDigits: dec, maximumFractionDigits: dec });

    function animateNum(
      setter: (v: number) => void,
      from: number,
      to: number,
      dur: number,
    ) {
      const start = performance.now();
      return new Promise<void>((res) => {
        function step(now: number) {
          if (!alive) return res();
          const t = Math.min(1, (now - start) / dur);
          const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
          setter(from + (to - from) * e);
          if (t < 1) requestAnimationFrame(step);
          else {
            setter(to);
            res();
          }
        }
        requestAnimationFrame(step);
      });
    }

    function type(text: string) {
      return new Promise<void>((res) => {
        let i = 0;
        function tick() {
          if (!alive) return res();
          el.url.textContent = text.slice(0, i) + (i < text.length ? "▏" : "");
          if (i++ < text.length) {
            const id = window.setTimeout(tick, 32);
            timers.add(id);
          } else {
            el.url.textContent = text;
            res();
          }
        }
        tick();
      });
    }

    function setGauge(pct: number, color: string) {
      prog!.style.strokeDasharray = String(C);
      prog!.style.transition =
        "stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1), stroke .6s ease, filter .6s ease";
      prog!.style.stroke = color;
      prog!.style.filter = "drop-shadow(0 0 7px " + color + ")";
      requestAnimationFrame(() => {
        prog!.style.strokeDashoffset = String(C * (1 - pct / 100));
      });
    }

    function setVerdict(p: Prop) {
      el.tag.style.background = TAGBG[p.verdict];
      el.tag.style.color = COLOR[p.verdict];
      el.tag.innerHTML = VERDICT_ICON[p.icon] + " " + p.tag;
      el.desc.textContent = p.desc;
    }

    // start from an "empty" gauge
    prog.style.transition = "none";
    prog.style.strokeDasharray = String(C);
    prog.style.strokeDashoffset = String(C);
    prog.getBoundingClientRect();

    let prev = { score: 0, coc: 0, irr: 0, dscr: 0, cf: 0 };

    async function showProp(p: Prop) {
      el.go.textContent = "Analysiere";
      el.go.style.background = "rgba(255,255,255,.12)";
      el.go.style.color = "#fff";
      await type(p.url);
      if (!alive) return;

      card!.classList.add("analyzing");
      el.go.textContent = "Prüft …";
      await wait(680);
      if (!alive) return;

      el.objline.style.opacity = "0";
      await wait(220);
      if (!alive) return;
      el.name.textContent = p.name;
      el.loc.textContent = p.loc;
      el.type.textContent = p.type;
      el.objline.style.opacity = "1";

      card!.classList.remove("analyzing");
      el.go.textContent = "✓ Analysiert";
      el.go.style.background =
        COLOR[p.verdict] === "#ffffff" ? "rgba(255,255,255,.16)" : COLOR[p.verdict];
      el.go.style.color = "#fff";
      setGauge(p.score, COLOR[p.verdict]);
      setVerdict(p);
      el.cf.classList.toggle("pos", p.cf >= 0);
      el.cf.classList.toggle("neg", p.cf < 0);

      animateNum((v) => (el.val.textContent = String(Math.round(v))), prev.score, p.score, 1200);
      animateNum((v) => (el.coc.textContent = fmt(v, 1) + " %"), prev.coc, p.coc, 1200);
      animateNum((v) => (el.irr.textContent = fmt(v, 1) + " %"), prev.irr, p.irr, 1200);
      animateNum((v) => (el.dscr.textContent = fmt(v, 2)), prev.dscr, p.dscr, 1200);
      await animateNum(
        (v) =>
          (el.cf.textContent =
            (v >= 0 ? "+" : "−") + fmt(Math.abs(Math.round(v)), 0) + " €"),
        prev.cf,
        p.cf,
        1200,
      );
      if (!alive) return;
      prev = { score: p.score, coc: p.coc, irr: p.irr, dscr: p.dscr, cf: p.cf };
      await wait(3400);
    }

    let i = 0;
    (async function loop() {
      while (document.hidden) {
        await wait(500);
        if (!alive) return;
      }
      await showProp(PROPS[i]);
      if (!alive) return;
      i = (i + 1) % PROPS.length;
      loop();
    })();

    return () => {
      alive = false;
      timers.forEach((id) => clearTimeout(id));
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="score-card"
      data-demo-loop
      aria-label="Allround Immo Score — Live-Analyse"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
    >
      <div className="score-head">
        <span className="ttl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ai" src={MARK_WHITE} alt="" /> Allround Immo Score
        </span>
        <span className="badge badge-dark">
          <span className="badge-dot live" style={{ background: "#34d399" }} /> Live-Analyse
        </span>
      </div>
      <div className="score-body">
        <div className="import-chip">
          <span className="glob">
            <LinkIcon size={16} />
          </span>
          <span className="url" data-url>
            immoscout24.de/expose/148209534
          </span>
          <span className="go" data-go>
            Import
          </span>
        </div>
        <div className="obj-line">
          <div>
            <div className="name" data-name>
              Stadtquartier Lindenau
            </div>
            <div className="loc" data-loc>
              Leipzig · 14 Einheiten · Baujahr 1998
            </div>
          </div>
          <span className="badge badge-dark" data-type>
            Zinshaus
          </span>
        </div>

        <div className="gauge-wrap">
          <div className="gauge">
            <svg width="132" height="132" viewBox="0 0 132 132">
              <circle className="track" cx="66" cy="66" r="57" />
              <circle className="prog" cx="66" cy="66" r="57" />
            </svg>
            <div className="gauge-center">
              <span className="val" data-val>
                84
              </span>
              <span className="max">/ 100</span>
            </div>
          </div>
          <div className="verdict">
            <span className="tag" data-tag>
              <CheckCircle2 size={15} /> GUTER DEAL
            </span>
            <span className="desc" data-desc>
              Solide Rendite bei robustem Cashflow — Stärken &amp; Schwächen sofort sichtbar.
            </span>
          </div>
        </div>

        <div className="metric-grid">
          <div className="mtile">
            <div className="k">Cash-on-Cash</div>
            <div className="v" data-m="coc">
              6,4 %
            </div>
          </div>
          <div className="mtile">
            <div className="k">IRR (10 J.)</div>
            <div className="v" data-m="irr">
              8,9 %
            </div>
          </div>
          <div className="mtile">
            <div className="k">DSCR</div>
            <div className="v" data-m="dscr">
              1,38
            </div>
          </div>
          <div className="mtile">
            <div className="k">Cashflow / Monat</div>
            <div className="v pos" data-m="cf">
              +420 €
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
