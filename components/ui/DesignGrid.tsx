import Image from "next/image";
import type { DesignItem } from "@/lib/design-images";
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

export function DesignGrid({
  images,
  /** Mark the first image as the LCP candidate. Only on a page's lead grid. */
  priorityFirst = false,
}: {
  images: DesignItem[];
  priorityFirst?: boolean;
}) {
  if (images.length === 0) return null;

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
