import type { Budget, FailureMode, ModelRow } from "@/content/schema";
import styles from "./Tables.module.css";

/** The model/provider row. Which model, doing what, and why that one. */
export function ModelTable({ models }: { models: ModelRow[] }) {
  if (models.length === 0) return null;

  return (
    <section className={styles.block} aria-labelledby="models-heading">
      <h2 id="models-heading" className={styles.heading}>
        Models &amp; providers
      </h2>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Role</th>
              <th scope="col">Provider</th>
              <th scope="col">Model</th>
              <th scope="col">Why this one</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m, i) => (
              <tr key={i}>
                <td className={styles.strong}>{m.role}</td>
                <td>{m.provider}</td>
                <td>{m.model}</td>
                <td className={styles.sentence}>{m.why ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** The latency-or-cost constraint the system was built against. */
export function BudgetBlock({ budget }: { budget: Budget }) {
  return (
    <section className={styles.block} aria-labelledby="budget-heading">
      <h2 id="budget-heading" className={styles.heading}>
        {budget.metric} budget
      </h2>
      <div className={styles.budget}>
        <p>
          <span className={styles.budgetTerm}>Target</span>
          <span className={styles.budgetFigure}>{budget.target}</span>
        </p>
        {budget.measured && (
          <p>
            <span className={styles.budgetTerm}>Measured</span>
            <span className={styles.budgetFigure}>{budget.measured}</span>
          </p>
        )}
        {budget.method && <p className={styles.budgetMethod}>{budget.method}</p>}
      </div>
    </section>
  );
}

/**
 * What the system does when the model is wrong.
 *
 * Given its own block, at full width, because it is the question that
 * separates someone who has shipped an AI feature from someone who has demoed
 * one — and because "the model" is the one component in these systems that is
 * wrong as a matter of routine rather than as a failure.
 */
export function FailureTable({ modes }: { modes: FailureMode[] }) {
  if (modes.length === 0) return null;

  return (
    <section className={styles.block} aria-labelledby="failure-heading">
      <h2 id="failure-heading" className={styles.heading}>
        When the model is wrong
      </h2>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Failure</th>
              <th scope="col">What the system does</th>
              <th scope="col">Who finds out</th>
            </tr>
          </thead>
          <tbody>
            {modes.map((mode, i) => (
              <tr key={i}>
                <td className={styles.strong}>{mode.when}</td>
                <td className={`${styles.sentence} ${styles.then}`}>{mode.then}</td>
                <td className={styles.sentence}>{mode.surfaced ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
