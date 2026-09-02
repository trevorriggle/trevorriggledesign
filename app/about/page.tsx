import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MetaRail, Meta, MetaChips } from "@/components/ui/MetaRail";
import { site } from "@/lib/site";
import grid from "@/components/ui/grid.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  /* TODO: under ~160 characters. */
  description: "TODO",
};

/* ============================================================================
   ABOUT
   ============================================================================
   Structure without copy, on purpose.

   Each movement below is a prompt, and each `.hint` says what belongs there
   and — more usefully — what does not. The prompts are ordered as the argument
   a technical hiring team needs: what you do now, how you got the engineering
   ability, how you work, what you are looking for.

   Delete the hints as you fill them in.
   ========================================================================= */

const movements = [
  {
    ordinal: "01",
    label: "What I do now",
    hint:
      "Present tense, concrete. Name the systems, the surfaces and the stack. This is the paragraph that has to make a design-engineer role feel obvious, so it should be about what you ship, not about how you approach design.",
  },
  {
    ordinal: "02",
    label: "How I got here",
    hint:
      "BFA, then Swift, then full stack, then AI products. The through-line is the interesting part: say what the design training gives you that a self-taught engineer usually lacks, and what shipping code gives you that a designer usually lacks. Two sentences, no career-narrative arc.",
  },
  {
    ordinal: "03",
    label: "How I work",
    hint:
      "The mechanics: how you scope, where you start, how you decide something is done, what you do when a model is unreliable. Specifics an interviewer can push on. Not values, not adjectives.",
  },
  {
    ordinal: "04",
    label: "What I'm looking for",
    hint:
      "Role shape, team shape, problem domain. Being specific here filters out the wrong conversations, which is the point.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Container as="header" className={styles.head}>
        <h1 className={styles.title}>About</h1>
      </Container>

      <Container>
        <div className={styles.grid}>
          <div className={styles.main}>
            {/* TODO: the lead. Two or three sentences: what you build, what you
                bring that is unusual, and what you are after. */}
            <p className={styles.lead}>TODO</p>

            {movements.map((m) => (
              <section key={m.ordinal} className={styles.movement}>
                <p className={styles.ordinal} aria-hidden="true">
                  {m.ordinal}
                </p>
                <div>
                  <h2 className={styles.label}>{m.label}</h2>
                  <p className={styles.prose}>TODO</p>
                  <p className={styles.hint}>{m.hint}</p>
                </div>
              </section>
            ))}
          </div>

          <div className={`${styles.rail} ${grid.railRuled}`}>
            <MetaRail>
              <Meta term="Based" value={site.location} />
              <Meta term="Looking for" value={site.availability} />
              {/* TODO: replace these with the real lists. Keep them short —
                  a rail is metadata, and a 40-item tool list is noise. */}
              <MetaChips term="Building with" items={["TODO"]} />
              <MetaChips term="Designing with" items={["TODO"]} />
              <MetaChips term="Shipped on" items={["TODO"]} />
            </MetaRail>
          </div>
        </div>
      </Container>
    </>
  );
}
