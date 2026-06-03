"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ROUTES, STORAGE } from "@/lib/constants";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function SignupForm() {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const mailRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);
  const [nameBad, setNameBad] = useState(false);
  const [mailBad, setMailBad] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = nameRef.current?.value.trim() ?? "";
    const mail = mailRef.current?.value.trim() ?? "";
    const nb = !name;
    const mb = !EMAIL_RE.test(mail);
    setNameBad(nb);
    setMailBad(mb);
    if (nb || mb) return;

    setSubmitting(true);
    try {
      sessionStorage.setItem(STORAGE.firstName, name);
      sessionStorage.setItem(STORAGE.email, mail);
    } catch {
      /* ignore storage errors */
    }
    // register on the backend (sends team + customer emails); non-blocking
    void fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: mail, company: hpRef.current?.value ?? "" }),
    }).catch(() => {});
    // brief "securing your seat" beat, then advance to confirmation
    setTimeout(() => router.push(ROUTES.confirm), 650);
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <input
        ref={hpRef}
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <div className="form-row">
        <div className="fld-group">
          <label className="fld-label" htmlFor="vorname">
            Vorname
          </label>
          <input
            ref={nameRef}
            className={"fld" + (nameBad ? " invalid" : "")}
            type="text"
            id="vorname"
            name="vorname"
            placeholder="Max"
            autoComplete="given-name"
            onInput={() => nameBad && setNameBad(false)}
          />
        </div>
        <div className="fld-group">
          <label className="fld-label" htmlFor="email">
            E-Mail-Adresse
          </label>
          <input
            ref={mailRef}
            className={"fld" + (mailBad ? " invalid" : "")}
            type="email"
            id="email"
            name="email"
            placeholder="max@beispiel.de"
            autoComplete="email"
            onInput={() => mailBad && setMailBad(false)}
          />
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-on-dark btn-lg btn-block btn-arrow"
        style={{ height: 54 }}
        disabled={submitting}
      >
        {submitting ? (
          "Platz wird gesichert …"
        ) : (
          <>
            Jetzt kostenlos anmelden <ArrowRight size={20} />
          </>
        )}
      </button>
    </form>
  );
}
