import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SelectedWork } from "@/components/ui/SelectedWork";
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
        <SelectedWork entries={selected} />
      </Container>
    </>
  );
}
