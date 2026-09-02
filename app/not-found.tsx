import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { getSections } from "@/content";
import grid from "@/components/ui/grid.module.css";
import styles from "./not-found.module.css";

/* A real 404: it says what happened, and then does the one useful thing a 404
   can do, which is hand over the site's index rather than a "go home" button.
   Legacy URLs from the old site are redirected in next.config.ts, so anything
   arriving here is genuinely unknown. */
export default function NotFound() {
  const sections = getSections();

  return (
    <Container className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <p className={styles.code}>Error 404 — not found</p>
          <h1 className={styles.title}>No page at this address.</h1>
          <p className={styles.lead}>
            The link may be from an older version of this site. The full index
            is on the right; <Link href="/work">all work</Link> is one click
            away.
          </p>
        </div>

        <div className={`${styles.rail} ${grid.railRuled}`}>
          <p className={styles.railLabel}>Index</p>
          <SectionIndex sections={sections} />
        </div>
      </div>
    </Container>
  );
}
