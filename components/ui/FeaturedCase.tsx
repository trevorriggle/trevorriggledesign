import { Band } from "./Band";
import { PullQuote } from "./PullQuote";
import { Compare } from "./Compare";
import { SpecTable } from "./SpecTable";
import { StatRow } from "./StatRow";
import type { FeaturedCase as FeaturedCaseData } from "@/content/design";
import styles from "./FeaturedCase.module.css";

/* ============================================================================
   FEATURED CASE
   ============================================================================
   The one piece of work on a design page that is not part of the archive
   below it. Rendered as an ultramarine band at the top of the page, which is
   the loudest structural move the system has, because the whole point is that
   this is not a fourth category of collateral.

   IT IS A BAND, NOT A CARD. The brief bans cards, and a "featured" treatment
   built as a bordered box with a badge on it is exactly the SaaS-landing-page
   look it bans. A full-bleed colour block that interrupts the page is the
   editorial version of the same emphasis, and it does not need a label
   reading FEATURED to be read as featured. The eyebrow says what the thing
   is, not how important it is.

   THE ORDER OF THE SECTION IS AN ARGUMENT AND IT IS DELIBERATE:

     deck → standfirst → BEFORE/AFTER → prose → table → numbers → the gap

   The comparison is third, above all of the prose, because the old site has
   been switched off and these screenshots are the only surviving evidence
   that it was ever there. A rebuild case study that describes a predecessor
   the reader cannot see is asking to be taken on trust, and this one does not
   have to be. The gap is last and it ships: see the note on `gap` in
   content/design.ts for why the unfinished half is on the page at all.

   EVERY ONE OF THOSE SLOTS IS OPTIONAL AND ABSENT MEANS ABSENT. A case with
   no table renders no table and no empty heading over one.

   THE TODO LIST IS DEVELOPMENT ONLY. `process.env.NODE_ENV` is inlined at
   build time, so in a production build the entire block is dead code and is
   dropped: the strings do not ship, and there is nothing in the HTML for a
   visitor to see.
   ========================================================================= */

export function FeaturedCase({ data }: { data: FeaturedCaseData }) {
  const showTodo = process.env.NODE_ENV !== "production" && data.todo.length > 0;
  const dir = data.compareDir;

  return (
    <Band
      ground="ultramarine"
      grid
      id={data.slug}
      className={styles.band}
      aria-label={data.title}
    >
      <div className={styles.head}>
        <p className={`label ${styles.eyebrow}`}>{data.eyebrow}</p>
        <h2 className={styles.title}>{data.title}</h2>
        <p className={styles.deck}>{data.deck}</p>
      </div>

      <div className={styles.standfirstBlock}>
        <p className={`intro ${styles.standfirst}`}>{data.standfirst}</p>
      </div>

      {dir && data.compare && data.compare.length > 0 && (
        <div className={styles.compareSlot}>
          {data.compare.map((pair, i) => (
            <Compare
              key={pair.label}
              label={pair.label}
              /* Only the first pair is above the fold. */
              eager={i === 0}
              before={{
                ...pair.before,
                src: `/media/${dir}/${pair.before.src}`,
                label: "Before",
              }}
              after={{
                ...pair.after,
                src: `/media/${dir}/${pair.after.src}`,
                label: "After",
              }}
            />
          ))}
        </div>
      )}

      <div className={styles.blocks}>
        {data.blocks.map((block) => (
          <section key={block.heading} className={styles.block}>
            <h3 className={styles.blockHeading}>{block.heading}</h3>
            <div className={styles.blockBody}>
              {block.body.map((para, i) => (
                <p key={i} className={styles.para}>
                  {para}
                </p>
              ))}
            </div>
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

      {data.gap && (
        <div className={styles.blocks}>
          <section className={styles.block}>
            <h3 className={styles.blockHeading}>{data.gap.heading}</h3>
            <div className={styles.blockBody}>
              {data.gap.body.map((para, i) => (
                <p key={i} className={styles.para}>
                  {para}
                </p>
              ))}
            </div>
          </section>
        </div>
      )}

      {data.quote && (
        <div className={styles.quoteSlot}>
          <PullQuote>{data.quote}</PullQuote>
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
