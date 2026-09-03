import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { getSections } from "@/content";
import grid from "@/components/ui/grid.module.css";
import styles from "./not-found.module.css";

/* Copy: portfolio-copy.md → "404", verbatim and complete — the heading, the
   line under it, and the label on the link out. There is no invented
   "Error 404 — not found" chrome above it any more; the copy is the page.

   The index rail stays, because handing over the site's index is the one
   useful thing a 404 can do. Legacy URLs from the old site are redirected in
   next.config.ts, so anything arriving here is genuinely unknown. */
export default function NotFound() {
  const sections = getSections();

  return (
    <Container className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <h1 className={styles.title}>Nothing here.</h1>
          <p className={styles.lead}>
            Which is at least honest.{" "}
            <Link href="/work">Back to the work →</Link>
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
