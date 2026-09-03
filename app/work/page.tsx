import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { EntryRow } from "@/components/ui/EntryRow";
import { GallerySet } from "@/components/ui/GallerySet";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { Empty } from "@/components/ui/Empty";
import { getSections } from "@/content";
import { site } from "@/lib/site";
import grid from "@/components/ui/grid.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Work",
  description: site.description,
};

export default function WorkPage() {
  const sections = getSections();
  /* Running-order position, continuous across sections — the same ordinal the
     entry gets on the home page and in the pager. */
  let position = 0;

  return (
    <>
      <Container as="header" className={styles.head}>
        <div className={styles.headGrid}>
          <div className={styles.headMain}>
            <h1 className={styles.title}>Work</h1>
            {/* No standfirst. The copy writes none for the work index, and
                the section intros below say what each body of work is. Each
                section's own intro is doing this job already. */}
          </div>
          <div className={`${styles.headRail} ${grid.railRuled}`}>
            <SectionIndex sections={sections} />
          </div>
        </div>
      </Container>

      {sections.map((section) => (
        <Container
          key={section.id}
          as="section"
          id={section.id}
          className={styles.section}
        >
          <SectionHead section={section} />

          {section.entries.length === 0 ? (
            <Empty kind={section.kind} sectionId={section.id} />
          ) : section.kind === "case" ? (
            section.entries.map((entry) => {
              position += 1;
              return (
                <EntryRow
                  key={entry.slug}
                  entry={entry}
                  index={String(position).padStart(2, "0")}
                />
              );
            })
          ) : (
            section.entries.map((entry) => {
              position += 1;
              if (entry.kind !== "gallery") return null;

              return (
                <div key={entry.slug} className={styles.setBlock}>
                  <div className={styles.setHead}>
                    <h3>
                      <Link href={entry.href} className={styles.setTitle}>
                        {entry.title}
                      </Link>
                    </h3>
                    <p className={styles.setMeta}>
                      {entry.medium} · {entry.year} · {entry.images.length}{" "}
                      image{entry.images.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  {entry.caption && (
                    <p className={styles.setCaption}>{entry.caption}</p>
                  )}
                  <GallerySet images={entry.images} />
                </div>
              );
            })
          )}
        </Container>
      ))}
    </>
  );
}
