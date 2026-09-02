import type { ResolvedImage } from "@/content";
import styles from "./Placeholder.module.css";

/* ============================================================================
   PLACEHOLDER
   ============================================================================
   Stands in for a declared image whose file does not exist yet, and prints the
   four things needed to produce it: the filename it must be saved as, the
   aspect ratio, the minimum export width, and what the image has to show.

   It is a design element, not a failure state. The composition of every page
   can be judged with the whole site in this condition — which is the point,
   because that is the condition the site is being designed in.

   The same four facts appear in MANIFEST.md. This component and that file are
   generated from the identical frontmatter, so the shopping list and the page
   can never disagree.
   ========================================================================= */

export function Placeholder({
  image,
  role,
}: {
  image: ResolvedImage;
  /** What this slot is — "cover", "plate 3", "architecture". */
  role?: string;
}) {
  const { width, height } = image;

  return (
    <div
      className={styles.plate}
      style={{ ["--plate-ratio" as string]: image.aspect.replace(":", " / ") }}
      /* The alt text is real content and already written, so the placeholder
         carries it as its accessible name — a screen reader gets the same
         description it will get once the file lands. */
      role="img"
      aria-label={`Placeholder for image: ${image.alt}`}
    >
      <div className={styles.head}>
        <span className={styles.role}>{role ?? "image"}</span>
        <span className={styles.ratio}>{image.aspect}</span>
      </div>

      <p className={styles.label}>{image.label}</p>

      <div className={styles.foot}>
        <span className={styles.file}>{image.src}</span>
        <span className={styles.dims}>
          ≥{width}×{height}
        </span>
      </div>
    </div>
  );
}
