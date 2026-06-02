# ALLROUND.IMMO — Webinar-Funnel

Mobile-first Webinar-Funnel für **ALLROUND.IMMO** („Investiere wie ein Profi“),
umgesetzt in **Next.js** auf Basis des Claude-Design-Handoffs.

Drei Schritte:

1. **Landing Page** (`/`) — Webinar-Anmeldung: Hero mit kontinuierlicher
   Live-Analyse-Score-Card, Lernziele, Zielgruppe, Speaker, Testimonials,
   Anmeldeformular und FAQ.
2. **Bestätigung** (`/bestaetigung`) — Anmeldebestätigung mit großem Countdown,
   Kalender-Buttons (Google / Apple / Outlook), Agenda und Teilen-Funktion.
3. **Webinar-Raum** (`/webinar`) — Video-Player, Host, High-Ticket-Angebot und
   Live-Chat mit Reaktionen.

## Stack

- **Next.js 16** (App Router) · **TypeScript**
- **Tailwind CSS v4** + portiertes Design-System (`src/app/globals.css`)
- **Framer Motion** — dezente, hochwertige Scroll-Reveals & Mikro-Interaktionen
- **lucide-react** (Icons) · **next/font** — Manrope / Inter / JetBrains Mono (self-hosted)

**Designprinzip** (verbindlich aus dem Briefing): _ruhig, souverän, institutionell —
Premium durch Präzision, nicht durch Lautstärke._ Monochrom (Near-Black + Weiß) mit
einem einzigen Akzent: Signalrot `#ef4444`. `prefers-reduced-motion` wird respektiert.

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Produktions-Build
npm run start    # Produktions-Server
```

## Struktur

```
src/
├── app/
│   ├── layout.tsx              # Fonts, Metadaten
│   ├── globals.css             # Design-System (Tokens + Komponenten)
│   ├── page.tsx                # Landing Page
│   ├── bestaetigung/page.tsx   # Bestätigung
│   └── webinar/page.tsx        # Webinar-Raum
├── components/                 # Nav, Footer, ScoreCard, Countdown, Faq,
│                               # SignupForm, WebinarRoom, Reveal, …
└── lib/
    ├── constants.ts            # Webinar-Termin & Texte
    └── calendar.ts             # Google/Outlook/ICS-Kalenderlinks
public/assets/                  # Logos (SVG)
```

## Noch zu befüllen (Platzhalter aus dem Design)

- **Webinar-Termin**: aktuell `Mo, 15. Juni 2026 · 19:30` → `src/lib/constants.ts`
  (`WEBINAR.date` + Labels).
- **Bilder** (rot-gestrichelte Platzhalter): Speaker-Foto, Webinar-Standbild,
  Host-Avatar → `ImageSlot` durch echte Bilder ersetzen.
- **Angebot/Preis** im Webinar-Raum: `[Preis / Angebot]` in
  `src/components/WebinarRoom.tsx`.
- **Formular-Backend**: Das Anmeldeformular speichert aktuell nur in `sessionStorage`
  und leitet weiter — Anbindung (z. B. Supabase / E-Mail / CRM) noch offen.
- **Rechtliches**: Impressum / Datenschutz / AGB / Kontakt-Links.
