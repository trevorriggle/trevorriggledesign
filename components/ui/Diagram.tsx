import { Frame } from "./Frame";
import type { ResolvedImage } from "@/content";
import type { Architecture } from "@/content/schema";
import styles from "./Diagram.module.css";

type Arch = Omit<Architecture, "diagram"> & { diagram: ResolvedImage | null };

/* ============================================================================
   ARCHITECTURE
   ============================================================================
   Renders the flow chain, the drawn diagram if one exists, and the stage
   table. All three are optional and independently useful — the typographic
   version alone is a complete answer to "how is this put together", which is
   why the section holds up with zero images.
   ========================================================================= */
export function Diagram({ architecture }: { architecture: Arch }) {
  const { caption, stages, flow, diagram } = architecture;
  const byId = new Map(stages.map((s) => [s.id, s]));

  return (
    <section className={styles.diagram} aria-label="System architecture">
      <p className={styles.caption}>{caption}</p>

      {flow.length > 0 && (
        <ol className={styles.flow}>
          {flow.map((step, i) => {
            // A flow entry may be "a -> b -> c" or a single id; both normalise
            // to a chain so the source can be written whichever way reads best.
            const ids = step.split(/\s*(?:->|→)\s*/).filter(Boolean);
            return (
              <li key={`${step}-${i}`} className={styles.flowStep}>
                {ids.map((id, j) => {
                  const stage = byId.get(id);
                  return (
                    <span key={`${id}-${j}`} className={styles.flowStep}>
                      <span
                        className={[
                          styles.node,
                          stage ? styles[stage.kind] : undefined,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {id}
                      </span>
                      {j < ids.length - 1 && (
                        <span className={styles.arrow} aria-hidden="true">
                          →
                        </span>
                      )}
                    </span>
                  );
                })}
                {i < flow.length - 1 && (
                  <span className={styles.arrow} aria-hidden="true">
                    ·
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {diagram && (
        <Frame
          image={diagram}
          role="architecture"
          sizes="(max-width: 60rem) 100vw, 60vw"
        />
      )}

      {stages.length > 0 && (
        <dl className={styles.stages}>
          {stages.map((stage) => (
            <div key={stage.id} style={{ display: "contents" }}>
              <dt className={styles.stageId}>
                {stage.id} · {stage.kind}
              </dt>
              <dd className={styles.stageBody}>
                <span className={styles.stageLabel}>{stage.label}</span>
                {stage.detail && (
                  <p className={styles.stageDetail}>{stage.detail}</p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
