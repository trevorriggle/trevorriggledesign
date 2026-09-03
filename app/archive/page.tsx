import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { GallerySet } from "@/components/ui/GallerySet";
import { Empty } from "@/components/ui/Empty";
import { getArchive } from "@/content";
import { sectionOrdinal } from "@/content/sections";
import { site } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Archive",
  description: site.description,
  alternates: { canonical: "/archive" },
};

/* ============================================================================
   ARCHIVE — Tier 2, one page.
   ============================================================================
   Five former categories as anchored sections, in manual order. Image-led and
   dense: one line of copy per section — the section intro from
   portfolio-copy.md, verbatim — and then a grid.

   No per-project routes. Nothing here has its own page, because this tier
   exists to prove range and craft, not to be read. That is also why the
   section heading and its intro are the only prose: an archive that explains
   itself at length is a case study that lost its nerve.

   Every heading is an anchor target. `sectionHref()` in content/sections.ts is
   the single source for those links, so the redirects, the home line and the
   in-page index all agree.
   ========================================================================= */

export default function ArchivePage() {
  const sections = getArchive();

  return (
    <>
      <Container as="header" className={styles.head}>
        <div className={styles.headGrid}>
          <h1 className={styles.title}>Archive</h1>

          <nav className={styles.jump} aria-label="Archive sections">
            <ol className={styles.jumpList}>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={styles.jumpLink}>
                    <span className={styles.jumpOrdinal} aria-hidden="true">
                      {sectionOrdinal(section.id)}
                    </span>
                    <span>{section.title}</span>
                    <span className={styles.jumpYear}>{section.years}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </Container>

      {sections.map((section, i) => (
        <Container
          key={section.id}
          as="section"
          id={section.id}
          className={styles.section}
        >
          <div className={styles.sectionHead}>
            <p className={styles.ordinal} aria-hidden="true">
              {sectionOrdinal(section.id)}
            </p>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <p className={styles.standfirst}>{section.standfirst}</p>
            <p className={styles.years}>{section.years}</p>
          </div>

          {section.entries.length === 0 ? (
            <Empty kind={section.kind} sectionId={section.id} />
          ) : (
            section.entries.map((entry) => (
              <div key={entry.slug} className={styles.set}>
                {entry.kind === "gallery" && (
                  <>
                    <p className={styles.setMeta}>
                      <span className={styles.setTitle}>{entry.title}</span>
                      <span>{entry.medium}</span>
                      <span>{entry.year}</span>
                    </p>
                    <GallerySet
                      images={entry.images}
                      /* Only the very first set on the page is eager; every
                         other image on an image-heavy page lazy-loads. */
                      priorityFirst={i === 0}
                    />
                  </>
                )}
              </div>
            ))
          )}
        </Container>
      ))}

    </>
  );
}
