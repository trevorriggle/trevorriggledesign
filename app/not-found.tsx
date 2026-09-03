import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getSelected } from "@/content";
import { designCategories } from "@/content/design";
import grid from "@/components/ui/grid.module.css";
import styles from "./not-found.module.css";

/* Copy: portfolio-copy.md → "404", verbatim and complete, the heading, the
   line under it, and the label on the link out. There is no invented
   "Error 404, not found" chrome above it any more; the copy is the page.

   The index rail stays, because handing over the site's index is the one
   useful thing a 404 can do. Legacy URLs from the old site are redirected in
   next.config.ts, so anything arriving here is genuinely unknown. */
export default function NotFound() {
  const selected = getSelected();

  return (
    <Container className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <h1 className={styles.title}>Nothing here.</h1>
          <p className={styles.lead}>
            Which is at least honest.{" "}
            <Link href="/#applications">Back to the work →</Link>
          </p>
        </div>

        {/* The one useful thing a 404 can do is hand over the index, every
            route on the site that holds work. */}
        <div className={`${styles.rail} ${grid.railRuled}`}>
          <p className={styles.railLabel}>Index</p>
          <ul className={styles.railList}>
            {selected.map((entry) => (
              <li key={entry.slug}>
                <Link href={entry.href}>{entry.title}</Link>
              </li>
            ))}
            {designCategories.map((category) => (
              <li key={category.slug}>
                <Link href={`/design/${category.slug}`}>{category.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}
