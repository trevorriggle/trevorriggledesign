import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { designCategories, designLanding } from "@/content/design";
import { getDesignImages } from "@/lib/design-images";
import { site } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Design",
  description: site.description,
  alternates: { canonical: "/design" },
};

/* ============================================================================
   /design — the five categories.
   ============================================================================
   Order: Print, Marketing, 3D, Motion, Personal. Manual, from
   content/design.ts, never sorted by the year label.

   Each row is a real entry to a real page, not a thumbnail strip: the title at
   display scale, the category's own intro, and — when files exist in its
   folder — the first image as a lead. A category with an empty folder renders
   its copy and no image, which is the correct empty state.
   ========================================================================= */

export default function DesignPage() {
  const rows = designCategories.map((category) => ({
    category,
    lead: getDesignImages(category.slug, category.title)[0] ?? null,
  }));

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
        {rows.map(({ category, lead }, i) => (
          <article key={category.slug} className={styles.row}>
            <p className={styles.ordinal} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </p>

            <div className={styles.rowText}>
              <h2 className={styles.rowTitle}>
                <Link href={`/design/${category.slug}`} className={styles.rowLink}>
                  {category.title}
                </Link>
              </h2>
              <p className={styles.rowIntro}>{category.intro}</p>
              {category.demonstrates && (
                <p className={styles.demonstrates}>
                  <span className={styles.demonstratesTerm}>
                    What it demonstrates
                  </span>
                  <span>{category.demonstrates}</span>
                </p>
              )}
            </div>

            <p className={styles.rowYear}>{category.years}</p>

            {lead && (
              <Link
                href={`/design/${category.slug}`}
                className={styles.rowMedia}
                tabIndex={-1}
                aria-hidden="true"
              >
                <Image
                  src={lead.src}
                  alt=""
                  width={lead.width}
                  height={lead.height}
                  sizes="(max-width: 62rem) 100vw, 32rem"
                  loading={i === 0 ? "eager" : "lazy"}
                  className={styles.rowImage}
                />
              </Link>
            )}
          </article>
        ))}
      </Container>
    </>
  );
}
