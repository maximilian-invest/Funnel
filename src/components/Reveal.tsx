"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

/** ALLROUND.IMMO signature easing (cubic-bezier(.16,1,.3,1)). */
const EASE = [0.16, 1, 0.3, 1] as const;

type Tag =
  | "div"
  | "section"
  | "header"
  | "aside"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "span"
  | "li"
  | "ul";

type RevealProps = {
  as?: Tag;
  /** Stagger delay in seconds (design uses .08 / .16 / .24 / .32). */
  delay?: number;
  y?: number;
  className?: string;
  id?: string;
  style?: CSSProperties;
  children?: ReactNode;
  "aria-label"?: string;
};

/**
 * Premium scroll-reveal: a restrained fade-up that fires once when the
 * element enters the viewport — impressive through precision, not loudness.
 * Renders the actual semantic tag (no wrapper div) so grid/flex layout is
 * never disturbed, and fully respects prefers-reduced-motion.
 */
export function Reveal({
  as = "div",
  delay = 0,
  y = 18,
  className,
  children,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  // motion exposes a motion component per intrinsic element.
  const M = motion[as] as typeof motion.div;

  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      animate={reduce ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -6% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}
