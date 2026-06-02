"use client";

import { motion, useReducedMotion } from "framer-motion";

/** The focal "you're in" moment — a precise spring pop, not a loud flourish. */
export function SuccessRing() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="success-ring"
      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
      animate={reduce ? undefined : { scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </motion.div>
  );
}
