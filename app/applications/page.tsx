import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { IndexList } from "@/components/ui/IndexList";
import { caseStudyRows } from "@/lib/cards";
import { getSelected } from "@/content";
import { site } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Applications",
  description: site.description,
  alternates: { canonical: "/applications" },
};

/* ============================================================================
   /applications
   ============================================================================
   The three shipped products, at equal weight, in manual running order:
   DrawEvolve, thoosie, Lynk.

   THIS USED TO BE THE HOME PAGE. It was a section on `/` behind the
   `#applications` fragment, under a 129px hero statement, with the design
   categories stacked below it. Home is now a 2x2 of four doors and this is
   one of them, which is the only reason this route exists.

   The hero statement did not come with it. It was written as the site's
   opening line, not as an introduction to three case studies, and it is out
   of the build entirely rather than parked somewhere it does not belong.

   THIS IS THE BROWSING TIER, and it is an INDEX now. It has been three
   things: full-width stacked media (one entry was a screenful), then three
   4:3 preview cards (which flattened the set into equal tiles and threw away
   every asset's real shape). It is now a ruled list of names at 57px with each
   entry's picture held under the pointer, at its own proportion. See
   components/ui/IndexList.
   ========================================================================= */

export default function ApplicationsPage() {
  const selected = getSelected();

  return (
    <>
      <Container as="header" className={styles.head}>
        <div className={styles.headGrid}>
          <h1 className={styles.title}>Applications</h1>
          <p className={styles.note}>Manual running order</p>
        </div>
      </Container>

      <Container as="section" className={styles.list}>
        <IndexList
          entries={caseStudyRows(selected)}
          label="Applications"
          priorityFirst
        />
      </Container>
    </>
  );
}
