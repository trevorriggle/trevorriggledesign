import type { PopulatedSection } from "@/content";
import styles from "./SectionHead.module.css";

export function SectionHead({
  section,
  headingLevel: H = "h2",
}: {
  section: PopulatedSection;
  headingLevel?: "h1" | "h2";
}) {
  const count = section.entries.length;

  return (
    <div className={styles.head}>
      <p className={styles.ordinal} aria-hidden="true">
        {section.ordinal}
      </p>

      <div className={styles.body}>
        <H className={styles.title}>{section.title}</H>
        {/* TODO in content/sections.ts. Left visible so the gap is obvious. */}
        <p className={styles.standfirst}>{section.standfirst}</p>
      </div>

      <div className={styles.meta}>
        <span>{section.years}</span>
        <span>
          {count} {section.kind === "case" ? "case stud" : "set"}
          {section.kind === "case" ? (count === 1 ? "y" : "ies") : count === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}
