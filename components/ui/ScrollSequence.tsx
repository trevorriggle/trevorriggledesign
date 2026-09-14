import Image from "next/image";
import type { CSSProperties } from "react";
import type { ImageRef } from "@/content";
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
      consolation prize: five full-width screenshots you flick through.

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
   so a screen reader gets all five descriptions and nothing is gated behind
   an interaction that a screen reader user is not performing.

   THE FIRST SHOT NEVER ANIMATES. It is the base layer at full opacity, and
   the others fade in over it in ascending stacking order. Each screenshot
   fully covers the one under it, so there is no cross-fade through a gap and
   no moment where two are half-visible over the page ground.
   ========================================================================= */

/** Half-width of each cross-fade, as a fraction of one shot's share of the
 *  track. 0.3 leaves each screenshot fully settled for most of its slice
 *  rather than permanently in transit between two states. */
const FADE = 0.3;

export function ScrollSequence({
  images,
  label,
  /** The first shot is the block's LCP candidate on the case study page. */
  priorityFirst = false,
}: {
  images: ImageRef[];
  label: string;
  priorityFirst?: boolean;
}) {
  const shots = images.filter((image) => image.exists);
  if (shots.length < 2) return null;

  const count = shots.length;

  return (
    <section
      className={styles.track}
      style={{ "--n": count } as CSSProperties}
      aria-label={label}
    >
      <div className={styles.stage}>
        <ol className={styles.shots}>
          {shots.map((image, i) => {
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
                key={image.src}
                className={styles.shot}
                style={style as CSSProperties}
              >
                <span className={`mono ${styles.index}`} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                  <span className={styles.of}>/{String(count).padStart(2, "0")}</span>
                </span>

                <Image
                  src={image.url}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 62rem) 100vw, 40rem"
                  priority={priorityFirst && i === 0}
                  loading={priorityFirst && i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  unoptimized={image.unoptimized}
                  className={styles.image}
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
