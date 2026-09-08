import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CardGrid } from "@/components/ui/Card";
import { caseStudyCards } from "@/lib/cards";
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

   THIS IS THE BROWSING TIER. It used to stack each entry's media at full
   grid width, which put a 2064x2752 iPad screenshot on screen at about
   1200x1600 and made one entry a whole screenful. It is now three preview
   cards on one 4:3 crop, and /work/<slug> is where the media renders at its
   own proportion. Nothing on this page is shown at native size.
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
        <CardGrid
          cards={caseStudyCards(selected)}
          priorityFirst
          label="Applications"
        />
      </Container>
    </>
  );
}
