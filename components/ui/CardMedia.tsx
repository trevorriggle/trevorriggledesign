"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import styles from "./Card.module.css";

/* ============================================================================
   CARD MEDIA, the interactive crop.
   ============================================================================
   The frame, the crop, the corner marks, and the pointer tracking that drives
   all three. Everything visual is CSS; this component's entire job is to
   publish where the pointer is as two custom properties on the frame:

     --mx   0 at the left edge, 1 at the right
     --my   0 at the top edge, 1 at the bottom

   From those, the stylesheet gets two things it cannot get any other way:

     1. A POINTER-ANCHORED MAGNIFY. `transform-origin` is set from --mx/--my,
        so the image scales toward wherever you are pointing instead of toward
        the middle of the box. Moving across a thumbnail pans the picture under
        the cursor: it reads as a loupe over the work rather than as a card
        doing a hover state. This is the whole reason this file exists.

     2. A CHIP THAT FOLLOWS THE CURSOR inside the crop, carrying the arrow.

   WHY THE VALUES ARE UNITLESS AND NOT PIXELS. The stylesheet multiplies them
   by 100%, so the same two numbers work at any card size and nothing has to be
   recomputed when the grid goes from three columns to two.

   THE RECT IS CACHED ON ENTER, not read on every move. `getBoundingClientRect`
   forces a layout flush, and doing that on every pointermove across a grid of
   cards is the difference between this being free and this being the reason a
   page stutters. The rect cannot change mid-hover without a scroll or a
   resize, and either of those ends with a fresh `pointerenter`.

   MOUSE ONLY. `pointerType` gates it. A touch "hover" is a tap on its way to
   a navigation, so tracking it would fire a magnify the visitor never asked
   for on the way off the page.

   IT DEGRADES TO NOTHING. The markup is server-rendered and every property
   has a 0.5 fallback in CSS, so before hydration, without JS, and on touch the
   card still has its full hover: the magnify just centres and the chip rests
   in the middle. Nothing here is required to read or use the card.
   ========================================================================= */

export function CardMedia({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLSpanElement>(null);
  const rect = useRef<DOMRect | null>(null);

  function cache(e: PointerEvent<HTMLSpanElement>) {
    if (e.pointerType !== "mouse") return;
    rect.current = frame.current?.getBoundingClientRect() ?? null;
  }

  function track(e: PointerEvent<HTMLSpanElement>) {
    const el = frame.current;
    const r = rect.current;
    if (!el || !r || e.pointerType !== "mouse") return;

    el.style.setProperty("--mx", String((e.clientX - r.left) / r.width));
    el.style.setProperty("--my", String((e.clientY - r.top) / r.height));
  }

  function release() {
    const el = frame.current;
    if (!el) return;
    /* Back to the centre rather than left where the pointer exited, so the
       image eases straight back to its resting frame instead of drifting to
       an arbitrary corner on the way out. */
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
    rect.current = null;
  }

  return (
    <span
      ref={frame}
      className={styles.frame}
      onPointerEnter={cache}
      onPointerMove={track}
      onPointerLeave={release}
    >
      <span className={styles.crop}>{children}</span>

      {/* THE CORNER MARKS. Registration marks, the print production mark that
          says "this is the trim of the plate", drawn just outside the frame
          and snapping in around the picture on hover.

          They live OUT HERE, a sibling of the crop rather than a child,
          because the crop is `overflow: hidden` (that is what contains the
          magnify) and would clip them. Positioned by a negative `inset`, so
          the box is exactly the gap larger than the frame on all four sides
          and no aspect ratio has to be guessed at.

          One element, eight background gradients, no extra DOM per corner. */}
      <span className={styles.marks} aria-hidden="true" />
    </span>
  );
}
