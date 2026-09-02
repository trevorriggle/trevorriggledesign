import { Frame } from "./Frame";
import type { ResolvedImage } from "@/content";
import styles from "./GallerySet.module.css";

/**
 * Column span from the declared aspect ratio. Six-column grid.
 *
 * The breakpoints are proportion classes, not arbitrary numbers: taller than
 * 9:10 is a portrait, up to 3:2 is a square-ish or mild landscape, up to
 * roughly 21:9 is a landscape, and anything wider is a panorama that earns the
 * full measure.
 */
function spanClass(ratio: number): string {
  if (ratio < 0.9) return styles.span2; // portrait
  if (ratio < 1.5) return styles.span2; // square-ish
  if (ratio < 2.2) return styles.span3; // landscape
  return styles.span6; // panorama
}

/** `sizes` must match the span, or next/image over-fetches. */
function sizesFor(ratio: number): string {
  if (ratio >= 2.2) return "(max-width: 34rem) 100vw, (max-width: 60rem) 100vw, 84rem";
  if (ratio >= 1.5) return "(max-width: 34rem) 100vw, (max-width: 60rem) 100vw, 42rem";
  return "(max-width: 34rem) 100vw, (max-width: 60rem) 50vw, 28rem";
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
