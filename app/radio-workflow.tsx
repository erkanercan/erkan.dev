"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import mark73Kit from "../public/case-files/73kit-mark.svg";
import styles from "./case-files.module.css";

const steps = [
  ["Read", "the full radio"],
  ["Back up", "the untouched baseline"],
  ["Edit", "the working Codeplug"],
  ["Review", "the exact change set"],
  ["Write", "to the verified source radio"],
] as const;

type WorkflowStyle = CSSProperties & { "--workflow-progress": string };

export function RadioWorkflow() {
  const [activeStep, setActiveStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const timers = useRef<number[]>([]);
  const reduceMotion = useReducedMotion();

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const run = () => {
    if (running) return;

    clearTimers();
    setRunning(true);
    setComplete(false);
    setActiveStep(-1);

    if (reduceMotion) {
      setActiveStep(steps.length - 1);
      setComplete(true);
      setRunning(false);
      return;
    }

    steps.forEach((_, index) => {
      timers.current.push(
        window.setTimeout(() => setActiveStep(index), 180 + index * 520),
      );
    });

    timers.current.push(
      window.setTimeout(() => {
        setComplete(true);
        setRunning(false);
      }, 180 + steps.length * 520),
    );
  };

  const progress = activeStep < 0 ? 0 : (activeStep / (steps.length - 1)) * 86;

  return (
    <section className={styles.radioDiagram} aria-label="The Radio CPS workflow">
      <div className={styles.diagramHeader}>
        <Image src={mark73Kit} alt="" width={48} height={48} />
        <div>
          <span>73Kit / Radio CPS</span>
          <p>Local-first radio programming</p>
        </div>
        <button type="button" onClick={run} disabled={running}>
          {running ? "Checking" : complete ? "Run again" : "Run sequence"}
        </button>
      </div>

      <ol
        className={styles.workflow}
        style={{ "--workflow-progress": `${progress}%` } as WorkflowStyle}
      >
        {steps.map(([label, detail], index) => {
          const active = index <= activeStep;
          const current = index === activeStep;
          const writeLocked = index === steps.length - 1 && activeStep < index;

          return (
            <li
              key={label}
              data-active={active || undefined}
              data-current={current || undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
              <small>{writeLocked ? "locked until review" : detail}</small>
            </li>
          );
        })}
      </ol>

      <p className={styles.sequenceStatus} aria-live="polite">
        {complete
          ? "Reasonable confidence achieved."
          : activeStep >= 0
            ? `${steps[activeStep][0]} checked.`
            : "Nothing moves until you ask it to."}
      </p>

      <p className={styles.byteLine} aria-hidden="true">
        {Array.from({ length: 56 }, (_, index) => (
          <span key={index}>{index % 3 === 0 ? "73" : index % 3 === 1 ? "4B" : "00"}</span>
        ))}
      </p>
      <p className={styles.diagramCaption}>
        The screen is the easy part. Under it: identity checks, compatibility
        gates, recovery artifacts, and byte-level codecs.
      </p>
    </section>
  );
}
