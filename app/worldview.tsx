import styles from "./worldview.module.css";
import { DogInterruptionTrigger } from "./dog-interruption";
import { WrongAdmission } from "./wrong-admission";

export function Worldview() {
  return (
    <section className={styles.worldview} aria-labelledby="worldview-title">
      <header className={styles.header}>
        <p>Enough about the work.</p>
        <h2 id="worldview-title">
          A few things I know
          <br />
          <em>about myself.</em>
        </h2>
        <p className={styles.aside}>Accuracy varies by day.</p>
      </header>

      <ul className={styles.notes} role="list">
        <li className={styles.humanity}>
          <p>
            I care about <em>humanity.</em> I also like being right. These two
            qualities do not always cooperate.
          </p>
        </li>
        <li className={styles.honesty}>
          <p>
            Honesty includes saying <WrongAdmission />
          </p>
          <small>Annoying, but useful.</small>
        </li>
        <li className={styles.craft}>
          <p>
            What I cannot stand: knowing a job is being done badly, then
            continuing to do it <em>that way.</em>
          </p>
        </li>
        <li className={styles.dogs}>
          <p>
            I like <DogInterruptionTrigger />
          </p>
          <small>This does not need a product angle.</small>
        </li>
        <li className={styles.laughter}>
          <p>
            People mostly remember the <em>laughter.</em> That seems fair.
          </p>
        </li>
        <li className={styles.experiments}>
          <p>
            Sometimes I write code because I want to know what happens. Not
            every experiment needs <em>a roadmap.</em>
          </p>
        </li>
      </ul>

    </section>
  );
}
