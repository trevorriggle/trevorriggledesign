import Image from "next/image";
import type { DesignImage } from "@/lib/design-images";
import styles from "./DesignGrid.module.css";

/* ============================================================================
   DESIGN GRID
   ============================================================================
   Aspect-ratio-aware columns on the 12-column grid. Each image's SPAN comes
   from its true proportion, and its height is whatever that proportion
   produces — nothing is cropped, letterboxed or forced into a uniform tile.

   That matters because the real content is genuinely mixed: wide catalog
   spreads, square social posts, tall phone screenshots and 3D renders, often
   on the same page. A uniform tile grid throws away the one thing an image of
   a print spread has to communicate, which is its shape.

   `grid-auto-flow: dense` lets a narrow image backfill the gap a wide one
   left, so the page stays tight without anything being resized to fit.

   An empty array renders nothing at all — no placeholder boxes, no "coming
   soon". The page is its copy until there are files in the folder.
   ========================================================================= */

function spanClass(ratio: number): string {
  if (ratio < 0.7) return styles.span3;   // tall — phone screenshot
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
  images: DesignImage[];
  priorityFirst?: boolean;
}) {
  if (images.length === 0) return null;

  return (
    <ul className={styles.grid}>
      {images.map((image, i) => (
        <li
          key={image.src}
          className={[styles.item, spanClass(image.ratio)].join(" ")}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes={sizesFor(image.ratio)}
            priority={priorityFirst && i === 0}
            loading={priorityFirst && i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={styles.image}
          />
        </li>
      ))}
    </ul>
  );
}
