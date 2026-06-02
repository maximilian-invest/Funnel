"use client";

import { useEffect, useState } from "react";
import { STORAGE } from "@/lib/constants";

/** Greets the visitor by the first name captured at signup (falls back to "Investor"). */
export function GreetName() {
  const [name, setName] = useState("Investor");

  useEffect(() => {
    try {
      const n = sessionStorage.getItem(STORAGE.firstName);
      if (n) setName(n);
    } catch {
      /* ignore */
    }
  }, []);

  return <span id="greet-name">{name}</span>;
}
