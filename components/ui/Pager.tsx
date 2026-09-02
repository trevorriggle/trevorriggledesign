import Link from "next/link";
import type { Entry } from "@/content";
import styles from "./Pager.module.css";

export function Pager({ prev, next }: { prev: Entry | null; next: Entry | null }) {
  if (!prev && !next) return null;

  return (
    <nav className={styles.pager} aria-label="Work running order">
      {prev ? (
        <Link href={prev.href} className={`${styles.link} ${styles.prev}`}>
          <span className={styles.dir}>← Previous</span>
          <span className={styles.title}>{prev.title}</span>
          <span className={styles.section}>
            {prev.sectionMeta.title}
          </span>
        </Link>
      ) : (
        <span className={styles.spacer} />
      )}

      {next ? (
        <Link href={next.href} className={`${styles.link} ${styles.next}`}>
          <span className={styles.dir}>Next →</span>
          <span className={styles.title}>{next.title}</span>
          <span className={styles.section}>{next.sectionMeta.title}</span>
        </Link>
      ) : (
        <span className={styles.spacer} />
      )}
    </nav>
  );
}
