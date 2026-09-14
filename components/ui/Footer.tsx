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
            {/* THE SIGN-OFF, and the place a reader confirms where he is.
                "Columbus Ohio" is set here rather than read from
                `site.location`, which carries the postal form, "Columbus,
                Ohio", and is what the About and Contact rails want. A byline
                and an address are not the same string. */}
            <p className={styles.name}>{`${site.name}, Columbus Ohio`}</p>
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

          {/* THE COLOPHON IS GONE. It printed the domain you are already on
              and the names of the two typefaces. Neither is information for
              a visitor deciding whether to hire someone; a colophon is a
              note from the designer to other designers. */}
        </div>
      </Container>
    </footer>
  );
}
