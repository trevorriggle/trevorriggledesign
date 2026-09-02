import styles from "./Empty.module.css";

/** Placeholder for a section with no entries yet — the structural twin of
 *  <Placeholder /> for images. Prints the path that would fill it. */
export function Empty({ kind, sectionId }: { kind: "case" | "gallery"; sectionId: string }) {
  const dir = kind === "case" ? "work" : "gallery";

  return (
    <p className={styles.empty}>
      No entries yet. Copy{" "}
      <span className={styles.path}>content/{dir}/_template/</span> to{" "}
      <span className={styles.path}>content/{dir}/&lt;slug&gt;/</span>, set{" "}
      <span className={styles.path}>section: {sectionId}</span>, and add the slug
      to <span className={styles.path}>content/order.ts</span>.
    </p>
  );
}
