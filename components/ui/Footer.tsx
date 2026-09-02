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
            {/* TODO: one line. What you do, stated plainly. */}
            <p className={styles.line}>TODO</p>
          </div>

          <div className={styles.elsewhere}>
            <h2 className={styles.heading}>Elsewhere</h2>
            {site.social.length === 0 ? (
              <p className={styles.metaLine}>
                TODO — add profiles in lib/site.ts
              </p>
            ) : (
              <ul className={styles.list}>
                {site.social.map((s) => (
                  <li key={s.href}>
                    <ExternalLink href={s.href}>{s.label}</ExternalLink>
                  </li>
                ))}
              </ul>
            )}
          </div>

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
