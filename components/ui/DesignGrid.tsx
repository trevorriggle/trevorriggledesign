import type { CSSProperties } from "react";
import Image from "next/image";
import type { DesignItem } from "@/lib/design-images";
import type { DesignLayoutRow } from "@/content/design";
import { AutoVideo } from "./AutoVideo";
import styles from "./DesignGrid.module.css";

/* ============================================================================
   DESIGN GRID
   ============================================================================
   Aspect-ratio-aware columns on the 12-column grid. Each image's SPAN comes
   from its true proportion, and its height is whatever that proportion
   produces, nothing is cropped, letterboxed or forced into a uniform tile.

   That matters because the real content is genuinely mixed: wide catalog
   spreads, square social posts, tall phone screenshots and 3D renders, often
   on the same page. A uniform tile grid throws away the one thing an image of
   a print spread has to communicate, which is its shape.

   `grid-auto-flow: dense` lets a narrow image backfill the gap a wide one
   left, so the page stays tight without anything being resized to fit.

   MOTION SITS IN THE SAME GRID. Several pieces in this archive are animated
   banners and social posts. They lay out on their true proportion exactly like
   a still and take the same span, because an animated 1500x627 banner is the
   same shape as a static one and should not be given its own special row.

   ANIMATED GIFS ARE STILLS AS FAR AS THIS GRID IS CONCERNED. They lay out on
   their own proportion like any image and render through <Image> with
   `unoptimized`, which serves the file itself and never the optimiser's idea
   of it. A GIF that arrived as a GIF leaves as a GIF, animation intact.

   The .mp4 pieces render through <AutoVideo>, which already carries the rules
   this site wants: muted, looping, no controls, paused until the clip is actually on
   screen, and never autoplayed at all for a visitor who has asked for reduced
   motion or is on a metered connection. Those visitors get the poster frame,
   which is a real picture of the work rather than a dead rectangle.

   An empty array renders nothing at all, no placeholder boxes, no "coming
   soon". The page is its copy until there are files in the folder.
   ========================================================================= */

/* THE SPANS, AND WHAT EACH ONE IS ACTUALLY WORTH IN PIXELS at the widest the
   container ever gets: a 90rem page is 1282px inside its gutters, twelve
   columns with --grid-gap at its 36px ceiling.

   These numbers exist so `fit` below can compare a span against the file that
   has to fill it. They are the largest case; every narrower viewport makes the
   box smaller, which is always safe. */
const SPAN_PX: Record<number, number> = {
  3: 294,
  4: 403,
  6: 623,
  8: 842,
  12: 1282,
};

const SPAN_CLASS: Record<number, string> = {
  3: styles.span3,
  4: styles.span4,
  6: styles.span6,
  8: styles.span8,
  12: styles.span12,
};

const STEPS = [3, 4, 6, 8, 12];

/** The bucket a shape falls in, before the file itself gets a say. */
function spanForRatio(ratio: number): number {
  if (ratio < 0.7) return 3; // tall, phone screenshot
  if (ratio < 1.15) return 4; // portrait / square
  if (ratio < 1.8) return 6; // landscape / most renders
  if (ratio < 2.8) return 8; // wide spread
  return 12; // panorama
}

/**
 * The span an item actually gets, from its shape AND its resolution.
 *
 * SHAPE ALONE WAS THE WRONG AXIS, and the personal archive is where it shows.
 * Two failures, in opposite directions, from the same rule:
 *
 *   02-comics/04.jpg is 600x120. Ratio 5.0 puts it in span12, a 1282px box
 *   fed from a 600px file: a 2.1x upscale, and the only genuinely blurry
 *   image on the site.
 *
 *   02-comics/03.jpg is 2400x2400. Ratio 1.0 puts it in span4, a 403px box.
 *   It is a lettered comic page, so 403px is not small, it is unreadable, and
 *   it lands there BECAUSE it is square rather than despite it.
 *
 * So the bucket is a starting point and the file adjusts it twice.
 *
 * NEVER UPSCALE. Step down while the box is wider than the file. An image
 * rendered larger than it exists is the one sizing mistake a viewer always
 * notices, and it is always avoidable.
 *
 * A BIG FILE IN A NARROW BUCKET EARNS ONE STEP UP. A 2400px square is a
 * detailed piece and the resolution is the evidence for that; a 600px square
 * is a small one. Only the two narrow buckets are eligible, only by one step,
 * and only when the file can fill the result outright.
 */
function spanFor(ratio: number, width: number): string {
  let span = spanForRatio(ratio);

  if (span <= 4) {
    const next = STEPS[STEPS.indexOf(span) + 1];
    if (width >= SPAN_PX[next]) span = next;
  }

  while (span > 3 && SPAN_PX[span] > width) {
    span = STEPS[STEPS.indexOf(span) - 1];
  }

  return SPAN_CLASS[span];
}

function sizesFor(ratio: number): string {
  if (ratio >= 2.8) return "(max-width: 62rem) 100vw, 84rem";
  if (ratio >= 1.8) return "(max-width: 62rem) 100vw, 56rem";
  if (ratio >= 1.15) return "(max-width: 62rem) 100vw, 42rem";
  if (ratio >= 0.7) return "(max-width: 30rem) 50vw, (max-width: 62rem) 50vw, 28rem";
  return "(max-width: 30rem) 50vw, (max-width: 62rem) 33vw, 21rem";
}

/* ============================================================================
   THE COMPOSED PATH
   ============================================================================
   Everything above this is the automatic grid and is untouched. A section that
   declares a `layout` renders through here instead: explicit rows, explicit
   spans, and an equal-height rule that is expressed as layout rather than as
   arithmetic. See the note on DesignLayoutRow in content/design.ts.

   HOW `equal` WORKS, because it is the only non-obvious thing here. The first
   cell of the row is in normal flow and sizes itself from its own pictures.
   Every other cell is `position: relative` with its image absolutely filling
   it, so it contributes NO height of its own and simply takes whatever the
   row is. The grid stretches all cells to the tallest, the tallest is the
   first cell because it is the only one with intrinsic height, and the rest
   crop to fill. No pixel values, correct at every viewport width.

   `ratio` puts an explicit aspect-ratio on the first cell as well, for a row
   where no single file should decide the shape of the others. */

/** The filename at the end of a URL, which is what a layout names. */
function fileOf(url: string): string {
  return url.slice(url.lastIndexOf("/") + 1);
}

function Piece({
  item,
  eager,
  fill,
  focus,
  sizes,
}: {
  item: DesignItem;
  eager: boolean;
  /** Absolutely fill the cell and crop. Off for the cell that sets the height. */
  fill: boolean;
  focus?: string;
  sizes: string;
}) {
  if (item.kind === "video" && item.poster) {
    return (
      <AutoVideo
        src={item.src}
        poster={item.poster}
        width={item.width}
        height={item.height}
        label={item.alt}
      />
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.alt}
      width={item.width}
      height={item.height}
      sizes={sizes}
      priority={eager}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      unoptimized={item.passthrough}
      className={fill ? styles.imageFill : styles.image}
      style={focus ? ({ objectPosition: focus } as CSSProperties) : undefined}
    />
  );
}

function ComposedGrid({
  rows,
  byFile,
  priorityFirst,
}: {
  rows: DesignLayoutRow[];
  byFile: Map<string, DesignItem>;
  priorityFirst: boolean;
}) {
  let seen = 0;

  return (
    <div className={styles.composed}>
      {rows.map((row, r) => {
        /* A row whose spans do not reach twelve is offset by half the
           remainder when it is centred, which is what puts a ten-column
           banner in the middle of the page rather than against its left. */
        const total = row.cells.reduce((n, c) => n + c.span, 0);
        const offset = row.center ? Math.max(0, (12 - total) / 2) : 0;

        return (
          <ul
            key={r}
            className={[styles.row, row.equal ? styles.rowEqual : ""]
              .filter(Boolean)
              .join(" ")}
          >
            {row.cells.map((cell, c) => {
              const items = cell.files
                .map((f) => byFile.get(f))
                .filter((i): i is DesignItem => Boolean(i));
              if (items.length === 0) return null;

              /* The first cell of an `equal` row is the one in normal flow,
                 because something has to give the row its height. Everywhere
                 else, and in every non-equal row, the cell sizes itself from
                 its pictures as usual.

                 UNLESS THE ROW DECLARES A `ratio`, in which case the box is
                 already fixed and the first cell crops into it like all the
                 others. Without this the first picture sat at its natural
                 height inside a taller box with dead space under it, which is
                 exactly the ragged bottom edge the row exists to remove. */
              const sets = Boolean(row.equal) && c === 0;
              const fills = Boolean(row.equal) && (c > 0 || Boolean(row.ratio));

              /* ONLY THE FIRST CELL OF A CENTRED ROW NAMES A START LINE, and
                 it is 1-based: column 1 is line 1. Writing a start line on
                 every cell is what broke this the first time round — an
                 off-by-one put cell one at line 2, which pushed the last cell
                 of the row past line 13 and wrapped it onto a row of its own.
                 Everything else spans from wherever it lands. */
              const style: CSSProperties = {
                gridColumn:
                  c === 0 && offset > 0
                    ? `${1 + offset} / span ${cell.span}`
                    : `span ${cell.span}`,
              };
              if (sets && row.ratio) style.aspectRatio = String(row.ratio);

              const sizes = `(max-width: 62rem) 100vw, ${Math.round(
                (cell.span / 12) * 90,
              )}rem`;

              return (
                <li
                  key={cell.files.join("+")}
                  className={[
                    styles.cell,
                    fills ? styles.cellFill : "",
                    sets && row.ratio ? styles.cellRatio : "",
                    items.length > 1 ? styles.cellStack : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={style}
                >
                  {items.map((item) => {
                    const eager = priorityFirst && seen === 0;
                    seen += 1;
                    return (
                      <Piece
                        key={item.src}
                        item={item}
                        eager={eager}
                        fill={fills}
                        focus={cell.focus}
                        sizes={sizes}
                      />
                    );
                  })}
                </li>
              );
            })}
          </ul>
        );
      })}
    </div>
  );
}

export function DesignGrid({
  images,
  /** Mark the first image as the LCP candidate. Only on a page's lead grid. */
  priorityFirst = false,
  /** Placed rows. Absent is the automatic grid, which is the default. */
  layout,
}: {
  images: DesignItem[];
  priorityFirst?: boolean;
  layout?: DesignLayoutRow[];
}) {
  if (images.length === 0) return null;

  if (layout && layout.length > 0) {
    const byFile = new Map(images.map((i) => [fileOf(i.src), i]));

    /* ANY FILE THE LAYOUT DID NOT NAME STILL RENDERS, in the automatic grid
       under the composed rows. A layout that forgets a picture loses its
       placement; it never loses the picture, and it never silently drops
       something a new file in the folder would have added. */
    const placed = new Set(
      layout.flatMap((row) => row.cells.flatMap((cell) => cell.files)),
    );
    const rest = images.filter((i) => !placed.has(fileOf(i.src)));

    return (
      <>
        <ComposedGrid rows={layout} byFile={byFile} priorityFirst={priorityFirst} />
        {rest.length > 0 && <DesignGrid images={rest} />}
      </>
    );
  }

  return (
    <ul className={styles.grid}>
      {images.map((item, i) => (
        <li
          key={item.src}
          className={[styles.item, spanFor(item.ratio, item.width)].join(" ")}
        >
          {item.kind === "video" && item.poster ? (
            <AutoVideo
              src={item.src}
              poster={item.poster}
              width={item.width}
              height={item.height}
              label={item.alt}
            />
          ) : (
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes={sizesFor(item.ratio)}
              priority={priorityFirst && i === 0}
              loading={priorityFirst && i === 0 ? "eager" : "lazy"}
              decoding="async"
              /* GIF and SVG go out byte-for-byte, straight from /design/,
                 never through /_next/image. An animated GIF stays animated
                 because the optimiser is never given the file. */
              unoptimized={item.passthrough}
              className={styles.image}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
