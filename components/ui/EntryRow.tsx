import Link from "next/link";
import type { Entry } from "@/content";
import styles from "./EntryRow.module.css";

/** One row of the work index. `index` is the running-order position, shown as
 *  a mono ordinal — the manual order made visible. */
export function EntryRow({ entry, index }: { entry: Entry; index: string }) {
  const isCase = entry.kind === "case";

  return (
    <Link href={entry.href} className={styles.row}>
      <span className={styles.index} aria-hidden="true">
        {index}
      </span>

      <span className={styles.body}>
        <span className={styles.title}>{entry.title}</span>

        {isCase ? (
          <span className={styles.deck}>{entry.deck}</span>
        ) : (
          entry.caption && <span className={styles.deck}>{entry.caption}</span>
        )}

        {isCase && entry.stack.length > 0 && (
          <span className={styles.chips}>
            {entry.stack.slice(0, 6).map((item) => (
              <span key={item} className={styles.chip}>
                {item}
              </span>
            ))}
          </span>
        )}
      </span>

      <span className={styles.meta}>
        <span className={styles.metaStrong}>{entry.year}</span>
        {isCase ? (
          <>
            <span>{entry.role.join(" · ")}</span>
            <span>{entry.context}</span>
          </>
        ) : (
          <>
            <span>{entry.medium}</span>
            <span>
              {entry.images.length} image
              {entry.images.length === 1 ? "" : "s"}
            </span>
          </>
        )}
      </span>
    </Link>
  );
}
