import { Band } from "./Band";
import { PullQuote } from "./PullQuote";
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

   THE TODO LIST IS DEVELOPMENT ONLY. `process.env.NODE_ENV` is inlined at
   build time, so in a production build the entire block is dead code and is
   dropped: the strings do not ship, and there is nothing in the HTML for a
   visitor to see. This is how the scaffold stays visible to the author
   without a note addressed to the author appearing on a page a hiring manager
   is reading.

   WITH NO MEDIA, THIS RENDERS AS COPY. That is the honest state while there
   are no screenshots: a section that says what the work is, with nothing
   pretending to be a picture of it. No grey boxes, no "coming soon", same
   standing rule as the rest of the site.
   ========================================================================= */

export function FeaturedCase({ data }: { data: FeaturedCaseData }) {
  const showTodo = process.env.NODE_ENV !== "production" && data.todo.length > 0;

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

      <div className={styles.body}>
        <p className={`intro ${styles.standfirst}`}>{data.standfirst}</p>

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
      </div>

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
