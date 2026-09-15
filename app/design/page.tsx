import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { WorkIndex } from "@/components/ui/WorkIndex";
import { designLanding } from "@/content/design";
import { designCategoryRows } from "@/lib/cards";
import { site } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Design",
  description: site.description,
  alternates: { canonical: "/design" },
};

/* ============================================================================
   /design, the three bodies of work.
   ============================================================================
   Order: American Scientific, Taranto's, Personal Works. Manual, from
   content/design.ts. Sorted by client rather than by medium. No dates
   anywhere.

   AN INDEX, the same browse tier /applications uses. This has been three
   editorial rows with mismatched lead images, then three 4:3 preview cards,
   then a hover-gated list. Every category's picture is now in the layout,
   visible on load. See components/ui/WorkIndex.

   `uniform` IS SET HERE AND NOWHERE ELSE. These three are covers for three
   sections of one body of work and they are read as a set, so they take one
   4:3 frame at one size rather than each deriving its own from whatever its
   source export happened to be. Applications does not: those previews are
   portrait phone screenshots, and their shape is information.

   A category with an empty folder gets a row and no picture rather than a grey
   box, same standing rule as everywhere else.
   ========================================================================= */

export default function DesignPage() {
  const rows = designCategoryRows();

  return (
    <>
      <Container as="header" className={styles.head}>
        <div className={styles.headGrid}>
          <h1 className={styles.title}>Design</h1>

          {designLanding.body.length > 0 && (
            <div className={styles.landing}>
              {designLanding.body.map((para, i) => (
                <p key={i} className={styles.landingPara}>
                  {para}
                </p>
              ))}
            </div>
          )}
        </div>
      </Container>

      <Container as="section" className={styles.list}>
        <WorkIndex
          entries={rows}
          label="Bodies of design work"
          priorityFirst
          uniform
        />
      </Container>
    </>
  );
}
