import Image from "next/image";
import mark73Kit from "../public/case-files/73kit-mark.svg";
import sablebookOverview from "../public/case-files/sablebook-overview.webp";
import styles from "./case-files.module.css";

const sablebookFacts = [
  [
    "Had to stay true",
    "The customer stays in WhatsApp. Staff keep control of exceptions. Confirmed means the conversation, calendar, and payment state agree.",
  ],
  [
    "The uncomfortable bit",
    "Keep the core open enough for other organizations without turning the salon product into a bag of generic settings.",
  ],
  [
    "The decision I stand by",
    "Sablebook can mutate. It starts with salons, but the architecture is not welded to salons.",
  ],
  [
    "What exists now",
    "Booking, calendar, reviews, customers, payments, analytics, and conversations in one operating view.",
  ],
] as const;

const radioFacts = [
  [
    "Had to stay true",
    "Radio data stays on the computer. A clean backup exists before editing. Dangerous actions remain obvious.",
  ],
  [
    "The uncomfortable bit",
    "Firmware updates. Every version, interruption point, and recovery path needed evidence on real hardware. “It passed once” meant nothing.",
  ],
  [
    "The decision I stand by",
    "Build it as a radio operator, for radio operators — without the dinosaur mentality.",
  ],
  [
    "What exists now",
    "Radio CPS reads, backs up, edits, reviews, and writes a complete Codeplug directly in the browser.",
  ],
] as const;

function EvidenceList({
  items,
}: {
  items: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <dl className={styles.evidenceList}>
      {items.map(([label, value], index) => (
        <div key={label}>
          <dt>
            <span>0{index + 1}</span>
            {label}
          </dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CaseFiles() {
  return (
    <section className={styles.caseFiles} aria-labelledby="case-files-title">
      <header className={styles.sectionHeader}>
        <p>Case files</p>
        <h2 id="case-files-title">
          Built things,
          <br />
          <em>opened up.</em>
        </h2>
        <p className={styles.sectionIntro}>
          Two projects. I designed, architected, and built both. Here is what
          the tidy screenshots leave out.
        </p>
      </header>

      <article className={`${styles.case} ${styles.sablebook}`} id="sablebook-case">
        <header className={styles.caseHeader}>
          <p className={styles.caseNumber}>Sablebook / Case file</p>
          <h3>
            The booking is a conversation.
            <br />
            <em>The calendar is not.</em>
          </h3>
          <p className={styles.caseLead}>
            A WhatsApp message can say “Friday afternoon, same person as last
            time.” The business still needs a service, duration, location,
            staff member, price, availability, and sometimes a deposit.
          </p>
        </header>

        <div className={styles.sablebookBody}>
          <figure className={styles.productFrame}>
            <div className={styles.browserBar} aria-hidden="true">
              <span />
              <span />
              <span />
              <p>sablebook / operator view</p>
            </div>
            <Image
              src={sablebookOverview}
              alt="Sablebook's salon operations overview, showing booking decisions, conversations, and payments that need attention"
              sizes="(max-width: 900px) 100vw, 62vw"
              placeholder="blur"
            />
            <figcaption>
              The operator view gathers bookings, conversations, payments, and
              decisions that need staff attention.
            </figcaption>
          </figure>

          <div className={styles.caseNotes}>
            <p className={styles.marginNote}>My part / everything</p>
            <EvidenceList items={sablebookFacts} />
            <div className={styles.underSkin}>
              <span>What I built</span>
              <p>
                Gather the missing details, check real availability, handle
                changes, and ask a human when certainty runs out.
              </p>
            </div>
          </div>
        </div>

        <footer className={styles.caseFooter}>
          <div>
            <span>If I restarted today</span>
            <p>
              I would finish one complete salon workflow first, then generalize
              only what proved reusable.
            </p>
          </div>
          <a href="https://sablebook.com" target="_blank" rel="noreferrer">
            Visit Sablebook <span aria-hidden="true">↗</span>
          </a>
        </footer>
      </article>

      <article className={`${styles.case} ${styles.radio}`} id="73kit-case">
        <header className={styles.caseHeader}>
          <p className={styles.caseNumber}>73Kit / Radio CPS</p>
          <h3>
            A friendlier face for
            <br />
            <em>very unforgiving bytes.</em>
          </h3>
          <p className={styles.caseLead}>
            Radio software often asks you to trust a cable, an old manual, and
            a button called Write. 73Kit starts somewhere less exciting: make a
            backup and know exactly what is connected.
          </p>
        </header>

        <div className={styles.radioBody}>
          <div className={styles.radioDiagram} aria-label="The Radio CPS workflow">
            <div className={styles.diagramHeader}>
              <Image src={mark73Kit} alt="" width={48} height={48} />
              <div>
                <span>73Kit / Radio CPS</span>
                <p>Local-first radio programming</p>
              </div>
              <span className={styles.localBadge}>Local only</span>
            </div>
            <ol className={styles.workflow}>
              <li>
                <span>01</span>
                <strong>Read</strong>
                <small>the full radio</small>
              </li>
              <li>
                <span>02</span>
                <strong>Back up</strong>
                <small>the untouched baseline</small>
              </li>
              <li>
                <span>03</span>
                <strong>Edit</strong>
                <small>the working Codeplug</small>
              </li>
              <li>
                <span>04</span>
                <strong>Review</strong>
                <small>the exact Change Set</small>
              </li>
              <li>
                <span>05</span>
                <strong>Write</strong>
                <small>to the verified source radio</small>
              </li>
            </ol>
            <p className={styles.byteLine} aria-hidden="true">
              {Array.from({ length: 56 }, (_, index) => (
                <span key={index}>{index % 3 === 0 ? "73" : index % 3 === 1 ? "4B" : "00"}</span>
              ))}
            </p>
            <p className={styles.diagramCaption}>
              The screen is the easy part. Under it: identity checks,
              compatibility gates, recovery artifacts, and byte-level codecs.
            </p>
          </div>

          <div className={styles.caseNotes}>
            <p className={styles.marginNote}>My part / everything</p>
            <EvidenceList items={radioFacts} />
            <div className={styles.underSkin}>
              <span>What I built</span>
              <p>
                Web Serial, compatibility checks, recovery paths, source-radio
                identity, and a refusal to turn “probably fine” into a Write button.
              </p>
            </div>
          </div>
        </div>

        <footer className={styles.caseFooter}>
          <div>
            <span>If I restarted today</span>
            <p>
              I would build the interruption matrix and collect recovery
              fixtures before touching the updater UI.
            </p>
          </div>
          <a href="https://73kit.erkan.dev" target="_blank" rel="noreferrer">
            Open 73Kit <span aria-hidden="true">↗</span>
          </a>
        </footer>
      </article>
    </section>
  );
}
