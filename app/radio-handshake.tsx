"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { recordEasterEgg } from "./easter-egg-analytics";
import styles from "./radio-handshake.module.css";

const handshake = "...---...";
const inputTimeout = 2600;
const transmissionDuration = 6800;

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

export function RadioHandshake() {
  const [visible, setVisible] = useState(false);
  const [transmission, setTransmission] = useState(0);
  const buffer = useRef("");
  const bufferTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);
  const clearButton = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const clearBufferTimer = () => {
      if (bufferTimer.current !== null) {
        window.clearTimeout(bufferTimer.current);
        bufferTimer.current = null;
      }
    };

    const clearHideTimer = () => {
      if (hideTimer.current !== null) {
        window.clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };

    const resetBufferSoon = () => {
      clearBufferTimer();
      bufferTimer.current = window.setTimeout(() => {
        buffer.current = "";
      }, inputTimeout);
    };

    const receive = () => {
      clearHideTimer();
      recordEasterEgg("cw-sos");
      setTransmission((current) => current + 1);
      setVisible(true);
      hideTimer.current = window.setTimeout(
        () => setVisible(false),
        transmissionDuration,
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        buffer.current = "";
        clearBufferTimer();
        clearHideTimer();
        setVisible(false);
        return;
      }

      if (
        event.defaultPrevented ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditableTarget(event.target) ||
        !window.matchMedia("(min-width: 701px)").matches
      ) {
        return;
      }

      if (event.key !== "." && event.key !== "-" && event.key !== " ") {
        buffer.current = "";
        clearBufferTimer();
        return;
      }

      let candidate = `${buffer.current}${event.key}`.replaceAll(" ", "");
      candidate = candidate.slice(-handshake.length);

      while (candidate && !handshake.startsWith(candidate)) {
        candidate = candidate.slice(1);
      }

      buffer.current = candidate;
      resetBufferSoon();

      if (candidate === handshake) {
        buffer.current = "";
        clearBufferTimer();
        receive();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearBufferTimer();
      clearHideTimer();
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.documentElement.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const sitePage = document.querySelector<HTMLElement>("[data-site-page]");
    const previousInert = sitePage?.inert ?? false;
    const focusFrame = window.requestAnimationFrame(() => {
      clearButton.current?.focus({ preventScroll: true });
    });

    document.documentElement.style.overflow = "hidden";
    if (sitePage) sitePage.inert = true;

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.documentElement.style.overflow = previousOverflow;
      if (sitePage) sitePage.inert = previousInert;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [visible]);

  return (
    <div className={styles.receiver}>
      <AnimatePresence initial={false} mode="wait">
        {visible ? (
          <motion.aside
            className={styles.transmission}
            key={transmission}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cw-title"
            aria-describedby="cw-summary"
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;

              event.preventDefault();
              clearButton.current?.focus();
            }}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, clipPath: "inset(0 0 0 100%)" }
            }
            animate={{ opacity: 1, clipPath: "inset(0 0 0 0%)" }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, clipPath: "inset(0 0 0 100%)" }
            }
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <header className={styles.header}>
              <span>73KIT / CW RECEIVE</span>
              <span className={styles.status}>Signal complete</span>
              <button
                ref={clearButton}
                type="button"
                onClick={() => setVisible(false)}
              >
                Clear <kbd>Esc</kbd>
              </button>
            </header>

            <div className={styles.readout}>
              <dl className={styles.metadata}>
                <div>
                  <dt>Input</dt>
                  <dd>Keyboard</dd>
                </div>
                <div>
                  <dt>Mode</dt>
                  <dd>CW</dd>
                </div>
                <div>
                  <dt>Decode</dt>
                  <dd>SOS</dd>
                </div>
              </dl>

              <section className={styles.signal} aria-labelledby="cw-title">
                <p>Incoming transmission</p>
                <h2 id="cw-title">
                  Signal
                  <br />
                  <em>received.</em>
                </h2>

                <div className={styles.morse} aria-hidden="true">
                  <i className={styles.dot} />
                  <i className={styles.dot} />
                  <i className={styles.dot} />
                  <i className={styles.dash} />
                  <i className={styles.dash} />
                  <i className={styles.dash} />
                  <i className={styles.dot} />
                  <i className={styles.dot} />
                  <i className={styles.dot} />
                </div>
                <p
                  id="cw-summary"
                  className={styles.decoded}
                  aria-label="Decoded message: SOS"
                >
                  <span>S</span>
                  <span>O</span>
                  <span>S</span>
                </p>
              </section>
            </div>

            <footer className={styles.footer}>
              <p>Situation seems less urgent than advertised.</p>
              <span>No audio / on purpose</span>
            </footer>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
