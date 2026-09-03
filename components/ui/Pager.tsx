import Link from "next/link";
import type { CaseStudy } from "@/content";
import styles from "./Pager.module.css";

export function Pager({ prev, next }: { prev: CaseStudy | null; next: CaseStudy | null }) {
  if (!prev && !next) return null;

  return (
    <nav className={styles.pager} aria-label="Work running order">
      {prev ? (
        <Link href={prev.href} className={`${styles.link} ${styles.prev}`}>
          <span className={styles.dir}>← Previous</span>
          <span className={styles.title}>{prev.title}</span>
          <span className={styles.section}>
            {prev.year}
          </span>
        </Link>
      ) : (
        <span className={styles.spacer} />
      )}

      {next ? (
        <Link href={next.href} className={`${styles.link} ${styles.next}`}>
          <span className={styles.dir}>Next →</span>
          <span className={styles.title}>{next.title}</span>
          <span className={styles.section}>{next.year}</span>
        </Link>
      ) : (
        <span className={styles.spacer} />
      )}
    </nav>
  );
}
