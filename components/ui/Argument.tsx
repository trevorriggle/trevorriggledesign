import type { ReactNode } from "react";
import type { CaseStudy } from "@/content";
import styles from "./Argument.module.css";

function Movement({
  ordinal,
  label,
  children,
}: {
  ordinal: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.movement} aria-label={label}>
      <p className={styles.ordinal} aria-hidden="true">
        {ordinal}
      </p>
      <div className={styles.body}>
        <h2 className={styles.label}>{label}</h2>
        {children}
      </div>
    </section>
  );
}

/* ============================================================================
   ARGUMENT
   ============================================================================
   The five required fields, in the order they have to be read in. Note what is
   absent: no problem/solution framing, no feature list, no tech-stack section
   (the stack is metadata and lives in the rail), and no roadmap. Those five
   moves are what a hiring manager can actually interrogate.
   ========================================================================= */
export function Argument({ study }: { study: CaseStudy }) {
  const { constraint, attempts, tradeoff, outcome, revisit } = study;

  return (
    <div className={styles.argument}>
      <Movement ordinal="01" label="The constraint">
        <p className={styles.claim}>{constraint}</p>
      </Movement>

      <Movement ordinal="02" label="What failed">
        <ul className={styles.attempts}>
          {attempts.map((attempt, i) => (
            <li key={i} className={styles.attempt}>
              <p className={styles.tried}>{attempt.tried}</p>
              <p className={styles.failed}>
                <span className={styles.failedTag}>why not</span>
                <span>{attempt.failed}</span>
              </p>
            </li>
          ))}
        </ul>
      </Movement>

      <Movement ordinal="03" label="The tradeoff">
        <div className={styles.tradeoff}>
          <div className={styles.leg}>
            <p className={styles.legTerm}>Chose</p>
            <p>{tradeoff.chose}</p>
          </div>
          <div className={styles.leg}>
            <p className={styles.legTerm}>Over</p>
            <p>{tradeoff.instead_of}</p>
          </div>
          <div className={`${styles.leg} ${styles.costLeg}`}>
            <p className={styles.legTerm}>Cost</p>
            <p>{tradeoff.cost}</p>
          </div>
        </div>
      </Movement>

      <Movement ordinal="04" label="Outcome">
        <p className={styles.claim}>{outcome.what}</p>
        {outcome.evidence && (
          <p className={styles.evidence}>
            <span className={styles.evidenceTag}>measured</span>
            <span>{outcome.evidence}</span>
          </p>
        )}
      </Movement>

      <Movement ordinal="05" label="What I'd do differently">
        <p className={styles.prose}>{revisit}</p>
      </Movement>
    </div>
  );
}
