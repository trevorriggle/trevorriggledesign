import styles from "./SampleCard.module.css";

/* ============================================================================
   SAMPLE CARD, what an agent actually hands over.
   ============================================================================
   A flow diagram says what an agent does. This says what it produces: the
   email, the exception report, the lead. Set in the site's own type rather
   than dressed up as a screenshot of an interface, because none of these
   agents HAS an interface — they write to an inbox, a sheet and a channel.
   A fake application window around them would be inventing a product that
   does not exist in order to illustrate one that does.

   EVERY VALUE IN EVERY CARD IS INVENTED, AND THE CARD NO LONGER SAYS SO.
   There was a required `note` under every card reading "Sample artefact.
   Every value in it is invented." It is removed, by instruction, on all
   three.

   THE REASON IT EXISTED HAS NOT GONE AWAY and is worth leaving written down
   here rather than deleting with the field: these agents run against a live
   wholesale business, and a plausible-looking account name or dollar figure
   on a public page is a disclosure whether or not anybody checks it. Nothing
   in this component's data comes from the real system. That is now a rule
   kept by whoever edits content/agentic-ai.ts rather than one the type
   enforces.
   ========================================================================= */

export type SampleRow = {
  /** A short tag on the row: a status, a category, a source. */
  tag?: string;
  /** What the tag means for colour. Defaults to neutral. */
  tone?: "auto" | "human" | "flag";
  /** The row's own heading. */
  title: string;
  /** The row's body. */
  body: string;
};

export type SampleCardData = {
  /** Header pairs: From / Subject / Date, or Account / Run, etc. */
  chrome: { label: string; value: string }[];
  title: string;
  rows: SampleRow[];
  footer?: string;
  /** Required. States that the contents are invented. See above. */
};

export function SampleCard({
  data,
  label,
}: {
  data: SampleCardData;
  label: string;
}) {
  return (
    <figure className={styles.wrap} aria-label={label}>
      <div className={styles.card}>
        <div className={styles.chrome}>
          {data.chrome.map((row) => (
            <div key={row.label} className={styles.chromeRow}>
              <span className={styles.chromeLabel}>{row.label}</span>
              <span className={styles.chromeValue}>{row.value}</span>
            </div>
          ))}
        </div>

        <h4 className={styles.title}>{data.title}</h4>

        <ul className={styles.rows}>
          {data.rows.map((row) => (
            <li key={row.title} className={styles.row}>
              {row.tag && (
                <span
                  className={`${styles.tag} ${
                    row.tone ? styles[`tag-${row.tone}`] : ""
                  }`}
                >
                  {row.tag}
                </span>
              )}
              <p className={styles.rowTitle}>{row.title}</p>
              <p className={styles.rowBody}>{row.body}</p>
            </li>
          ))}
        </ul>

        {data.footer && <p className={styles.footer}>{data.footer}</p>}
      </div>

    </figure>
  );
}
