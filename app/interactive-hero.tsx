"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import xrayPortrait from "../public/character/xray-anatomy.webp";
import { GazeCharacter } from "./gaze-character";
import styles from "./interactive-hero.module.css";

const challenges = {
  booking: {
    label: "Booking chaos",
    detail: "12 chats · 3 calendars · nobody knows what is confirmed",
    product: "Sablebook",
    href: "https://sablebook.com",
    linkLabel: "Visit Sablebook",
    layers: [
      ["What people need", "Book without learning another app"],
      ["Cannot break", "Conversation can improvise. Business rules cannot."],
      ["Under the skin", "Calendar, payments and operations stay in agreement."],
    ],
  },
  radio: {
    label: "A radio manual from 1997",
    detail: "binary formats · mysterious buttons · one expensive mistake",
    product: "73Kit · Radio CPS",
    href: "https://73kit.erkan.dev",
    linkLabel: "Open 73Kit",
    layers: [
      ["What people need", "Change the radio without fearing the radio"],
      ["Cannot break", "Local data stays local. Dangerous actions stay explicit."],
      ["Under the skin", "Bytes, codecs and compatibility checks work underneath."],
    ],
  },
  light: {
    label: "A light that needs strangers",
    detail: "one shared light · strangers taking shifts · a sleeping dog",
    product: "ON · Keep the Light On",
    href: "https://on.erkan.dev",
    linkLabel: "Keep the light on",
    layers: [
      ["What people need", "Keep one unnecessary light on together"],
      ["Cannot break", "Every visitor must see the same honest state."],
      [
        "Under the skin",
        "WebSockets, expiring leases and one Durable Object keep everyone in agreement.",
      ],
    ],
  },
} as const;

type ChallengeId = keyof typeof challenges;

export function InteractiveHero() {
  const [selected, setSelected] = useState<ChallengeId | null>(null);
  const [closing, setClosing] = useState(false);
  const challenge = selected ? challenges[selected] : null;
  const closeTimer = useRef<number | null>(null);
  const xrayTitle = useRef<HTMLHeadingElement>(null);
  const lastSelected = useRef<ChallengeId | null>(null);
  const returningToChoices = useRef(false);
  const choiceButtons = useRef<Partial<Record<ChallengeId, HTMLButtonElement | null>>>({});

  useEffect(() => {
    if (selected) {
      xrayTitle.current?.focus({ preventScroll: true });
      return;
    }

    if (returningToChoices.current && lastSelected.current) {
      choiceButtons.current[lastSelected.current]?.focus({ preventScroll: true });
      returningToChoices.current = false;
    }
  }, [selected]);

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
      }
    };
  }, []);

  const inspect = (id: ChallengeId) => {
    setClosing(false);
    lastSelected.current = id;
    setSelected(id);
  };

  const reset = () => {
    returningToChoices.current = true;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setSelected(null);
      setClosing(false);
      closeTimer.current = null;
    }, 360);
  };

  return (
    <section
      className={styles.hero}
      data-hero
      data-xray={challenge ? "true" : undefined}
      aria-label="Introduction"
    >
      <header className={styles.header}>
        <Link className={styles.wordmark} href="/" aria-label="Erkan Ercan, home">
          Erkan Ercan<span>.</span>
        </Link>
      </header>

      <div className={styles.portrait}>
        <GazeCharacter paused={Boolean(challenge)} />
        <Image
          className={styles.xrayPortrait}
          src={xrayPortrait}
          alt={
            challenge
              ? "A stylized portrait split between skin and anatomical layers"
              : ""
          }
          sizes="100vw"
          placeholder="blur"
        />
      </div>

      <p className={styles.srOnly} aria-live="polite">
        {challenge
          ? `${challenge.product} X-ray open.`
          : "Choose a problem to inspect."}
      </p>

      {challenge ? (
        <section
          className={styles.result}
          data-closing={closing || undefined}
          aria-labelledby="xray-title"
        >
          <div className={styles.inputCard}>
            <p className={styles.kicker}>The mess</p>
            <h2>{challenge.label}</h2>
            <p>{challenge.detail}</p>
          </div>

          <div className={styles.xrayPanel}>
            <div className={styles.panelContent}>
              <p className={styles.kicker}>{`Product X-ray · ${challenge.product}`}</p>
              <h1 id="xray-title" ref={xrayTitle} tabIndex={-1}>
                What had to<br />stay <em>true.</em>
              </h1>
            </div>
            <div className={styles.layers}>
              {challenge.layers.map(([label, value], index) => (
                <div key={label}>
                  <span>0{index + 1} · {label}</span>
                  <p>{value}</p>
                </div>
              ))}
            </div>
            <div className={styles.actions}>
              <a
                className={styles.projectLink}
                href={challenge.href}
                target="_blank"
                rel="noreferrer"
              >
                {challenge.linkLabel} <span aria-hidden="true">↗</span>
              </a>
              <button type="button" onClick={reset} disabled={closing}>
                Another mess <span aria-hidden="true">↺</span>
              </button>
            </div>
          </div>

          <p className={styles.status}>
            Mode 02 · Looking underneath
          </p>
        </section>
      ) : (
        <section className={styles.intro} aria-labelledby="hero-title">
          <p className={styles.kicker}>
            I build software for complicated, slightly stubborn problems.
          </p>
          <h1 id="hero-title">
            Give me<br />a <em>mess.</em>
          </h1>
          <p className={styles.instruction}>
            Pick one. I’ll show you what sits underneath.
          </p>
          <div className={styles.choices} aria-label="Choose a problem to inspect">
            {(Object.keys(challenges) as ChallengeId[]).map((id) => (
              <button
                key={id}
                data-boredom-target={id === "light" ? "true" : undefined}
                ref={(button) => {
                  choiceButtons.current[id] = button;
                }}
                type="button"
                onClick={() => inspect(id)}
              >
                {challenges[id].label}
              </button>
            ))}
          </div>
          <p className={styles.status}>Mode 01 · Waiting for a problem</p>
        </section>
      )}
    </section>
  );
}
