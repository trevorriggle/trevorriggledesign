import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./ScrollSequence.module.css";

/* ============================================================================
   SCROLL SEQUENCE
   ============================================================================
   A run of screenshots as ONE pinned object: the first is on screen when the
   block arrives, and scrolling advances it through the rest while the stage
   stays put.

   IT IS A SERVER COMPONENT WITH NO JAVASCRIPT. The whole thing is CSS
   scroll-driven animation: a `view-timeline` on the tall track, and one
   `animation-range` slice per shot. No scroll listener, no rAF loop, no
   IntersectionObserver, no hydration. A scroll-linked effect driven from JS
   runs its work on the main thread during the one interaction it decorates,
   which is why this kind of thing usually feels worse than it looks.

   THE UNENHANCED STATE IS THE DEFAULT, NOT THE FALLBACK. The base CSS in the
   stylesheet is a plain vertical stack: every screenshot in normal flow, full
   width, in order, all visible. The pinning is layered on top inside three
   stacked conditions, and if any of them fails you get the stack. That
   ordering is the whole design of this component, because the stack is the
   state that has to be right: it is what a phone gets, what Firefox gets,
   what anyone who asked for reduced motion gets, and what the printed page
   and a text browser get.

   THE THREE CONDITIONS, and why each one is there:

   1. `@supports (animation-timeline: view())`. Scroll-driven animations are
      in Chrome, Edge and Safari and are still not in Firefox. Without the
      query, Firefox would get the pinned LAYOUT with no animation driving it,
      which is a 500vh-tall block showing one screenshot and four invisible
      ones. That is the worst possible outcome and it is what you ship if you
      write the enhancement as the base.

   2. `(min-width: 62rem)`. A pinned scroll sequence on a phone is the
      riskiest thing in this brief and most of this site's readers are on one.
      It fights the address bar collapsing, it breaks momentum scrolling, and
      it strands people mid-sequence with no way to skip. Phones get the
      stack, which is genuinely the better thumb-first answer rather than a
      consolation prize: full-width screenshots you flick through.

   3. `(prefers-reduced-motion: no-preference)`. A pinned stage where the
      content changes under a stationary viewport is exactly the vestibular
      trigger the preference exists for.

   WHY A `view-timeline` AND NOT A `scroll-timeline`. The track is not a
   scroller, it is a tall block inside the document scroll. `view-timeline`
   tracks that block's own progress through the viewport, which is what this
   needs. The range is `contain`, which runs from the moment the track fully
   covers the viewport to the moment it stops doing so, and that is exactly
   the window in which the sticky stage is pinned. Using the default `cover`
   range instead would start the sequence while the block was still sliding
   into view and finish it after it had left.

   EVERY SHOT IS IN THE DOM AND IN THE ACCESSIBILITY TREE, always, in order,
   with its own alt text. The later ones are transparent rather than absent,
   so a screen reader gets every description and nothing is gated behind an
   interaction that a screen reader user is not performing.

   THE FIRST SHOT NEVER ANIMATES. It is the base layer at full opacity, and
   the others fade in over it in ascending stacking order. Each screenshot
   fully covers the one under it, so there is no cross-fade through a gap and
   no moment where two are half-visible over the page ground.

   ---- TWO LAYOUTS, AND THE SHOTS DECIDE WHICH ----------------------------
   `portrait` is the original: a tall screenshot on the left with its copy
   running beside it. It is right for phone and tablet grabs, where the shot
   leaves most of the stage's width unused and the copy can have it.

   `wide` is for full-page desktop screenshots. Those are close to 2:1, so a
   half-width column renders one at about 580px across, at which point the
   page inside it is texture rather than something you can read. In `wide` the
   screenshot takes the whole stage and the copy drops to a bar underneath it,
   which roughly doubles the rendered width. A before/after of two websites is
   worthless if you cannot read either website.

   ---- A LABEL INSTEAD OF A PLATE NUMBER ----------------------------------
   A shot may carry its own `label`, and when it does it replaces the counter.
   "01 / 05" is the right mark on a five-step walkthrough where the count is
   the information. On a two-shot comparison it is noise, and BEFORE / AFTER
   is the thing the reader actually needs.

   ---- REDACTION ----------------------------------------------------------
   Same contract as <Compare>: regions are PERCENTAGES of the image box, never
   pixels, because the shot renders at its own ratio at every width. The scrim
   is opaque on its own and the blur is an enhancement on top of it, so a
   browser without `backdrop-filter` still redacts. See Compare.tsx.

   ---- WHY THE CAPTION COLUMN CARRIES A BACKGROUND ------------------------
   Every shot is absolutely positioned at inset: 0, stacked, with only opacity
   separating them. The images cover each other because each one is painted
   over the last. The copy does not: the plate marks sit at slightly different
   heights depending on how long each caption is, so without a covering ground
   the first shot's mark is painted under all of them forever. The column
   carries the ground, so each one covers the one beneath it exactly the way
   each screenshot does.

   THE GROUND IS THE BAND'S, NOT THE PAGE'S. This block renders on paper on a
   case study page and on a colour band inside the American Scientific
   feature, so every colour here reads `--ground-*` with the page value as the
   fallback. `--ground-bg` only resolves inside a `[data-ground]` element;
   outside one the fallback is paper, which is what the work pages want. A
   hardcoded `--color-bg` here would paint two paper rectangles in the middle
   of an ultramarine section. See the grounds block in tokens.css.
   ========================================================================= */

/** Half-width of each cross-fade, as a fraction of one shot's share of the
 *  track. 0.3 leaves each screenshot fully settled for most of its slice
 *  rather than permanently in transit between two states. */
const FADE = 0.3;

export type SequenceRedaction = {
  /** Percentages of the image box. See the note above on why not pixels. */
  left: number;
  top: number;
  width: number;
  height: number;
};

export type SequenceShot = {
  /** Resolved public URL. */
  url: string;
  alt: string;
  /** Intrinsic size, so the stage reserves its box before the file lands. */
  width: number;
  height: number;
  caption?: string;
  /** "Before" / "After". Replaces the plate number when present. */
  label?: string;
  /** Regions to mask. Omit for a shot with nothing to hide. */
  redact?: SequenceRedaction[];
  /** GIF or SVG: serve byte for byte, never through the optimiser. */
  unoptimized?: boolean;
};

export function ScrollSequence({
  shots,
  label,
  /** `wide` for full-page desktop grabs. See the note above. */
  layout = "portrait",
  /** The first shot is the block's LCP candidate on the case study page. */
  priorityFirst = false,
}: {
  shots: SequenceShot[];
  label: string;
  layout?: "portrait" | "wide";
  priorityFirst?: boolean;
}) {
  if (shots.length < 2) return null;

  const count = shots.length;
  const sizes =
    layout === "wide"
      ? "(max-width: 62rem) 100vw, (max-width: 90rem) 90vw, 80rem"
      : "(max-width: 62rem) 100vw, 34rem";

  return (
    <section
      className={`${styles.track} ${styles[layout]}`}
      style={{ "--n": count } as CSSProperties}
      aria-label={label}
    >
      <div className={styles.stage}>
        <ol className={styles.shots}>
          {shots.map((shot, i) => {
            /* The window in which this shot takes over, as a percentage of
               the track's `contain` range. Computed here rather than in a
               calc() so the numbers are readable and so `animation-range`
               never has to parse arithmetic.

               THE FIRST SHOT GETS NO WINDOW AT ALL. It is the base layer and
               the stylesheet gives it `animation: none`, so a range would be
               inert, and the arithmetic would produce a negative start that
               is not a value `animation-range` accepts. Emitting nothing is
               both tidier and one less thing for a parser to reject. */
            const centre = (i / count) * 100;
            const half = (100 / count) * FADE;

            const style: Record<string, string | number> = { "--i": i };
            if (i > 0) {
              style["--from"] = `${(centre - half).toFixed(2)}%`;
              style["--to"] = `${(centre + half).toFixed(2)}%`;
            }

            return (
              <li
                key={shot.url}
                className={styles.shot}
                style={style as CSSProperties}
              >
                <div className={styles.figure}>
                  {/* THE BOX IS THE PICTURE'S OWN SHAPE, declared per shot as
                      a bare ratio. Two things depend on it. The redactions are
                      positioned in percentages, so the box must never be a
                      different shape from the image inside it at any width.
                      And the stylesheet bounds the box on BOTH axes by
                      multiplying a height cap by this number, which is the
                      only way to cap a screenshot's height without leaving
                      letterbox bars down its sides. */}
                  <div
                    className={styles.plate}
                    style={
                      { "--ar": shot.width / shot.height } as CSSProperties
                    }
                  >
                    <Image
                      src={shot.url}
                      alt={shot.alt}
                      width={shot.width}
                      height={shot.height}
                      sizes={sizes}
                      /* `priority` is deprecated as of Next 16; the docs point
                         at `loading` and `fetchPriority` instead. */
                      loading={priorityFirst && i === 0 ? "eager" : "lazy"}
                      fetchPriority={priorityFirst && i === 0 ? "high" : "auto"}
                      decoding="async"
                      unoptimized={shot.unoptimized}
                      className={styles.image}
                    />

                    {shot.redact?.map((region, r) => (
                      <span
                        key={r}
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
                </div>

                <div className={styles.side}>
                  <span className={`mono ${styles.index}`} aria-hidden="true">
                    {shot.label ??
                      `${String(i + 1).padStart(2, "0")}/${String(count).padStart(2, "0")}`}
                  </span>

                  {shot.caption && (
                    <p className={styles.caption}>{shot.caption}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
