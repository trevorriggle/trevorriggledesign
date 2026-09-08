"use client";

import { useRef, type PointerEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./IndexList.module.css";

/* ============================================================================
   THE INDEX, and it is the browse tier for the whole site.
   ============================================================================
   A set of things to look at, set as a ruled list of NAMES at display scale,
   with each entry's picture appearing under the cursor as you move down it.

   WHAT THIS REPLACED, AND WHY IT WAS THE WRONG SHAPE TWICE. The browse tier
   was a grid of 4:3 preview cards. It got a hover pass, then a second, richer
   one: pointer-anchored magnify, registration marks, a chip tracking the
   cursor. Both were polish on a format that was never going to be the answer
   here, and the format was the problem:

     · A grid of equal boxes says every item is equivalent. It flattens three
       things into a set of tiles no matter what is in them.
     · A 4:3 crop throws away the one thing a picture of a print spread or a
       phone screenshot has to say, which is its shape. Every asset arrived
       pre-flattened.
     · It made no use of the single most distinctive thing this site owns: a
       1.5 modular type scale that exists so ONE THING CAN DOMINATE. A card
       title runs at 21px. The scale goes to 129px.

   So the boxes are gone. The list is type, at 38 to 57px, on hairlines, and
   the pictures are not in the layout at all: they are held under the pointer,
   one at a time, at their own proportion and much larger than any card was.
   The type carries the page and the image answers the question the type
   raises.

   HOW THE PREVIEW WORKS. `pointermove` on the LIST writes two pixel values,
   --px and --py, relative to the list's own box. Every row owns its own
   preview element and CSS positions all of them from those two numbers, so
   the picture that shows is whichever row is hovered and it appears exactly
   where the pointer already is. Nothing is measured per row, no React state
   changes on move, and there is no shared element whose `src` swaps, which is
   what causes the flash of the previous project's image in most versions of
   this.

   THE RECT IS CACHED ON ENTER. `getBoundingClientRect` forces a layout flush
   and doing it per `pointermove` is the difference between free and janky. It
   cannot change mid-hover without a scroll or resize, either of which ends
   with a fresh `pointerenter`.

   IT IS A LIST BEFORE IT IS ANYTHING ELSE. Server-rendered <ol> of <li> of
   <a>, in running order, with the ordinal, the name, the deck and the meta all
   in the markup as text. The preview is decoration on top: `alt=""`, because
   the name is in the same link, and `aria-hidden` on the ordinal, because the
   list already numbers itself.

   NO POINTER, NO FLOATING PANEL. Everything above is inside
   `@media (hover: hover)`. On a touch screen the previews are laid out inline
   under each name instead, at full width, because a hover-only reveal on a
   phone is a picture nobody ever sees. See IndexList.module.css.
   ========================================================================= */

export type IndexEntry = {
  href: string;
  title: string;
  /** One line. A deck or an intro, verbatim, never body copy. */
  description?: string;
  /** A derived count or a status word. Never a written sentence. */
  meta?: string;
  preview: {
    url: string;
    width: number;
    height: number;
    /** GIF or SVG: served as the file itself. */
    unoptimized: boolean;
  } | null;
};

/** The preview panel's width. The height follows from each picture's own
 *  proportion, which is the whole point of it. */
const PREVIEW_SIZES = "(max-width: 62rem) 100vw, 30rem";

export function IndexList({
  entries,
  label,
  /** Eager-loads the first preview, so the first hover is not a blank panel. */
  priorityFirst = false,
}: {
  entries: IndexEntry[];
  label?: string;
  priorityFirst?: boolean;
}) {
  const list = useRef<HTMLOListElement>(null);
  const rect = useRef<DOMRect | null>(null);

  if (entries.length === 0) return null;

  function cache(e: PointerEvent<HTMLOListElement>) {
    if (e.pointerType !== "mouse") return;
    rect.current = list.current?.getBoundingClientRect() ?? null;
  }

  function track(e: PointerEvent<HTMLOListElement>) {
    const el = list.current;
    const r = rect.current;
    if (!el || !r || e.pointerType !== "mouse") return;

    el.style.setProperty("--px", `${e.clientX - r.left}px`);
    el.style.setProperty("--py", `${e.clientY - r.top}px`);
  }

  function release() {
    rect.current = null;
  }

  return (
    <ol
      ref={list}
      className={styles.list}
      aria-label={label}
      onPointerEnter={cache}
      onPointerMove={track}
      onPointerLeave={release}
    >
      {entries.map((entry, i) => (
        <li key={entry.href} className={styles.row}>
          <Link href={entry.href} className={styles.link}>
            <span className={styles.ordinal} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>

            <span className={styles.body}>
              <span className={styles.title}>{entry.title}</span>
              {entry.description && (
                <span className={styles.deck}>{entry.description}</span>
              )}
            </span>

            {entry.meta && <span className={styles.meta}>{entry.meta}</span>}

            {/* The arrow closes the row on the right, so the line reads
                ordinal -> name -> status -> out. A glyph, not copy. */}
            <span className={styles.arrow} aria-hidden="true">
              &rarr;
            </span>
          </Link>

          {entry.preview && (
            <span className={styles.preview} aria-hidden="true">
              <Image
                src={entry.preview.url}
                alt=""
                width={entry.preview.width}
                height={entry.preview.height}
                sizes={PREVIEW_SIZES}
                priority={priorityFirst && i === 0}
                loading={priorityFirst && i === 0 ? "eager" : "lazy"}
                decoding="async"
                /* An animated GIF preview stays animated. */
                unoptimized={entry.preview.unoptimized}
                className={styles.previewImage}
                draggable={false}
              />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
