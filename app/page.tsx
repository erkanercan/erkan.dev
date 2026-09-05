import { CaseFiles } from "./case-files";
import { Contact } from "./contact";
import { InteractiveHero } from "./interactive-hero";
import styles from "./page.module.css";
import { Worldview } from "./worldview";

export default function Home() {
  return (
    <main className={styles.page}>
      <InteractiveHero />
      <div className={styles.continuation}>
        <CaseFiles />
        <Worldview />
        <Contact />
      </div>
    </main>
  );
}
