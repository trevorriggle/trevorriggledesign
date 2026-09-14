import styles from "./StatRow.module.css";

/* ============================================================================
   STAT ROW, a small number of oversized figures.
   ============================================================================
   For counts that are evidence rather than decoration: the things a cutover
   actually moved, at a size that says they were counted.

   THE COMPONENT RENDERS NOTHING FOR AN EMPTY LIST, which is the whole
   contract it exists to keep. Every page that uses it has slots where a
   number would belong and no number has been supplied yet, and the standing
   rule on this site is that an absent fact is absent rather than estimated,
   rounded up, or filled with a plausible-looking figure. Pass no stats and
   there is no row, no heading and no empty frame where one was going to go.

   A FIGURE IS A STRING, NOT A NUMBER. The separators, the units and any
   qualifier are part of what was measured and the component has no business
   reformatting them. It sets them in tabular numerals so a column of them
   lines up, and otherwise prints exactly what it was given.
   ========================================================================= */

export type Stat = {
  /** Exactly as it should read. "2,013", not 2013. */
  figure: string;
  /** What was counted. */
  label: string;
  /** An optional qualifier, set small under the label. */
  note?: string;
};

export function StatRow({
  stats,
  label,
}: {
  stats: Stat[];
  /** Names the group for a screen reader. */
  label: string;
}) {
  if (stats.length === 0) return null;

  return (
    <dl className={styles.row} aria-label={label}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <dt className={styles.figure}>{stat.figure}</dt>
          <dd className={styles.label}>
            {stat.label}
            {stat.note && <span className={styles.note}>{stat.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
