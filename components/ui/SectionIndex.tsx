import Link from "next/link";
import type { PopulatedSection } from "@/content";
import styles from "./SectionIndex.module.css";

export function SectionIndex({ sections }: { sections: PopulatedSection[] }) {
  return (
    <ol className={styles.index}>
      {sections.map((section) => {
        const count = section.entries.length;
        return (
          <li
            key={section.id}
            className={[styles.row, count === 0 && styles.vacant]
              .filter(Boolean)
              .join(" ")}
          >
            <Link href={`/work#${section.id}`} className={styles.link}>
              <span className={styles.ordinal} aria-hidden="true">
                {section.ordinal}
              </span>
              <span className={styles.title}>{section.title}</span>
              <span className={styles.years}>{section.years}</span>
              <span className={styles.count}>
                {count === 0 ? "—" : count}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
