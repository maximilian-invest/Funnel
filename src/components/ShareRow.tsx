"use client";

import { useState } from "react";
import { Check, Link as LinkIcon, MessageCircle } from "lucide-react";

// lucide-react dropped its brand icons, so LinkedIn is an inline glyph.
function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V21h-4V8zm7.5 0h3.84v1.78h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14V21h-4v-5.66c0-1.35-.02-3.08-1.88-3.08-1.88 0-2.17 1.47-2.17 2.98V21H8V8z" />
    </svg>
  );
}

const SHARE_TEXT =
  "Kostenloses Live-Webinar von ALLROUND.IMMO — Immobilien-Deals bewerten wie ein Profi:";

function currentUrl() {
  if (typeof window === "undefined") return "";
  // share the landing page rather than the confirmation URL
  return window.location.origin + "/";
}

export function ShareRow() {
  const [copied, setCopied] = useState(false);

  function copy() {
    const url = currentUrl();
    try {
      navigator.clipboard?.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + " " + currentUrl())}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    currentUrl(),
  )}`;

  return (
    <div className="share-row">
      <span className="lbl">Webinar teilen:</span>
      <a className="share-btn" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <MessageCircle size={18} />
      </a>
      <a className="share-btn" href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <LinkedInIcon />
      </a>
      <button
        type="button"
        className="share-btn"
        onClick={copy}
        aria-label={copied ? "Link kopiert" : "Link kopieren"}
      >
        {copied ? <Check size={18} /> : <LinkIcon size={18} />}
      </button>
    </div>
  );
}
