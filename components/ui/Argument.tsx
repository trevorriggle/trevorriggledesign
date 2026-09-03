import type { ReactNode } from "react";
import type { CaseStudy } from "@/content";
import { withNeeds } from "./Needs";
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
   The five spine fields, in the order they have to be read in. Note what is
   absent: no problem/solution framing, no feature list, no tech-stack section
   (the stack is metadata and lives in the rail), and no roadmap. Those five
   moves are what a hiring manager can actually interrogate.

   Each movement renders only if its field is present, and the ordinals are
   assigned over what survives — so a study that fills three of the five reads
   01/02/03, not 01/03/05 with two holes in it. The whole component returns
   null when none are present, which is the case for every entry whose argument
   is carried by its own prose in the MDX body instead. See DECISIONS.md.
   ========================================================================= */
export function Argument({ study }: { study: CaseStudy }) {
  const { constraint, attempts, tradeoff, outcome, revisit } = study;

  const movements: { label: string; content: ReactNode }[] = [];

  if (constraint) {
    movements.push({
      label: "The constraint",
      content: <p className={styles.claim}>{withNeeds(constraint)}</p>,
    });
  }

  if (attempts.length > 0) {
    movements.push({
      label: "What failed",
      content: (
        <ul className={styles.attempts}>
          {attempts.map((attempt, i) => (
            <li key={i} className={styles.attempt}>
              <p className={styles.tried}>{withNeeds(attempt.tried)}</p>
              <p className={styles.failed}>
                <span className={styles.failedTag}>why not</span>
                <span>{withNeeds(attempt.failed)}</span>
              </p>
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (tradeoff) {
    movements.push({
      label: "The tradeoff",
      content: (
        <div className={styles.tradeoff}>
          <div className={styles.leg}>
            <p className={styles.legTerm}>Chose</p>
            <p>{withNeeds(tradeoff.chose)}</p>
          </div>
          <div className={styles.leg}>
            <p className={styles.legTerm}>Over</p>
            <p>{withNeeds(tradeoff.instead_of)}</p>
          </div>
          <div className={`${styles.leg} ${styles.costLeg}`}>
            <p className={styles.legTerm}>Cost</p>
            <p>{withNeeds(tradeoff.cost)}</p>
          </div>
        </div>
      ),
    });
  }

  if (outcome) {
    movements.push({
      label: "Outcome",
      content: (
        <>
          <p className={styles.claim}>{withNeeds(outcome.what)}</p>
          {outcome.evidence && (
            <p className={styles.evidence}>
              <span className={styles.evidenceTag}>measured</span>
              <span>{withNeeds(outcome.evidence)}</span>
            </p>
          )}
        </>
      ),
    });
  }

  if (revisit) {
    movements.push({
      label: "What I'd do differently",
      content: <p className={styles.prose}>{withNeeds(revisit)}</p>,
    });
  }

  if (movements.length === 0) return null;

  return (
    <div className={styles.argument}>
      {movements.map((m, i) => (
        <Movement
          key={m.label}
          ordinal={String(i + 1).padStart(2, "0")}
          label={m.label}
        >
          {m.content}
        </Movement>
      ))}
    </div>
  );
}

/** Does this study have any spine field to render? Lets a page skip the whole
 *  block, rather than emitting an empty container around a null. */
export function hasArgument(study: CaseStudy): boolean {
  return Boolean(
    study.constraint ||
      study.attempts.length > 0 ||
      study.tradeoff ||
      study.outcome ||
      study.revisit,
  );
}
