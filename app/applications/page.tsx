import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { WorkIndex } from "@/components/ui/WorkIndex";
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

   THIS IS THE BROWSING TIER. It has been four things: full-width stacked
   media (one entry was a screenful), then three 4:3 preview cards (which
   flattened the set into equal tiles), then a ruled list of names with each
   picture held under the POINTER, which meant the work was invisible until
   somebody moved a mouse. It is now a numbered ruled list where every entry
   shows its picture on load, on every device, with no JavaScript. See
   components/ui/WorkIndex.

   THE "MANUAL RUNNING ORDER" NOTE IS GONE. It sat beside the page title and
   it was a note about the CMS, addressed to whoever maintains the site,
   printed on the page a hiring manager reads. That the order is deliberate is
   worth knowing; it is not worth a line of the page to say so.
   ========================================================================= */

export default function ApplicationsPage() {
  const selected = getSelected();

  return (
    <>
      <Container as="header" className={styles.head}>
        <div className={styles.headGrid}>
          <h1 className={styles.title}>Applications</h1>
        </div>
      </Container>

      <Container as="section" className={styles.list}>
        <WorkIndex
          entries={caseStudyRows(selected)}
          label="Applications"
          priorityFirst
        />
      </Container>
    </>
  );
}
