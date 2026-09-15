import { Band } from "./Band";
import { SpecTable } from "./SpecTable";
import { StatRow } from "./StatRow";
import { ScrollSequence } from "./ScrollSequence";
import type { FeaturedCase as FeaturedCaseData } from "@/content/design";
import styles from "./FeaturedCase.module.css";

/* ============================================================================
   FEATURED CASE
   ============================================================================
   The one piece of work on a design page that is a case study rather than a
   folder of pictures. Rendered as a deep blue band, which is the loudest
   structural move the system has.

   IT SITS IN THE RUN NOW, not above it, and it is in the subnav. See
   app/design/[category]/page.tsx and the note on the running order in
   content/design.ts for why that reversed. Its position is no longer what
   marks it as the feature; the treatment is, and none of that moved.

   THE GROUND IS `ultramarine-deep` RATHER THAN `ultramarine`. Ultramarine is
   right for a band carrying one sentence. This band carries a case study, and
   a full screen of #1b2ecc behind prose, a table, three statistics and two
   full-width screenshots glares. Same hue, half the luminance. See tokens.css.

   IT IS A BAND, NOT A CARD. The brief bans cards, and a "featured" treatment
   built as a bordered box with a badge on it is exactly the SaaS-landing-page
   look it bans. A full-bleed colour block that interrupts the page is the
   editorial version of the same emphasis, and it does not need a label
   reading FEATURED to be read as featured. The eyebrow says what the thing
   is, not how important it is.

   THE ORDER OF THE SECTION IS AN ARGUMENT AND IT IS DELIBERATE:

     deck → BEFORE/AFTER → prose → table → numbers

   The comparison is second, above all of the prose, because the old site has
   been switched off and these screenshots are the only surviving evidence
   that it was ever there. A rebuild case study that describes a predecessor
   the reader cannot see is asking to be taken on trust, and this one does not
   have to be.

   THE COMPARISONS ARE SCROLL SEQUENCES, NOT SIDE-BY-SIDE FRAMES. Two 2:1
   desktop grabs set beside each other render at about 580px across, which is
   a picture of a website rather than a website you can read, and the whole
   claim of this section is what is written on those two pages. As a sequence
   each one takes the full stage and roughly doubles in width, and the reader
   moves between them by scrolling. Same component as the DrawEvolve loop, in
   its `wide` layout. See ScrollSequence.

   EVERY ONE OF THOSE SLOTS IS OPTIONAL AND ABSENT MEANS ABSENT. A case with
   no table renders no table and no empty heading over one.

   THE TODO LIST IS DEVELOPMENT ONLY. `process.env.NODE_ENV` is inlined at
   build time, so in a production build the entire block is dead code and is
   dropped: the strings do not ship, and there is nothing in the HTML for a
   visitor to see.
   ========================================================================= */

export function FeaturedCase({
  data,
  /* ITS PLACE IN THE RUN. The section is numbered with the folder sections
     now rather than sitting above them unnumbered, so the page counts
     01, 02, 03 straight through instead of skipping the largest thing on it.
     Absent renders no ordinal, which is what a page with no subnav wants. */
  number,
}: {
  data: FeaturedCaseData;
  number?: string;
}) {
  const showTodo = process.env.NODE_ENV !== "production" && data.todo.length > 0;
  const dir = data.compareDir;

  return (
    <Band
      ground="ultramarine-deep"
      grid
      id={data.slug}
      className={styles.band}
      aria-label={data.title}
    >
      <div>
        <p className={styles.eyebrow}>
          {number && (
            <span className={`ordinal ${styles.number}`} aria-hidden="true">
              {number}
            </span>
          )}
          <span className="label">{data.eyebrow}</span>
        </p>
        <h2 className={styles.title}>{data.title}</h2>
        <p className={styles.deck}>{data.deck}</p>
      </div>

      {data.standfirst && (
        <div className={styles.standfirstBlock}>
          <p className={`intro ${styles.standfirst}`}>{data.standfirst}</p>
        </div>
      )}

      {dir && data.sequences && data.sequences.length > 0 && (
        <div className={styles.compareSlot}>
          {data.sequences.map((seq, i) => (
            <ScrollSequence
              key={seq.label}
              label={seq.label}
              layout="wide"
              /* Only the first sequence is anywhere near the fold. */
              priorityFirst={i === 0}
              shots={seq.shots.map((shot) => ({
                ...shot,
                url: `/media/${dir}/${shot.src}`,
              }))}
            />
          ))}
        </div>
      )}

      <div className={styles.blocks}>
        {data.blocks.map((block) => (
          <section key={block.heading} className={styles.block}>
            <h3 className={styles.blockHeading}>{block.heading}</h3>
            {block.body.map((para, i) => (
              <p key={i} className={styles.para}>
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>

      {data.table && (
        <div className={styles.tableSlot}>
          <SpecTable caption={data.table.caption} rows={data.table.rows} />
        </div>
      )}

      {data.numbers && data.numbers.stats.length > 0 && (
        <div className={styles.numbersSlot}>
          <h3 className={styles.numbersHeading}>{data.numbers.heading}</h3>
          <StatRow stats={data.numbers.stats} label={data.numbers.label} />
        </div>
      )}

      {showTodo && (
        <aside className={styles.todo}>
          <h3 className={styles.todoHeading}>
            Scaffold. Development only, never rendered in production.
          </h3>
          <ul className={styles.todoList}>
            {data.todo.map((item) => (
              <li key={item} className={styles.todoItem}>
                {item}
              </li>
            ))}
          </ul>
        </aside>
      )}
    </Band>
  );
}
