import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./Compare.module.css";

/* ============================================================================
   COMPARE, a before and an after, side by side.
   ============================================================================
   Two pictures that only mean anything next to each other. Used twice: the
   rebrand section, where it is the old mark against the new one, and the
   website case, where it is the old site against its replacement.

   IT IS TWO PICTURES, NOT A DRAG SLIDER, AND THAT IS A DECISION ABOUT THE
   ASSETS RATHER THAN A PREFERENCE. A slider needs one shared box that both
   images fill, because the handle wipes between two things occupying the same
   rectangle. The rebrand pair is 1.11 and 2.80 — a circular badge against a
   horizontal lockup. Forcing those into one box means either cropping the
   badge's ears off or letterboxing the lockup into a square with a third of
   the frame empty above and below it, and both of those damage the thing the
   section exists to show. Two frames side by side cost nothing, read at a
   glance, and carry their own labels.

   It is also, not incidentally, a server component with no JavaScript in it.
   A slider is a pointer-event handler, a drag state, a touch-action dance and
   a keyboard fallback, all so a reader can do by hand what looking at two
   pictures does for free.

   ON A PHONE IT STACKS, and the labels are what keep it legible: BEFORE sits
   on the first frame and AFTER on the second, so the order survives losing
   the left-to-right reading that carries it on a wide screen.

   ---- REDACTION ----------------------------------------------------------
   `redact` masks regions of a shot that should not be published — an account
   name, a row of resolved prices. The regions are PERCENTAGES of the image
   box, not pixels, which is the only form that stays correct: the image is
   rendered at its own aspect ratio at every width, so a panel at 17% from the
   left is over the same pixel at 320px as at 1600px.

   THE MASK IS BELT AND BRACES. A frosted panel over a screenshot is the
   readable treatment and `backdrop-filter` is what draws it, but a browser
   that does not support the property drops the declaration and renders a
   translucent rectangle over legible text, which is a redaction that does not
   redact. So the scrim is opaque enough to stand alone, and the blur is an
   enhancement on top of it. There is no configuration in which the underlying
   pixels are readable. See Compare.module.css.
   ========================================================================= */

export type CompareRedaction = {
  /** Percentages of the image box. See the note above on why not pixels. */
  left: number;
  top: number;
  width: number;
  height: number;
};

export type CompareSide = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** "Before" / "After". Rendered as the frame's own label. */
  label: string;
  /** One line under the frame saying what this shot is. */
  caption?: string;
  /** Regions to mask. Omit for a shot with nothing to hide. */
  redact?: CompareRedaction[];
  /** GIF or SVG: serve byte for byte, never through the optimiser. */
  unoptimized?: boolean;
};

function Side({ side, eager }: { side: CompareSide; eager: boolean }) {
  return (
    <figure className={styles.side}>
      <p className={`label ${styles.sideLabel}`}>{side.label}</p>

      <div
        className={styles.frame}
        style={
          { "--ratio": `${side.width} / ${side.height}` } as CSSProperties
        }
      >
        <Image
          src={side.src}
          alt={side.alt}
          width={side.width}
          height={side.height}
          sizes="(max-width: 52rem) 100vw, 45vw"
          /* `priority` is deprecated as of Next 16 and the docs point at
             `loading` / `fetchPriority` instead, which is what this uses. */
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          unoptimized={side.unoptimized}
          className={styles.image}
        />

        {side.redact?.map((region, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={styles.redaction}
            style={
              {
                "--left": `${region.left}%`,
                "--top": `${region.top}%`,
                "--width": `${region.width}%`,
                "--height": `${region.height}%`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {side.caption && (
        <figcaption className={styles.caption}>{side.caption}</figcaption>
      )}
    </figure>
  );
}

export function Compare({
  before,
  after,
  label,
  /** The first pair on a page is above the fold and is worth loading eagerly. */
  eager = false,
}: {
  before: CompareSide;
  after: CompareSide;
  label: string;
  eager?: boolean;
}) {
  return (
    <section className={styles.pair} aria-label={label}>
      <Side side={before} eager={eager} />
      <Side side={after} eager={eager} />
    </section>
  );
}
