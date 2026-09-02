import type { ReactNode } from "react";
import { ExternalLink } from "./ExternalLink";
import type { ExternalLinkRef } from "@/content/schema";
import styles from "./MetaRail.module.css";

export function MetaRail({ children }: { children: ReactNode }) {
  return <dl className={styles.rail}>{children}</dl>;
}

/** One term/value pair. Renders nothing when there is no value, so an
 *  unfilled optional field leaves no empty label behind. */
export function Meta({
  term,
  value,
  children,
}: {
  term: string;
  value?: string | number | null;
  children?: ReactNode;
}) {
  const hasValue = children ?? (value !== null && value !== undefined && value !== "");
  if (!hasValue) return null;

  return (
    <div className={styles.group}>
      <dt className={styles.term}>{term}</dt>
      <dd className={styles.value}>{children ?? value}</dd>
    </div>
  );
}

export function MetaChips({ term, items }: { term: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className={styles.group}>
      <dt className={styles.term}>{term}</dt>
      <dd className={styles.value}>
        <ul className={styles.stack}>
          {items.map((item) => (
            <li key={item} className={styles.chip}>
              {item}
            </li>
          ))}
        </ul>
      </dd>
    </div>
  );
}

export function MetaLinks({
  term,
  links,
}: {
  term: string;
  links: ExternalLinkRef[];
}) {
  if (links.length === 0) return null;

  return (
    <div className={styles.group}>
      <dt className={styles.term}>{term}</dt>
      <dd className={styles.value}>
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <span className={styles.linkKind}>{link.kind}</span>
              <ExternalLink href={link.href} showHost>
                {link.label}
              </ExternalLink>
            </li>
          ))}
        </ul>
      </dd>
    </div>
  );
}
