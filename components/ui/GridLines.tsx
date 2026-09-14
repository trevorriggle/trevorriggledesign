import styles from "./GridLines.module.css";

/* ============================================================================
   GRID LINES, the structure made visible.
   ============================================================================
   The brief asks for "visible grid structure" as texture. This draws the
   actual 12 columns the page is composed on, as hairlines, behind the content.

   IT IS DRAWN WITH THE REAL GRID, NOT A REPEATING GRADIENT. A
   `repeating-linear-gradient` is the usual way to do this and it is wrong
   here: the columns on this site are `minmax(0, 1fr)` separated by a
   `--grid-gap` that is itself a clamp, so the line positions are not a fixed
   interval and a gradient would drift out of register with the content at
   every viewport between the clamp's floor and its ceiling. Twelve real grid
   cells each drawing their own left edge cannot drift, because they ARE the
   grid the content is laid out on.

   ONE CELL PER COLUMN, AND THE FIRST EDGE IS SUPPRESSED. Twelve columns have
   eleven interior divisions. Drawing all twelve left edges would put a
   hairline hard on the container's left gutter, which reads as a border
   around the page rather than as a grid inside it, and it would be
   asymmetric, because there is no matching line on the right.

   IT IS DECORATION AND IT SAYS SO. `aria-hidden`, no text, no focusable
   child, and it sits under content that is explicitly raised. A screen reader
   is told nothing about it because there is nothing to tell.

   IT DOES NOT SURVIVE A PHONE. Below 48rem the page is one column, and twelve
   hairlines across a 375px screen is one every 31px, which is hatching rather
   than structure. It is hidden there, and the texture on a phone comes from
   the rules and the bands instead.
   ========================================================================= */

const COLUMNS = 12;

export function GridLines({
  /** Which way to tint the hairlines. `paper` on a dark ground, `ink` on a
   *  light one. Bands pass the opposite of their own colour. */
  tone = "ink",
}: {
  tone?: "ink" | "paper";
}) {
  return (
    <div aria-hidden="true" data-tone={tone} className={styles.lines}>
      {Array.from({ length: COLUMNS }, (_, i) => (
        <span key={i} className={styles.line} />
      ))}
    </div>
  );
}
