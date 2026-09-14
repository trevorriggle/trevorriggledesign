import type { ReactNode } from "react";
import styles from "./PullQuote.module.css";

/* ============================================================================
   PULL QUOTE
   ============================================================================
   Instrument Serif, large, on an ochre field. One of the two places the serif
   is allowed to appear at all; the other is a section intro.

   IT IS INK ON OCHRE, NOT OCHRE ON PAPER, AND THAT IS A CORRECTION TO THE
   BRIEF. Ochre was specified as the colour of pull quotes. It measures 2.00:1
   against the paper ground, which fails every contrast threshold at every
   size, so a pull quote set in it is a sentence nobody can read set at the
   largest size on the page. Inverting it keeps the colour at full strength,
   makes it MORE prominent rather than less, and the type lands at 8.67:1. The
   full measured table is in tokens.css.

   IT IS A <figure>, NOT A <blockquote>, UNLESS IT IS QUOTING SOMEBODY. A pull
   quote is normally a sentence lifted out of the surrounding copy for
   emphasis, and that is the author's own voice repeated, not a quotation. Pass
   `cite` and it becomes a real <blockquote> with an attribution, which is the
   case where the semantics earn their keep.

   RATION IT. One per page. The point of a pull quote is that it is the one
   sentence somebody remembers; two of them is a page with no argument and a
   decorating problem.
   ========================================================================= */

export function PullQuote({
  children,
  /** Who said it. Present means this is a real quotation, see above. */
  cite,
  /** The field colour. `ochre` is the default and the loud one. */
  ground = "ochre",
}: {
  children: ReactNode;
  cite?: string;
  ground?: "ochre" | "ink" | "ultramarine";
}) {
  const body = <p className={`quote ${styles.text}`}>{children}</p>;

  if (cite) {
    return (
      <figure data-ground={ground} className={styles.field}>
        <blockquote className={styles.block}>{body}</blockquote>
        <figcaption className={`label ${styles.cite}`}>{cite}</figcaption>
      </figure>
    );
  }

  return (
    <aside data-ground={ground} className={styles.field}>
      {body}
    </aside>
  );
}
