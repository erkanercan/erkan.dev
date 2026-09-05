import { CaseFiles } from "./case-files";
import { ConsoleEasterEgg } from "./console-easter-egg";
import { Contact } from "./contact";
import { InteractiveHero } from "./interactive-hero";
import styles from "./page.module.css";
import { RadioHandshake } from "./radio-handshake";
import { Worldview } from "./worldview";

export default function Home() {
  return (
    <main className={styles.page}>
      <ConsoleEasterEgg />
      <RadioHandshake />
      <InteractiveHero />
      <div className={styles.continuation}>
        <CaseFiles />
        <Worldview />
        <Contact />
      </div>
    </main>
  );
}
