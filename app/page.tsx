import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EntryRow } from "@/components/ui/EntryRow";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { MetaRail, Meta } from "@/components/ui/MetaRail";
import { getFeatured, getSections } from "@/content";
import { HOME_FEATURED_COUNT } from "@/content/sections";
import { site } from "@/lib/site";
import grid from "@/components/ui/grid.module.css";
import styles from "./page.module.css";

export default function HomePage() {
  const featured = getFeatured(HOME_FEATURED_COUNT);
  const sections = getSections();

  return (
    <>
      <Container as="section" className={styles.masthead}>
        <div className={styles.mastheadGrid}>
          <div className={styles.statement}>
            {/* TODO: what you are, in three or four words. This is a label,
                not a sentence — it sits in mono above the headline. */}
            <p className={styles.eyebrow}>TODO</p>

            {/* TODO: the headline. One sentence, said flatly, about what you
                build. It is the first and possibly only thing a hiring team
                reads, so it should be a claim they can check against the work
                below — not a description of how you feel about design. */}
            <h1 className={styles.headline}>TODO</h1>

            {/* TODO: one or two sentences. What you build, and for whom. */}
            <p className={styles.subhead}>TODO</p>
          </div>

          <div className={`${styles.vitals} ${grid.railRuled}`}>
            <MetaRail>
              {/* TODO in lib/site.ts */}
              <Meta term="Focus" value={site.availability} />
              <Meta term="Based" value={site.location} />
              <Meta term="Contact">
                <Link href="/contact">Get in touch</Link>
              </Meta>
            </MetaRail>
          </div>
        </div>
      </Container>

      <Container as="section" className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Current work</h2>
          <p className={styles.sectionNote}>
            Manual running order · not date-sorted
          </p>
          <Link href="/work" className={styles.more}>
            All work →
          </Link>
        </div>

        {featured.map((entry, i) => (
          <EntryRow
            key={entry.slug}
            entry={entry}
            index={String(i + 1).padStart(2, "0")}
          />
        ))}
      </Container>

      <Container as="section" className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Index</h2>
          <p className={styles.sectionNote}>Seven sections</p>
        </div>
        <SectionIndex sections={sections} />
      </Container>
    </>
  );
}
