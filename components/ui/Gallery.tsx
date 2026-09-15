"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import type { ImageRef } from "@/content";
import styles from "./Gallery.module.css";

/* ============================================================================
   GALLERY, the horizontal plate strip.
   ============================================================================
   A run of screenshots from one project, read sideways at one shared height.

   WHY THIS IS NOT <Frame> IN A FLEX ROW, which is what it was and which was
   genuinely broken. `Frame` sets `width: 100%` on the figure and `width: auto`
   with a `max-height` cap on the image. Inside a `flex: none` track item that
   has no definite width, `width: 100%` resolves against a parent whose width
   is itself being derived from its content: circular, so the item's width came
   out browser-dependent and the plates fell over each other and snapped to the
   wrong offsets.

   THE FIX IS TO DERIVE THE WIDTH, NOT ASK FOR IT. The track has ONE height,
   and every plate's width is `height * its own aspect ratio`, passed in as a
   custom property from the image's declared aspect. Nothing is circular,
   nothing measures anything, mixed portrait and landscape plates sit at the
   same height at their true proportions, and the snap offsets are exact.

   IT WORKS WITH NO JAVASCRIPT. This is a client component for the drag, but
   the markup is server-rendered and the scrolling itself is native:
   `overflow-x` plus `scroll-snap-type`. Trackpad, touch and the arrow keys all
   work before hydration and would work if the chunk never arrived. The drag is
   an enhancement on top, not the mechanism.

   THE SCROLLBAR IS GONE, in CSS, on purpose. A horizontal bar under a strip of
   plates is the ugliest thing on a page like this. What replaces it as the
   "there is more" signal is the strip itself: the last plate is deliberately
   cut off by the container edge, so the overflow is visible in the composition
   rather than announced by a widget.

   MOUSE ONLY FOR THE DRAG. `pointerType === "mouse"` gates it. Touch already
   has real momentum scrolling from the OS, which is better than anything this
   could reimplement, and hijacking it would cost the vertical page swipe.
   ========================================================================= */

export function Gallery({
  images,
  label,
}: {
  images: ImageRef[];
  /** The track's accessible name. It is a scrollable region, so it needs one. */
  label: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [dragging, setDragging] = useState(false);
  /** Where the pointer went down, and where the track was scrolled to then. */
  const origin = useRef({ x: 0, left: 0 });

  if (images.length === 0) return null;

  function onPointerDown(e: PointerEvent<HTMLUListElement>) {
    if (e.pointerType !== "mouse" || !track.current) return;
    origin.current = { x: e.clientX, left: track.current.scrollLeft };
    setDragging(true);
    /* Capture, so a drag that leaves the element still tracks and still ends.
       Without it, releasing outside the strip leaves it stuck in grab. */
    track.current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLUListElement>) {
    if (!dragging || !track.current) return;
    /* No preventDefault: the element is `user-select: none` while dragging,
       which is enough to stop the picture being selected, and skipping it
       keeps the browser's own scroll handling intact. */
    track.current.scrollLeft = origin.current.left - (e.clientX - origin.current.x);
  }

  function endDrag(e: PointerEvent<HTMLUListElement>) {
    if (!dragging) return;
    setDragging(false);
    track.current?.releasePointerCapture(e.pointerId);
    /* Snap is off during the drag, see the note in the CSS. Releasing puts it
       back, and the browser animates to the nearest plate by itself. */
  }

  return (
    <ul
      ref={track}
      className={`${styles.track} ${dragging ? styles.dragging : ""}`}
      /* Focusable and named: it is a scrollable region, so a keyboard user has
         to be able to reach it and arrow through it. */
      tabIndex={0}
      role="group"
      aria-label={label}
      /* NO `data-lenis-prevent`. It kept the smooth-scroll wrapper off this
         element's horizontal gestures and off its VERTICAL ones too, so the
         page stopped scrolling while the pointer was over a plate strip.
         Lenis runs with `allowNestedScroll`, which tests the axis of each
         gesture: this strip still takes a horizontal one and no longer eats
         the wheel. See components/motion/SmoothScroll. */
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {images.map((image, i) => (
        <li
          key={image.src}
          className={styles.plate}
          style={
            {
              "--plate-ratio": `${image.width} / ${image.height}`,
            } as CSSProperties
          }
        >
          <figure className={styles.figure}>
            <span className={styles.media}>
              <Image
                src={image.url}
                alt={image.alt}
                fill
                /* The plate's width is height-derived, so the rendered width
                   is bounded by the track height, not by the viewport. */
                sizes="(max-width: 62rem) 80vw, 34rem"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                unoptimized={image.unoptimized}
                className={styles.image}
                draggable={false}
              />
            </span>

            {image.caption && (
              <figcaption className={styles.caption}>
                <span className={styles.ordinal}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{image.caption}</span>
              </figcaption>
            )}
          </figure>
        </li>
      ))}
    </ul>
  );
}
