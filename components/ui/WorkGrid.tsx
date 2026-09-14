import Link from "next/link";
import Image from "next/image";
import type { WorkEntry } from "./WorkIndex";
import styles from "./WorkGrid.module.css";

/* ============================================================================
   WORK GRID, the home page's tier.
   ============================================================================
   Image-led tiles: the picture, then the name. Everything visible on load, no
   pointer required, no client JavaScript.

   WHAT THIS REPLACED. The home page was a 2x2 of four DOORS: Applications,
   Design, Agentic AI, About, each a section name over a thumbnail read from
   public/home/. Two of the four had no image at all, so half the grid was a
   word on flat ground, and the two that did were stale: the Applications tile
   was a rough line sketch from an old build, sitting one click away from the
   finished colour portrait the case study now leads with.

   The deeper problem was that a door is not work. Somebody who has just come
   out of a final-round interview and wants to look at what this person makes
   was being handed four category names to choose between first.

   IT TAKES THE SAME ROWS THE BROWSE TIER DOES. `caseStudyRows` and
   `designCategoryRows` in lib/cards.ts feed both this and <WorkIndex>, so the
   home page cannot show a different picture for DrawEvolve than /applications
   does, and a new entry appears in both places from one edit. The old tiles
   read their own separate folder, which is exactly how the thumbnails went
   stale without anyone noticing.

   IT IS NOT <WorkIndex> REUSED, and the difference is deliberate. The index
   is the browse tier: one entry per row, at its own proportion, with the deck
   beside it, built for reading through. This is denser and shows no deck,
   because on the home page these are a set to scan rather than a list to
   read, and the decks are one click away on the page whose job that is.

   THE TILES CROP, WHICH IS THE ONE PLACE ON THIS SITE THAT HAPPENS. A grid of
   mixed proportions has no grid in it; the whole point of this tier is that
   six things read as one set. Every picture fed to it is either a composed
   4:3 thumbnail or a category thumb chosen to survive exactly this crop, see
   `designThumbs` in content/design.ts. The uncropped proportion is what the
   browse tier and the case studies are for.
   ========================================================================= */

export function WorkGrid({
  entries,
  label,
  /** Eager-loads the first two tiles. Above the fold on a desktop window. */
  priorityCount = 0,
}: {
  entries: WorkEntry[];
  label?: string;
  priorityCount?: number;
}) {
  if (entries.length === 0) return null;

  return (
    <ul className={styles.grid} aria-label={label}>
      {entries.map((entry, i) => (
        <li key={entry.href} className={styles.cell}>
          <Link href={entry.href} className={styles.tile}>
            {entry.preview && (
              <span className={styles.media}>
                <Image
                  src={entry.preview.url}
                  alt=""
                  width={entry.preview.width}
                  height={entry.preview.height}
                  sizes="(max-width: 40rem) 100vw, (max-width: 68rem) 50vw, 33vw"
                  priority={i < priorityCount}
                  loading={i < priorityCount ? "eager" : "lazy"}
                  decoding="async"
                  unoptimized={entry.preview.unoptimized}
                  className={styles.image}
                />
              </span>
            )}

            <span className={styles.label}>
              <span className={styles.title}>{entry.title}</span>
              <span className={styles.arrow} aria-hidden="true">
                &rarr;
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
