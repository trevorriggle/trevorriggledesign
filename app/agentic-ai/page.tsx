import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { SubNav } from "@/components/ui/SubNav";
import { AgentFlow } from "@/components/ui/AgentFlow";
import { SampleCard } from "@/components/ui/SampleCard";
import { StatRow } from "@/components/ui/StatRow";
import { method, agents } from "@/content/agentic-ai";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Agentic AI",
  description:
    "Four production agents running against a live wholesale business, and the approval gates that make them safe to point at one.",
  alternates: { canonical: "/agentic-ai" },
};

/* ============================================================================
   /agentic-ai
   ============================================================================
   THE THESIS IS NOT "I USE AI" and the page is built so that it cannot be
   read that way. It is: I scope agentic work, I make the model justify itself
   before it acts, and I decide deliberately where a person stays in the loop.
   Method comes first because it is the claim; the four agents follow because
   they are the evidence for it; and every one of them closes on the sentence
   that ladders it back to the thesis.

   BILLING IS SECOND, NOT LAST. It is the strongest of the four and the only
   one that moves money, so it takes the position directly after the method it
   demonstrates. Its diagram is the only one with a fork in it, which makes it
   the page's single best image and the reason the diagrams exist at all.

   THE DIAGRAMS ARE THE ARGUMENT, NOT DECORATION. One notation across four
   flows: ultramarine is the automated path, ochre is where a person enters,
   flare is an exception held back. A reader who looks at nothing but the
   pictures should still come away knowing that this author thinks about where
   the human goes. See components/ui/AgentFlow.tsx for why those three
   colours and not the three the brief named.

   NO SCREENSHOTS, AND NO INVENTED INTERFACES. These agents have no UI — they
   write to an inbox, a report and a sheet. A mocked-up dashboard would be
   illustrating a product that does not exist. The sample cards show the
   artefacts instead, set in the site's own type, every value invented and
   labelled as invented on the card.

   THE STAT SLOT IS EMPTY ON ALL FOUR, and <StatRow> renders nothing for an
   empty list, so there is no heading over an absent number. Supply one in
   content/agentic-ai.ts and it appears.
   ========================================================================= */

const IS_DEV = process.env.NODE_ENV !== "production";

const LEAD =
  "I scope the work, make the model justify itself before it acts, and decide where a person stays in the loop.";

export default function AgenticAIPage() {
  const navItems = [
    { id: "method", label: "Method" },
    ...agents.map((agent) => ({ id: agent.slug, label: agent.nav })),
  ];

  return (
    <>
      {/* At the very top, above the title, the same position the design
          category pages put theirs. */}
      <SubNav items={navItems} label="Agentic AI, sections" />

      <Container as="header" className={styles.head}>
        <div className={styles.headGrid}>
          <h1 className={styles.title}>Agentic AI</h1>
          <div className={styles.lead}>
            <p className={styles.para}>{LEAD}</p>
            <p className={styles.support}>
              Four agents in production against a live wholesale business.
            </p>
          </div>
        </div>
      </Container>

      {/* ---- Method ---- */}
      <Container as="section" className={styles.section}>
        <SectionHead id="method" title={method.title} />
        <div className={styles.methodBody}>
          {method.body.map((para, i) => (
            <p key={i} className={styles.prose}>
              {para}
            </p>
          ))}
        </div>
      </Container>

      {/* ---- The four agents ---- */}
      {agents.map((agent, i) => (
        <Container as="section" key={agent.slug} className={styles.section}>
          <SectionHead
            id={agent.slug}
            title={agent.title}
            intro={agent.deck}
          />

          {/* The diagram leads the section. It is the hero, and it says in a
              picture what the paragraphs under it then say in words. */}
          <figure className={styles.flow}>
            <AgentFlow
              nodes={agent.flow.nodes}
              edges={agent.flow.edges}
              label={agent.flow.label}
            />
            <figcaption className={styles.flowCaption}>
              {agent.flow.caption}
            </figcaption>
          </figure>

          {/* `solo` when there is no sample card. See page.module.css: the
              half-width copy column is one side of a pair, and one of the
              four agents has nothing to pair with. */}
          <div
            className={[styles.body, agent.sample ? "" : styles.solo]
              .filter(Boolean)
              .join(" ")}
          >
            <div className={styles.prose}>
              {agent.body.map((para, j) => (
                <p key={j} className={styles.para2}>
                  {para}
                </p>
              ))}

              {/* The sentence the section exists to deliver. */}
              <p className={styles.point}>{agent.point}</p>
            </div>

            {agent.sample && (
              <div className={styles.sample}>
                <SampleCard
                  data={agent.sample.data}
                  label={agent.sample.label}
                />
              </div>
            )}
          </div>

          {/* `data-ground` is what binds --ground-* for everything inside it,
              and <StatRow> is written for a colour band. On this page the
              ground is the page's own, declared explicitly rather than
              inherited from nothing: outside a [data-ground] element those
              variables do not resolve at all. See tokens.css. */}
          {agent.stat && (
            <div data-ground="paper" className={styles.stat}>
              <StatRow stats={[agent.stat]} label={`${agent.title}, in numbers`} />
            </div>
          )}

          {IS_DEV && agent.todo.length > 0 && (
            <aside className={styles.todo}>
              <h3 className={styles.todoHeading}>
                Scaffold. Development only, never rendered in production.
              </h3>
              <ul className={styles.todoList}>
                {agent.todo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          )}
        </Container>
      ))}
    </>
  );
}
