import type { ReactNode } from "react";
import styles from "./Blocks.module.css";

/** A digression that shouldn't interrupt the main line of argument. */
export function Aside({ children }: { children: ReactNode }) {
  return <aside className={styles.aside}>{children}</aside>;
}

/** Two things side by side, before/after, rejected/shipped. */
export function Compare({ children }: { children: ReactNode }) {
  return <div className={styles.compare}>{children}</div>;
}

export function Column({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.column}>
      <p className={styles.columnLabel}>{label}</p>
      {children}
    </div>
  );
}
