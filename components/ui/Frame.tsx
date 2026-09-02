import Image from "next/image";
import type { ResolvedImage } from "@/content";
import { Placeholder } from "./Placeholder";
import styles from "./Frame.module.css";

/* ============================================================================
   FRAME
   ============================================================================
   The single place the site decides between a real image and a placeholder.
   Every image on the site goes through here, so "drop the file in and change
   nothing else" is true by construction rather than by discipline.

   next/image gets width/height from the declared aspect and minWidth, so
   there is no layout shift either before or after the real file arrives.
   ========================================================================= */

export function Frame({
  image,
  role,
  sizes,
  priority = false,
  showCaption = true,
  ordinal,
  className,
}: {
  image: ResolvedImage;
  role?: string;
  /** Required reading for performance: tell next/image the rendered width. */
  sizes: string;
  priority?: boolean;
  showCaption?: boolean;
  /** Plate number in a series, e.g. "03". */
  ordinal?: string;
  className?: string;
}) {
  const caption = showCaption && image.caption ? image.caption : null;

  return (
    <figure className={[styles.frame, className].filter(Boolean).join(" ")}>
      {image.exists ? (
        <Image
          src={image.url}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className={styles.image}
        />
      ) : (
        <Placeholder image={image} role={role} />
      )}

      {caption && (
        <figcaption className={styles.caption}>
          {ordinal && <span className={styles.captionOrdinal}>{ordinal}</span>}
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
