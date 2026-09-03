import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { agenticAI } from "@/content/agentic-ai";
import { getCaseStudy } from "@/content";
import { site } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Agentic AI",
  description: site.description,
  alternates: { canonical: "/agentic-ai" },
};

/* ============================================================================
   /agentic-ai
   ============================================================================
   Renders whatever copy exists and nothing else. With `body` empty it is a
   heading and a pointer to the passage in the DrawEvolve case study that
   already covers this ground in the author's own words.

   Nothing on this page is written for it. See content/agentic-ai.ts.
   ========================================================================= */

export default function AgenticAIPage() {
  const related = agenticAI.related
    ? getCaseStudy(agenticAI.related.slug)
    : null;

  return (
    <>
      <Container as="header" className={styles.head}>
        <div className={styles.headGrid}>
          <h1 className={styles.title}>Agentic AI</h1>

          {agenticAI.body.length > 0 && (
            <div className={styles.lead}>
              {agenticAI.body.map((para, i) => (
                <p key={i} className={styles.para}>
                  {para}
                </p>
              ))}
            </div>
          )}
        </div>
      </Container>

      {related && agenticAI.related && (
        <Container as="section" className={styles.relatedBlock}>
          <Link href={related.href} className={styles.related}>
            <span className={styles.relatedLabel}>
              {agenticAI.related.heading}
            </span>
            <span className={styles.relatedTitle}>{related.title}</span>
            {related.deck && (
              <span className={styles.relatedDeck}>{related.deck}</span>
            )}
          </Link>
        </Container>
      )}
    </>
  );
}
