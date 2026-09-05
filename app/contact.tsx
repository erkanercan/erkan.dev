import styles from "./contact.module.css";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p>Contact</p>
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
          <a
            className={styles.email}
            href={`mailto:${site.email}`}
            data-umami-event="portfolio_contact_email_clicked"
          >
            <span>{site.email}</span>
            <span aria-hidden="true">↗</span>
          </a>

          <div className={styles.socials}>
            <a
              href={site.github}
              target="_blank"
              rel="me noreferrer"
              data-umami-event="portfolio_social_github_clicked"
            >
              <span>GitHub</span>
              <small>
                @erkanercan <span aria-hidden="true">↗</span>
              </small>
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="me noreferrer"
              data-umami-event="portfolio_social_linkedin_clicked"
            >
              <span>LinkedIn</span>
              <small>
                Erkan Ercan <span aria-hidden="true">↗</span>
              </small>
            </a>
            <a
              href="/erkan-ercan-resume.pdf"
              download="erkan-ercan-resume.pdf"
              data-umami-event="portfolio_resume_downloaded"
            >
              <span>Résumé</span>
              <small>
                PDF · 2 pages <span aria-hidden="true">↓</span>
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
