import type { ReactNode } from "react";
import styles from "./SectionHead.module.css";

/* ============================================================================
   SECTION HEAD
   ============================================================================
   The brief's "hairline rules" and one heading treatment, as one element, so
   that every section on the site opens the same way.

   THERE IS NO ORDINAL ANY MORE. Every section head on the site used to open
   with a two-digit index, 00 through 05, passed in per page. They are gone
   site-wide, by instruction, along with the row that held one beside the
   title and the phone rule that dropped it onto its own line. The heading is
   the heading.

   The anchor is unaffected: `id` was never the number, for the same reason a
   URL should not renumber itself when a section is inserted above it.

   THE INTRO IS THE SERIF, AND IT IS THE ONLY PLACE IT APPEARS BESIDES A PULL
   QUOTE. `.intro` is a global utility in styles/typography.css, which is the
   only file that assigns --font-quote. See that file's header for why the
   rationing is enforced there rather than by convention.
   ========================================================================= */

export function SectionHead({
  title,
  /** One or two sentences in the serif. Renders nothing when absent. */
  intro,
  /** The anchor target, for a subnav that scrolls to this section. */
  id,
  /** Heading level. A page's top-level sections are h2 under its h1. */
  as: Tag = "h2",
  children,
}: {
  title: string;
  intro?: ReactNode;
  id?: string;
  as?: "h2" | "h3";
  children?: ReactNode;
}) {
  return (
    <header className={styles.head} id={id}>
      <div className={styles.rule} aria-hidden="true" />

      <Tag className={styles.title}>{title}</Tag>

      {intro && <p className={`intro ${styles.intro}`}>{intro}</p>}
      {children}
    </header>
  );
}
