import Link from "next/link";
import Image from "next/image";
import styles from "./WorkIndex.module.css";

/* ============================================================================
   THE WORK INDEX, and it is the browse tier for the whole site.
   ============================================================================
   A numbered, ruled list where every entry shows its picture ON LOAD.

   WHAT THIS REPLACED, AND WHY. The browse tier was <IndexList>: names at 38 to
   57px on hairlines, with each entry's picture held under the POINTER and
   revealed on hover. It was a considered piece of work and it was the wrong
   answer to the only question that matters here.

   The brief: "Work must be visible on load, with no mouse movement required."
   The reason is the audience. Most people open this on a phone, and a
   meaningful number open it after a final-round interview while deciding
   whether to argue for the candidate in a debrief. A browse tier whose
   pictures require a mouse shows that reader a list of four words. Hover is
   not a progressive enhancement when it is the only way to see the work; it
   is a gate, and on a touch screen it is a locked one.

   The old component did have a touch fallback that laid the pictures out
   inline, so phones were not literally broken. But it meant the design was
   maintained twice and the DESKTOP version, the one the author looked at
   while building it, was the gated one. That is how a gate survives review.

   WHAT THIS DOES INSTEAD. Ordinal, title, deck and picture are all in the
   layout, always, on every device, with no JavaScript. This is a server
   component: there is no "use client", no pointer handler, no state, and no
   hydration. The previous version shipped a client component to the browser
   so it could listen for mousemove.

   MOTION IS STILL HERE, AND IT IS ON TOP OF VISIBLE CONTENT. The picture
   lifts slightly and the rule thickens on hover and focus. Remove all of it
   and the page is unchanged in what it communicates, which is the test for
   whether motion is an enhancement or a gate.

   PROPORTION IS PRESERVED BY DEFAULT. Each picture renders at its own ratio,
   bounded on both axes, never cropped to a uniform tile. A print spread comes
   out wide and a phone screenshot comes out tall, because the shape of the
   thing is one of the things the picture has to say. The height cap is what
   stops a 2064x2752 iPad grab from being three screens tall.

   `uniform` OPTS OUT OF THAT, AND ONLY /design USES IT. Three bodies of design
   work are three covers for three sections, and read as a set: a 2:1 spread
   filling the column beside a 4:3 card stopping 220px short read as a ragged
   list rather than as three doors. Applications keeps native proportion,
   because those previews are portrait phone screenshots and a landscape tile
   would crop the product out of its own picture.

   NO META ROW. Entries used to carry a derived count or a status word on the
   right. Both are gone site-wide, see lib/cards.ts.
   ========================================================================= */

export type WorkEntry = {
  href: string;
  title: string;
  /** One line. A deck or an intro, verbatim, never body copy. */
  description?: string;
  preview: {
    url: string;
    width: number;
    height: number;
    /** GIF or SVG: served as the file itself, no optimiser. */
    unoptimized: boolean;
  } | null;
};

/* The media column is 8 of 12 inside a 90rem container, so it tops out near
   780px. Below the collapse it is the full column. */
const PREVIEW_SIZES = "(max-width: 62rem) 100vw, (max-width: 90rem) 66vw, 48rem";

export function WorkIndex({
  entries,
  label,
  /** Eager-loads the first picture. It is the LCP candidate on these pages. */
  priorityFirst = false,
  /**
   * One 4:3 box for every row, filled edge to edge, centre-cropped. Off by
   * default: it throws away the picture's own shape, which is only the right
   * trade where the set matters more than the individual frame.
   */
  uniform = false,
}: {
  entries: WorkEntry[];
  label?: string;
  priorityFirst?: boolean;
  uniform?: boolean;
}) {
  if (entries.length === 0) return null;

  return (
    <ol className={styles.list} aria-label={label}>
      {entries.map((entry, i) => (
        <li key={entry.href} className={styles.row}>
          <Link href={entry.href} className={styles.link}>
            {/* The head reads ordinal, name, out. Same idiom as <SectionHead>,
                so an index row and a section opening are visibly the same
                system rather than two takes on a numbered heading. */}
            <span className={styles.head}>
              <span className={`ordinal ${styles.ordinal}`} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.title}>{entry.title}</span>
              <span className={styles.arrow} aria-hidden="true">
                &rarr;
              </span>
            </span>

            {entry.preview && (
              <span
                className={
                  uniform ? `${styles.media} ${styles.mediaUniform}` : styles.media
                }
              >
                <Image
                  src={entry.preview.url}
                  alt=""
                  width={entry.preview.width}
                  height={entry.preview.height}
                  sizes={PREVIEW_SIZES}
                  priority={priorityFirst && i === 0}
                  loading={priorityFirst && i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  /* An animated GIF preview stays animated. */
                  unoptimized={entry.preview.unoptimized}
                  className={styles.image}
                />
              </span>
            )}

            {entry.description && (
              <span className={styles.deck}>{entry.description}</span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}
