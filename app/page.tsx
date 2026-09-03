import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SelectedWork } from "@/components/ui/SelectedWork";
import { MetaRail, Meta } from "@/components/ui/MetaRail";
import { getSelected } from "@/content";
import { archiveSections } from "@/content/sections";
import { site } from "@/lib/site";
import grid from "@/components/ui/grid.module.css";
import styles from "./page.module.css";

/* ============================================================================
   HOME
   ============================================================================
   The first screen states the through-line, not a list of projects. The hero
   is the opening statement from portfolio-copy.md at 129px — the largest type
   on the site by a wide margin — so "designer who ships software" lands before
   anything is clicked.

   Below it, the three Selected Work pieces at DESCENDING visual weight:
   DrawEvolve dominates, thoosie is second, Lynk is third and lightest. The
   hierarchy is size and space only. There are no "featured" / "secondary"
   labels anywhere, because a label that tells you what to look at is what you
   write when the layout does not.

   Then one quiet line to the archive. It is not competing for attention, and
   it is the second click that reaches every remaining piece of work.
   ========================================================================= */

export default function HomePage() {
  const selected = getSelected();
  const hasVitals = Boolean(site.availability || site.location);

  return (
    <>
      <Container as="section" className={styles.masthead}>
        <div className={styles.mastheadGrid}>
          <div className={styles.rule} aria-hidden="true" />

          <div className={styles.statement}>
            <h1 className={styles.headline}>
              Graphic designer who ships software.
            </h1>
          </div>

          <div className={styles.subheadWrap}>
            <p className={styles.subhead}>
              I spent four years making catalogs and marketing for hundreds of
              clients, then learned to build the products instead of decorating
              them. Now I design and ship AI tools end to end — interface,
              backend, model pipeline, and the parts nobody wants to own.
            </p>
          </div>

          {hasVitals && (
            <div className={`${styles.vitals} ${grid.railRuled}`}>
              <MetaRail>
                <Meta term="Focus" value={site.availability} />
                <Meta term="Based" value={site.location} />
              </MetaRail>
            </div>
          )}
        </div>
      </Container>

      <Container as="section" id="selected-work" className={styles.selected}>
        <div className={styles.selectedHead}>
          <h2 className={styles.selectedTitle}>Selected work</h2>
          <p className={styles.selectedNote}>
            Manual running order · not date-sorted
          </p>
        </div>

        <SelectedWork entries={selected} />
      </Container>

      {/* One line. Quiet on purpose. */}
      <Container as="section" className={styles.archiveLine}>
        <Link href="/archive" className={styles.archiveLink}>
          <span className={styles.archiveLabel}>Archive</span>
          {/* The section titles themselves, joined. Derived from the running
              order, not a written line — so it cannot drift out of date and
              it adds no copy that is not already on the site. */}
          <span className={styles.archiveText}>
            {archiveSections.map((s) => s.title).join(" · ")}
          </span>
          <span className={styles.archiveArrow} aria-hidden="true">
            →
          </span>
        </Link>
      </Container>
    </>
  );
}
