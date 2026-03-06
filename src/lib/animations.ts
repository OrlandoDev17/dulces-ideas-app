import type { Variants, Transition } from "motion/react";

// ─── Shared transition defaults ────────────────────────────────────────────

const ease = [0.25, 0.1, 0.25, 1] as const; // cubic-bezier ease-out

/** Forgiving fast transition — doesn't block interaction */
export const transition: Transition = {
  duration: 0.35,
  ease,
};

// ─── Variant: fade up (for individual blocks) ──────────────────────────────
// Use on elements that don't already have CSS transitions.
// If the child has CSS transitions, wrap it and animate the WRAPPER instead.

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition,
  },
};

// ─── Variant: staggered container ──────────────────────────────────────────
// Wrap a list of animated children with this so they cascade in one by one.

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0,
    },
  },
};

// ─── Variant: fade in only (no movement) ───────────────────────────────────
// For cards that already have CSS shadow/border transitions — put this on
// a wrapper div, not on the element with transitions.

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease },
  },
};

// ─── Variant: slide in from left ───────────────────────────────────────────

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition,
  },
};
