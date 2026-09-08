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

   They render through <AutoVideo>, which already carries the rules this site
   wants: muted, looping, no controls, paused until the clip is actually on
   screen, and never autoplayed at all for a visitor who has asked for reduced
   motion or is on a metered connection. Those visitors get the poster frame,
   which is a real picture of the work rather than a dead rectangle.

   An empty array renders nothing at all, no placeholder boxes, no "coming
   soon". The page is its copy until there are files in the folder.
   ========================================================================= */

function spanClass(ratio: number): string {
  if (ratio < 0.7) return styles.span3;   // tall, phone screenshot
  if (ratio < 1.15) return styles.span4;  // portrait / square
  if (ratio < 1.8) return styles.span6;   // landscape / most renders
  if (ratio < 2.8) return styles.span8;   // wide spread
  return styles.span12;                   // panorama
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
          className={[styles.item, spanClass(item.ratio)].join(" ")}
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
              className={styles.image}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
