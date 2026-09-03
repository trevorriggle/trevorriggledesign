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

/* Copy: portfolio-copy.md → "Home — opening statement". Both paragraphs,
   verbatim. The eyebrow slot the scaffold had above the headline is gone —
   the copy has no label line there, and inventing three words to fill a
   typographic slot is exactly what this build does not do. */
export default function HomePage() {
  const featured = getFeatured(HOME_FEATURED_COUNT);
  const sections = getSections();
  const hasVitals = Boolean(site.availability || site.location);

  return (
    <>
      <Container as="section" className={styles.masthead}>
        <div className={styles.mastheadGrid}>
          <div className={styles.statement}>
            <h1 className={styles.headline}>
              Graphic designer who ships software.
            </h1>

            <p className={styles.subhead}>
              I spent four years making catalogs and marketing for hundreds of
              clients, then learned to build the products instead of decorating
              them. Now I design and ship AI tools end to end — interface,
              backend, model pipeline, and the parts nobody wants to own.
            </p>
          </div>

          <div className={`${styles.vitals} ${grid.railRuled}`}>
            <MetaRail>
              {/* Both render nothing while unset — see lib/site.ts. */}
              {hasVitals && (
                <>
                  <Meta term="Focus" value={site.availability} />
                  <Meta term="Based" value={site.location} />
                </>
              )}
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
          {/* Counted, not hard-coded: the scaffold said "Seven sections" and
              there are six. A number in prose that the data can contradict is
              a number that will eventually be wrong. */}
          <p className={styles.sectionNote}>{sections.length} sections</p>
        </div>
        <SectionIndex sections={sections} />
      </Container>
    </>
  );
}
