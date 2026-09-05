import { CaseFiles } from "./case-files";
import { ConsoleEasterEgg } from "./console-easter-egg";
import { Contact } from "./contact";
import { DogInterruption } from "./dog-interruption";
import { InteractiveHero } from "./interactive-hero";
import styles from "./page.module.css";
import { RadioHandshake } from "./radio-handshake";
import { Worldview } from "./worldview";

export default function Home() {
  return (
    <>
      <RadioHandshake />
      <main className={styles.page} data-site-page>
        <ConsoleEasterEgg />
        <DogInterruption />
        <InteractiveHero />
        <div className={styles.continuation}>
          <CaseFiles />
          <Worldview />
          <Contact />
        </div>
      </main>
    </>
  );
}
