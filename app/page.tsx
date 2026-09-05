import { GazeCharacter } from "./gaze-character";

export default function Home() {
  return (
    <main className="hero" data-hero>
      <div className="hero-shell">
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Erkan, home">
            erkan<span>.</span>
          </a>
        </header>

        <section className="hero-content" id="top" aria-labelledby="hero-title">
          <p className="eyebrow">
            <span>Senior Frontend Engineer</span>
            <span>Creative Technologist</span>
          </p>
          <h1 id="hero-title">
            <span className="title-left">I build<br />software</span>
            <span className="title-right">that feels<br /><em>alive.</em></span>
          </h1>
          <p className="hero-description">
            I turn complicated ideas into software that feels simple, useful and
            unmistakably human.
          </p>
          <div className="hero-actions" aria-label="Introduction links">
            <a className="button button-primary" href="#work">
              See my work <span aria-hidden="true">↗</span>
            </a>
            <a className="button button-secondary" href="#about">
              About me
            </a>
          </div>

          <GazeCharacter />
          <p className="character-note">
            Move your cursor. He has opinions.
          </p>
        </section>
      </div>
    </main>
  );
}
