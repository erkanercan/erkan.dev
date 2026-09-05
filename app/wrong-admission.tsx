"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./wrong-admission.module.css";

const copy = {
  idle: "“I was wrong.”",
  defensive: "“I was technically correct.”",
  corrected: "“No. I was wrong.”",
} as const;

type AdmissionState = keyof typeof copy;

const entrance = {
  idle: { opacity: 0, y: -4, scale: 0.98, filter: "blur(2px)" },
  defensive: {
    opacity: 0,
    x: 14,
    rotate: 1.2,
    scale: 1.03,
    filter: "blur(1px)",
  },
  corrected: {
    opacity: 0,
    x: -8,
    rotate: -0.8,
    scale: 0.98,
    filter: "blur(1px)",
  },
} as const;

const exit = {
  idle: { opacity: 0, y: 2, filter: "blur(1px)" },
  defensive: { opacity: 0, x: -10, rotate: -1.5, filter: "blur(2px)" },
  corrected: { opacity: 0, y: 3, filter: "blur(1px)" },
} as const;

export function WrongAdmission() {
  const [state, setState] = useState<AdmissionState>("idle");
  const timers = useRef<number[]>([]);
  const reduceMotion = useReducedMotion();

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  const object = useCallback(() => {
    clearTimers();
    setState("defensive");

    timers.current = [
      window.setTimeout(() => setState("corrected"), 1100),
      window.setTimeout(() => setState("idle"), 3200),
    ];
  }, [clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <button
      className={styles.admission}
      data-state={state}
      type="button"
      onClick={object}
    >
      <span className={styles.stage} aria-live="polite" aria-atomic="true">
        <AnimatePresence initial={false} mode="wait">
          <motion.em
            className={state === "defensive" ? styles.defensive : undefined}
            key={state}
            initial={reduceMotion ? false : entrance[state]}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={reduceMotion ? { opacity: 1 } : exit[state]}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: state === "defensive" ? 0.32 : 0.38,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
          >
            {copy[state]}
          </motion.em>
        </AnimatePresence>
      </span>
    </button>
  );
}
