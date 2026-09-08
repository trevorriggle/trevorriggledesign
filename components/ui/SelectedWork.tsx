import Link from "next/link";
import type { CaseStudy } from "@/content";
import { Frame } from "./Frame";
import { VideoSlot } from "./Video";
import styles from "./SelectedWork.module.css";

/* ============================================================================
   SELECTED WORK
   ============================================================================
   Three applications, ONE treatment, repeated. DrawEvolve, thoosie, Lynk, in
   the running order held by SELECTED in content/index.ts.

   This replaces a three-rank descending layout, where the lead was set at
   --type-title with a full-bleed media slot, the second at --type-entry with
   media at two-thirds, and the third was a bare ruled line with no media at
   all. The ranking was doing editorial work the products do not need: three
   shipped applications are three shipped applications, and setting one of
   them a third the size of another argues they are not.

   Now every entry gets the same template: media above, full width, then the
   title at --type-entry, the deck, the metadata. Ruled top and bottom, equal
   air between. ORDER is the only signal left, which is why the running order
   is manual and stated on the page.

   The one thing that still varies by position is `priority` on the first
   entry's image. That is a loading hint for the largest contentful paint, not
   a visual weight, and it is invisible in the layout.
   ========================================================================= */

/** Uniform for every entry: the media slot is full grid width at every rank. */
const MEDIA_SIZES = "(max-width: 62rem) 100vw, 76rem";

/**
 * Does this entry have a real file to show?
 *
 * Nothing on this site renders a placeholder for a missing image, <Frame>
 * returns null and the layout closes up. This check exists so the media slot
 * is not reserved for an image that will not appear, which would leave a gap
 * above the title rather than a tighter row.
 */
function hasRealMedia(entry: CaseStudy): boolean {
  if (entry.video) return entry.video.exists || Boolean(entry.video.poster?.exists);
  return Boolean(entry.cover?.exists);
}

export function SelectedWork({ entries }: { entries: CaseStudy[] }) {
  return (
    <div className={styles.set}>
      {entries.map((entry, i) => {
        const showMedia = hasRealMedia(entry);

        return (
          <article key={entry.slug} className={styles.entry}>
            {showMedia && (entry.video || entry.cover) && (
              <div className={styles.media}>
                {entry.video ? (
                  <VideoSlot video={entry.video} sizes={MEDIA_SIZES} />
                ) : (
                  entry.cover && (
                    <Frame
                      image={entry.cover}
                      priority={i === 0}
                      sizes={MEDIA_SIZES}
                    />
                  )
                )}
              </div>
            )}

            <div className={styles.text}>
              <h3 className={styles.title}>
                <Link href={entry.href} className={styles.titleLink}>
                  {entry.title}
                </Link>
              </h3>

              <p className={styles.deck}>{entry.deck}</p>

              <p className={styles.meta}>
                {entry.state && (
                  <span className={styles.state}>{entry.state}</span>
                )}
                {entry.stack.length > 0 && (
                  <span>{entry.stack.join(" · ")}</span>
                )}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
