import type { ReactNode } from "react";
import styles from "./SectionHead.module.css";

/* ============================================================================
   SECTION HEAD, numbered.
   ============================================================================
   The brief's "numbered sections" and "hairline rules", as one element, so
   that every section on the site opens the same way and the numbering cannot
   drift into six different treatments across four pages.

   THE NUMBER IS NOT CONTENT. It is `aria-hidden`, because a heading that
   reads "zero one Rebrand" to a screen reader is worse than one that reads
   "Rebrand": the ordinal is a visual index for someone scanning a page, and a
   screen reader user is not scanning, they are being read to in order. The
   number is also never used as the anchor, for the same reason a URL should
   not renumber itself when a section is inserted above it.

   THE NUMBER IS PASSED IN, NOT COUNTED. A component that counts its own
   instances would number them by render order, and the running order of a
   page is a decision, not an accident of where a component happens to sit.

   THE INTRO IS THE SERIF, AND IT IS THE ONLY PLACE IT APPEARS BESIDES A PULL
   QUOTE. `.intro` is a global utility in styles/typography.css, which is the
   only file that assigns --font-quote. See that file's header for why the
   rationing is enforced there rather than by convention.
   ========================================================================= */

export function SectionHead({
  /** The visual index. "01", "02". Decorative, see above. */
  number,
  title,
  /** One or two sentences in the serif. Renders nothing when absent. */
  intro,
  /** The anchor target, for a subnav that scrolls to this section. */
  id,
  /** Heading level. A page's top-level sections are h2 under its h1. */
  as: Tag = "h2",
  children,
}: {
  number?: string;
  title: string;
  intro?: ReactNode;
  id?: string;
  as?: "h2" | "h3";
  children?: ReactNode;
}) {
  return (
    <header className={styles.head} id={id}>
      <div className={styles.rule} aria-hidden="true" />

      <div className={styles.row}>
        {number && (
          <span className={`ordinal ${styles.number}`} aria-hidden="true">
            {number}
          </span>
        )}
        <Tag className={styles.title}>{title}</Tag>
      </div>

      {intro && <p className={`intro ${styles.intro}`}>{intro}</p>}
      {children}
    </header>
  );
}
