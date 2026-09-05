"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./dog-interruption.module.css";

const interruptionEvent = "erkan:dog-interruption";
const encounterDuration = 5600;

export function DogInterruptionTrigger() {
  return (
    <button
      className={styles.trigger}
      type="button"
      onClick={() => window.dispatchEvent(new Event(interruptionEvent))}
      aria-label="Dogs. There may be one nearby."
    >
      dogs.
    </button>
  );
}

export function DogInterruption() {
  const [encounter, setEncounter] = useState(0);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const hide = () => {
      clearHideTimer();
      setVisible(false);
    };

    const begin = () => {
      clearHideTimer();
      setEncounter((current) => current + 1);
      setVisible(true);
      hideTimer.current = window.setTimeout(hide, encounterDuration);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };

    window.addEventListener(interruptionEvent, begin);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener(interruptionEvent, begin);
      window.removeEventListener("keydown", onKeyDown);
      clearHideTimer();
    };
  }, [clearHideTimer]);

  return (
    <div className={styles.viewport} aria-hidden="true">
      <AnimatePresence initial={false}>
        {visible ? (
          <motion.div className={styles.encounter} key={encounter}>
            <motion.div
              className={styles.erkan}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: "-18%", y: "-64%", rotate: -7 }
              }
              animate={
                reduceMotion
                  ? { opacity: [0, 1, 1, 0] }
                  : {
                      opacity: [0, 1, 1, 1, 0],
                      x: ["-18%", "0%", "0%", "1%", "-20%"],
                      y: ["-64%", "0%", "0%", "2%", "-66%"],
                      rotate: [-7, -1.5, -1.5, 1.5, -7],
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 3.2, times: [0, 0.08, 0.82, 1] }
                  : {
                      duration: 5.35,
                      ease: [0.22, 1, 0.36, 1],
                      times: [0, 0.13, 0.58, 0.79, 1],
                    }
              }
            >
              <Image
                src="/easter-eggs/erkan-peek.webp"
                alt=""
                width={1254}
                height={1254}
                priority={false}
                sizes="(max-width: 640px) 72vw, 48vw"
              />
            </motion.div>

            <motion.div
              className={styles.frenchie}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: "10%", y: "72%", rotate: 6 }
              }
              animate={
                reduceMotion
                  ? { opacity: [0, 1, 1, 0] }
                  : {
                      opacity: [0, 1, 1, 1, 0],
                      x: ["10%", "0%", "0%", "-2%", "10%"],
                      y: ["72%", "0%", "0%", "-1%", "76%"],
                      rotate: [6, 1, 1, -4, 5],
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 3, times: [0, 0.08, 0.78, 1] }
                  : {
                      duration: 4.45,
                      delay: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                      times: [0, 0.13, 0.54, 0.73, 1],
                    }
              }
            >
              <Image
                src="/easter-eggs/frenchie-peek.webp"
                alt=""
                width={1254}
                height={1254}
                priority={false}
                sizes="(max-width: 640px) 67vw, 43vw"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
