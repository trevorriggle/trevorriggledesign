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
   width, in order, all visible. The pinning is layered on top inside two
   stacked conditions, and if either of them fails you get the stack. That
   ordering is the whole design of this component, because the stack is the
   state that has to be right: it is what a phone gets, what Firefox gets,
   and what the printed page and a text browser get.

   THE TWO CONDITIONS, and why each one is there:

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

   THERE USED TO BE A THIRD CONDITION, `(prefers-reduced-motion:
   no-preference)`, AND IT IS GONE ON PURPOSE. It was there because the
   sequence used to cross-fade: content dissolving under a stationary viewport
   is exactly the vestibular trigger the preference exists for. Nothing
   dissolves any more. The swap is a hard cut with no interpolated frames, and
   the only thing that moves is a 3px bar growing along one edge, which is the
   same class of motion as a scrollbar. Under the preference the block now
   behaves identically to the way it behaves without it, which is what was
   asked for: the bar still fills, and the picture still changes instantly.

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

   ---- ONE PICTURE AT A TIME, AND A BAR THAT SAYS HOW FAR -----------------
   THIS REPLACED A SCROLL-LINKED CROSS-FADE, and the reason is worth keeping.
   Opacity used to be scrubbed by scroll position: each shot faded in across
   30% of its own slice, so for a real stretch of the track two screenshots
   were genuinely superimposed. Two things were wrong with it. A blend of two
   interfaces is not a picture of either one, and — worse — scroll position
   carried no information about how much further there was to go. The reader
   was inside a transition with no idea how long it was.

   So opacity is now a STEP rather than a ramp. `steps(1, end)` over the range
   [0, --start] holds a shot at `opacity: 0` for the whole range and flips it
   to 1 at the end of it, which is a hard cut on a single frame. At no scroll
   position are two shots both visible. The first shot is the base layer at
   full opacity and never animates at all; the rest flip on over it in
   ascending stacking order, and because each one fully covers the one beneath
   it, the cut is clean.

   THE BAR IS WHAT THE OPACITY RAMP WAS DOING BADLY. It fills linearly across
   the shot's own slice, so its width is the answer to "how much further" —
   stated continuously, in the one place a reader is already looking, without
   putting it inside the picture. Full bar, next picture, immediately.

   BOTH HALVES RUN OFF THE SAME TIMELINE AND NEITHER IS STATEFUL, which is
   what makes scrolling back up correct for free. There is no "current index"
   held anywhere; both the cut and the fill are pure functions of scroll
   position, so reversing the scroll reverses both exactly.

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

/** Two decimal places is plenty for a percentage of a scroll range, and it
 *  keeps `animation-range` short enough to read in devtools. */
const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

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
            /* THIS SHOT'S SLICE OF THE TRACK, as percentages of the `contain`
               range. The slices are equal and they tile it exactly: shot i
               owns [i/n, (i+1)/n), so there is no gap between one shot's
               window and the next one's and no overlap either.

               Both numbers do one job each, and neither is a fade:

                 --start  the instant this shot replaces the one under it, and
                          the instant its own progress bar starts filling
                 --end    the instant the bar is full, which is by definition
                          --start for the shot after it

               Computed here rather than in a calc() so the numbers are
               readable in devtools and so `animation-range` never has to
               parse arithmetic. The first shot still gets both: it is the
               base layer and never animates its own opacity, but its bar
               fills like every other one. */
            const style: Record<string, string | number> = {
              "--i": i,
              "--start": pct(i / count),
              "--end": pct((i + 1) / count),
            };

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

                    {/* HOW MUCH FURTHER TO SCROLL BEFORE THE PICTURE CHANGES.
                        It renders in every state and the stylesheet hides it
                        in the stack, where there is nothing to be part-way
                        through: on a phone and in Firefox every screenshot is
                        already on the page in order.

                        IT IS `aria-hidden` AND THAT IS NOT AN OVERSIGHT. The
                        plate mark beside it already reads "01/05" or
                        "BEFORE", so the position in the run is in the
                        accessibility tree as text. A second announcement of
                        the same fact as a live-updating percentage is noise,
                        and a screen reader user is not scrolling through a
                        pinned stage to begin with. */}
                    <span aria-hidden="true" className={styles.progress}>
                      <span className={styles.progressFill} />
                    </span>
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
