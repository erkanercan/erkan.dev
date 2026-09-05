"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import styles from "./bad-work-correction.module.css";

type State = "idle" | "bad" | "corrected";

export function BadWorkCorrection() {
  const [state, setState] = useState<State>("idle");
  const timers = useRef<number[]>([]);
  const reduceMotion = useReducedMotion();

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const correct = () => {
    if (state !== "idle") return;

    clearTimers();

    if (reduceMotion) {
      setState("corrected");
      timers.current.push(window.setTimeout(() => setState("idle"), 2800));
      return;
    }

    setState("bad");
    timers.current.push(window.setTimeout(() => setState("corrected"), 850));
    timers.current.push(window.setTimeout(() => setState("idle"), 3500));
  };

  return (
    <span className={styles.wrapper}>
      <button
        className={styles.statement}
        type="button"
        data-state={state}
        onClick={correct}
        aria-label="Badly, then continuing to do it that way. Click to correct the typesetting."
      >
        <span className={styles.badly}>badly</span>, then continuing to do it{" "}
        <em className={styles.thatWay}>that way.</em>
      </button>

      <AnimatePresence initial={false}>
        {state === "corrected" ? (
          <motion.small
            className={styles.note}
            aria-live="polite"
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            We noticed. Continuing would be the bad part.
          </motion.small>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
