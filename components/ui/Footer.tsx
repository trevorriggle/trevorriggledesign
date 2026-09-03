import { Container } from "./Container";
import { ExternalLink } from "./ExternalLink";
import { site } from "@/lib/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.identity}>
            <p className={styles.name}>{site.name}</p>
          </div>

          {/* Renders only when there is somewhere to send people. An
              "Elsewhere" heading over a prompt to fill it in is a note to the
              author printed on the visitor's page. */}
          {site.social.length > 0 && (
            <div className={styles.elsewhere}>
              <h2 className={styles.heading}>Elsewhere</h2>
              <ul className={styles.list}>
                {site.social.map((s) => (
                  <li key={s.href}>
                    <ExternalLink href={s.href}>{s.label}</ExternalLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.meta}>
            <p className={styles.metaLine}>
              {site.domain}
              <br />
              © {new Date().getFullYear()}
              <br />
              Set in Fraunces &amp; IBM Plex
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
