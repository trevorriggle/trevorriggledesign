import Link from "next/link";
import type { CaseStudy } from "@/content";
import { Frame } from "./Frame";
import { VideoSlot } from "./Video";
import styles from "./SelectedWork.module.css";

/* ============================================================================
   SELECTED WORK
   ============================================================================
   The three Tier 1 case studies on the home page, at DESCENDING weight:

     rank 0   lead      title at --type-title, the deck at lead size, the
                        media slot at full width, generous air
     rank 1   second    smaller title, media at two-thirds, less air
     rank 2   third     a ruled line — title, deck, metadata, no media

   The weight is carried entirely by size and space. There is no "Featured"
   badge, no "Case study 1 of 3", no ordinal chip. A label explaining which
   thing matters most is what a layout writes when it cannot show you.

   Lynk being lightest is also editorially correct: it is the shelved project,
   and the copy frames that as a decision rather than a headline.
   ========================================================================= */

function rankClass(rank: number): string {
  if (rank === 0) return styles.lead;
  if (rank === 1) return styles.second;
  return styles.third;
}

/**
 * Does this entry have a real file to show?
 *
 * Nothing on this site renders a placeholder for a missing image any more —
 * <Frame> returns null and the layout closes up. This check exists so the
 * media COLUMN is not reserved for an image that will not appear, which would
 * leave a hole in the grid rather than a tighter row.
 */
function hasRealMedia(entry: CaseStudy): boolean {
  if (entry.video) return entry.video.exists || Boolean(entry.video.poster?.exists);
  return Boolean(entry.cover?.exists);
}

export function SelectedWork({ entries }: { entries: CaseStudy[] }) {
  return (
    <div className={styles.set}>
      {entries.map((entry, rank) => {
        const showMedia = rank < 2 && hasRealMedia(entry);

        return (
          <article key={entry.slug} className={rankClass(rank)}>
            {showMedia && (entry.video || entry.cover) && (
              <div className={styles.media}>
                {entry.video ? (
                  <VideoSlot
                    video={entry.video}
                    sizes={
                      rank === 0
                        ? "(max-width: 62rem) 100vw, 76rem"
                        : "(max-width: 62rem) 100vw, 52rem"
                    }
                  />
                ) : (
                  entry.cover && (
                    <Frame
                      image={entry.cover}
                      priority={rank === 0}
                      sizes={
                        rank === 0
                          ? "(max-width: 62rem) 100vw, 76rem"
                          : "(max-width: 62rem) 100vw, 52rem"
                      }
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
                {entry.year && <span>{entry.year}</span>}
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
