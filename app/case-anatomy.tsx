"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import styles from "./case-files.module.css";

const anatomy = {
  sablebook: [
    ["Message", "“Friday afternoon, same person.”"],
    ["Missing", "Service · time · location · staff · availability · deposit"],
    ["Decision", "Ask, check, then confirm."],
  ],
  radio: [
    ["Bytes", "73 4B 00 73 4B 00"],
    ["Understand", "Parse the Codeplug into settings."],
    ["Check", "Identity · compatibility · backup · exact changes"],
    ["Write", "Not before the backup."],
  ],
} as const;

type CaseAnatomyProps = {
  kind: keyof typeof anatomy;
  summary: string;
};

export function CaseAnatomy({ kind, summary }: CaseAnatomyProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.underSkin} data-kind={kind} data-open={open || undefined}>
      <button
        className={styles.anatomyTrigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <span>What I built</span>
        <p>{summary}</p>
        <small>
          {open ? "Close inspection" : "Inspect the system"}
          <i aria-hidden="true">{open ? "−" : "+"}</i>
        </small>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            className={styles.anatomyPanel}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <ol>
              {anatomy[kind].map(([label, value], index) => (
                <motion.li
                  key={label}
                  initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.08 + index * 0.09,
                    duration: reduceMotion ? 0 : 0.28,
                  }}
                >
                  <span>{label}</span>
                  <p>{value}</p>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
