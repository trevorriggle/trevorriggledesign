import styles from "./Empty.module.css";

/**
 * Placeholder for a section with no entries yet — the structural twin of
 * <Placeholder /> for images.
 *
 * DEVELOPMENT ONLY. It prints repo paths and a scaffolding instruction, which
 * is exactly what the author needs while filling a section and exactly what a
 * visitor must never see under a heading on a live site. In production the
 * section renders its heading and its intro and stops there — which is honest:
 * the intro is real copy, and there is nothing under it yet.
 */
export function Empty({ kind, sectionId }: { kind: "case" | "gallery"; sectionId: string }) {
  if (process.env.NODE_ENV === "production") return null;

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
