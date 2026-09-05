import { CaseFiles } from "./case-files";
import { Contact } from "./contact";
import { InteractiveHero } from "./interactive-hero";
import { Worldview } from "./worldview";

export default function Home() {
  return (
    <main>
      <InteractiveHero />
      <CaseFiles />
      <Worldview />
      <Contact />
    </main>
  );
}
