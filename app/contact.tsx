import styles from "./contact.module.css";

export function Contact() {
  return (
    <section className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p>04 / Contact</p>
          <p>Email works best</p>
        </header>

        <div className={styles.message}>
          <h2 id="contact-title">
            Have a mess worth
            <br />
            <em>examining?</em>
          </h2>
          <p>Send me the messy version. We can figure out whether code would help.</p>
        </div>

        <address className={styles.address}>
          <a className={styles.email} href="mailto:erkanercandev@gmail.com">
            <span>erkanercandev@gmail.com</span>
            <span aria-hidden="true">↗</span>
          </a>

          <div className={styles.socials}>
            <a
              href="https://github.com/erkanercan"
              target="_blank"
              rel="noreferrer"
            >
              <span>GitHub</span>
              <small>
                @erkanercan <span aria-hidden="true">↗</span>
              </small>
            </a>
            <a
              href="https://www.linkedin.com/in/erkan-ercan/"
              target="_blank"
              rel="noreferrer"
            >
              <span>LinkedIn</span>
              <small>
                Erkan Ercan <span aria-hidden="true">↗</span>
              </small>
            </a>
          </div>
        </address>

        <footer className={styles.footer}>
          <p>© Erkan Ercan / 2026</p>
        </footer>
      </div>
    </section>
  );
}
