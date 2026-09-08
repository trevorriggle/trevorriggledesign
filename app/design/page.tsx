import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CardGrid } from "@/components/ui/Card";
import { designLanding } from "@/content/design";
import { designCategoryCards } from "@/lib/cards";
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

   THREE PREVIEW CARDS, one shape. This used to be three editorial rows, each
   with a lead image rendered at that image's own proportion beside the copy,
   so the three rows never matched each other and a tall lead made its row
   twice the height of the others. The cards are 4:3 every time and the
   category page is the detail view.

   A category with an empty folder cards up with no image rather than a grey
   box, same standing rule as everywhere else.
   ========================================================================= */

export default function DesignPage() {
  const cards = designCategoryCards();

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
        <CardGrid
          cards={cards}
          priorityFirst
          label="Bodies of design work"
          size="lead"
        />
      </Container>
    </>
  );
}
