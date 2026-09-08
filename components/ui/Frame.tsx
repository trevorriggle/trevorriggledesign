import Image from "next/image";
import type { ImageRef } from "@/content";
import styles from "./Frame.module.css";

/* ============================================================================
   FRAME
   ============================================================================
   A declared image, rendered when the file is on disk.

   When it is not, this renders NOTHING. It used to render a spec plate, filename, ratio, minimum export size, a line about what the image had to
   show. That made the site reviewable with zero assets, which was genuinely
   useful while it was being built and is exactly wrong now: it puts a note
   from the author to the author on a live page.

   An absent image is simply absent. The page is its copy.
   ========================================================================= */

export function Frame({
  image,
  sizes,
  priority = false,
  ordinal,
  className,
}: {
  image: ImageRef;
  sizes: string;
  priority?: boolean;
  ordinal?: string;
  className?: string;
}) {
  if (!image.exists) return null;

  return (
    <figure className={[styles.frame, className].filter(Boolean).join(" ")}>
      <Image
        src={image.url}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        /* .gif and .svg only. Straight from /media/, no /_next/image, so an
           animated GIF cannot come back as its own first frame. */
        unoptimized={image.unoptimized}
        className={styles.image}
      />

      {image.caption && (
        <figcaption className={styles.caption}>
          {ordinal && <span className={styles.captionOrdinal}>{ordinal}</span>}
          <span>{image.caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
