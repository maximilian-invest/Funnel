"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const ITEMS: { q: string; a: string }[] = [
  {
    q: "Ist die Teilnahme wirklich kostenlos?",
    a: "Ja, das Webinar ist vollständig kostenlos. Du brauchst nur einen Platz zu sichern und bekommst die Zugangsdaten per E-Mail.",
  },
  {
    q: "Brauche ich Vorkenntnisse?",
    a: "Nein. Wir erklären jede Kennzahl verständlich. Sinnvoll ist es, wenn du grundsätzlich über Immobilien-Investments nachdenkst oder bereits investierst — dann ziehst du den größten Nutzen.",
  },
  {
    q: "Wird das Webinar aufgezeichnet?",
    a: "Der größte Mehrwert entsteht in der Teilnahme — inklusive Q&A und der interaktiven Demo. Angemeldete Teilnehmer erhalten Hinweise zur Aufzeichnung per E-Mail.",
  },
  {
    q: "Für wen lohnt es sich am meisten?",
    a: "Für private und professionelle Investoren, Bestandshalter und Unternehmer mit Immobilienvermögen, die schneller und sicherer entscheiden wollen — mit Zahlen statt Bauchgefühl.",
  },
  {
    q: "Wie läuft das Webinar ab?",
    a: "Rund 60 Minuten: zuerst die Kennzahlen und der Investment-Score, dann eine Demo an einem realen Objekt — vom Link-Import bis zum bankfähigen Dossier — und zum Abschluss Zeit für deine Fragen.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="faq-wrap">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div className={"faq-item" + (isOpen ? " open" : "")} key={i}>
            <button
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {item.q}
              <span className="ic">
                <Plus size={20} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  style={{ overflow: "hidden" }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="faq-a-inner">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
