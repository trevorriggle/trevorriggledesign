import styles from "./SpecTable.module.css";

/* ============================================================================
   SPEC TABLE, old against new, one layer per row.
   ============================================================================
   A real <table>, because this is real tabular data: three columns, a fixed
   set of rows, and every cell only means something at the intersection of its
   row and its column. The same content as a bulleted list loses the thing
   that makes it worth reading, which is that you can run your eye down one
   column and see a whole architecture at once.

   IT KEEPS ITS SEMANTICS WHEN IT RESTACKS. On a phone the three columns
   become one block per row, which is the only readable answer for cells this
   long at 320px — a horizontal scroller full of prose is worse than useless.
   Switching a <td> to `display: block` drops its implicit table role in most
   engines, so the roles are written out explicitly in the markup and survive
   the change. The stacked version labels each cell with its column via
   `data-label`, so "WordPress + WooCommerce..." never appears without the
   word "Was" attached to it.

   IT SITS ON A COLOUR BAND, so every colour here is a --ground-* variable,
   which <Band> rebinds per ground. Nothing in this file names a colour.
   ========================================================================= */

export type SpecRow = {
  /** The layer being compared. Renders as the row's header cell. */
  label: string;
  was: string;
  now: string;
};

export function SpecTable({
  rows,
  caption,
  columns = ["Was", "Now"],
}: {
  rows: SpecRow[];
  /** Required: a table with no caption is a grid of strings. */
  caption: string;
  columns?: [string, string];
}) {
  return (
    <div className={styles.wrap}>
      <table role="table" className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>

        <thead role="rowgroup" className={styles.head}>
          <tr role="row">
            <th role="columnheader" scope="col" className={styles.colLayer}>
              Layer
            </th>
            <th role="columnheader" scope="col" className={styles.col}>
              {columns[0]}
            </th>
            <th role="columnheader" scope="col" className={styles.col}>
              {columns[1]}
            </th>
          </tr>
        </thead>

        <tbody role="rowgroup">
          {rows.map((row) => (
            <tr role="row" key={row.label} className={styles.row}>
              <th
                role="rowheader"
                scope="row"
                className={styles.rowLabel}
              >
                {row.label}
              </th>
              <td
                role="cell"
                className={styles.was}
                data-label={columns[0]}
              >
                {row.was}
              </td>
              <td
                role="cell"
                className={styles.now}
                data-label={columns[1]}
              >
                {row.now}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
