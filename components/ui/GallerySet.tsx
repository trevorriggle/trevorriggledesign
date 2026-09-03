import { Frame } from "./Frame";
import type { ResolvedImage } from "@/content";
import styles from "./GallerySet.module.css";

/**
 * Column span from the declared aspect ratio, on a 12-column grid.
 *
 * These are proportion CLASSES, not arbitrary numbers, and they are what let
 * the archive hold wide print spreads, square social posts and tall phone
 * screenshots on one page without cropping or letterboxing any of them:
 *
 *   < 0.8    tall portrait, phone screenshot   3 of 12
 *   < 1.25   square-ish                        4 of 12
 *   < 1.9    landscape, most renders           6 of 12
 *   < 2.6    wide spread                       8 of 12
 *   >=       panorama                         12 of 12
 *
 * Height follows from the ratio. Nothing is forced into a uniform tile.
 */
function spanClass(ratio: number): string {
  if (ratio < 0.8) return styles.span3;
  if (ratio < 1.25) return styles.span4;
  if (ratio < 1.9) return styles.span6;
  if (ratio < 2.6) return styles.span8;
  return styles.span12;
}

/** `sizes` must match the span, or next/image over-fetches badly on a page
 *  that will eventually carry a lot of images. */
function sizesFor(ratio: number): string {
  if (ratio >= 2.6) return "(max-width: 62rem) 100vw, 84rem";
  if (ratio >= 1.9) return "(max-width: 62rem) 100vw, 56rem";
  if (ratio >= 1.25) return "(max-width: 62rem) 100vw, 42rem";
  if (ratio >= 0.8) return "(max-width: 30rem) 50vw, (max-width: 62rem) 50vw, 28rem";
  return "(max-width: 30rem) 50vw, (max-width: 62rem) 33vw, 21rem";
}

export function GallerySet({
  images,
  priorityFirst = false,
}: {
  images: ResolvedImage[];
  /** Mark the first image as the LCP candidate. Only on a page's lead set. */
  priorityFirst?: boolean;
}) {
  return (
    <ul className={styles.set}>
      {images.map((image, i) => (
        <li
          key={image.src}
          className={[styles.item, spanClass(image.ratio)].join(" ")}
        >
          <Frame
            image={image}
            role={`plate ${String(i + 1).padStart(2, "0")}`}
            ordinal={String(i + 1).padStart(2, "0")}
            sizes={sizesFor(image.ratio)}
            priority={priorityFirst && i === 0}
          />
        </li>
      ))}
    </ul>
  );
}
