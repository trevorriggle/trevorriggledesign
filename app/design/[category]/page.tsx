import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { DesignGrid } from "@/components/ui/DesignGrid";
import {
  designCategories,
  getCategory,
  categoryNeighbours,
} from "@/content/design";
import { getDesignImages } from "@/lib/design-images";
import { site } from "@/lib/site";
import styles from "./page.module.css";

export function generateStaticParams() {
  return designCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const found = getCategory(category);
  if (!found) return {};

  return {
    title: found.title,
    /* The category's own intro, which is written copy, never generated. */
    description: found.intro || site.description,
    alternates: { canonical: `/design/${found.slug}` },
    openGraph: {
      title: found.title,
      description: found.intro || site.description,
      url: `/design/${found.slug}`,
      type: "article",
    },
  };
}

/* ============================================================================
   /design/[category], a page about a body of work.
   ============================================================================
   Copy first, then the images. The "What it demonstrates" line is rendered as
   its own labelled element rather than folded into the prose, because it is
   doing a specific job: telling a technical reader who cannot evaluate design
   on its own terms what this work is evidence OF.

   Images come from public/design/<category>/. An empty folder renders the copy
   and no grid, no placeholder boxes, no broken images, no "coming soon".
   ========================================================================= */

export default async function DesignCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const found = getCategory(category);
  if (!found) notFound();

  const images = getDesignImages(found.slug, found.title);
  const { prev, next } = categoryNeighbours(found.slug);

  return (
    <>
      <Container as="header" className={styles.head}>
        <p className={styles.breadcrumb}>
          <Link href="/design">Design</Link>
        </p>

        <div className={styles.headGrid}>
          <h1 className={styles.title}>{found.title}</h1>
          <p className={styles.intro}>{found.intro}</p>
        </div>
      </Container>

      {found.body.length > 0 && (
        <Container as="section" className={styles.bodyBlock}>
          <div className={styles.prose}>
            {found.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Container>
      )}

      {found.demonstrates && (
        <Container as="section" className={styles.demonstratesBlock}>
          <div className={styles.demonstrates}>
            <h2 className={styles.demonstratesTerm}>What it demonstrates</h2>
            <p className={styles.demonstratesText}>{found.demonstrates}</p>
          </div>
        </Container>
      )}

      {images.length > 0 && (
        <Container as="section" className={styles.gridBlock}>
          <DesignGrid images={images} priorityFirst />
        </Container>
      )}

      <Container as="nav" className={styles.pager} aria-label="Design categories">
        {prev ? (
          <Link href={`/design/${prev.slug}`} className={styles.pagerPrev}>
            <span className={styles.pagerLabel}>Previous</span>
            <span className={styles.pagerTitle}>{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/design/${next.slug}`} className={styles.pagerNext}>
            <span className={styles.pagerLabel}>Next</span>
            <span className={styles.pagerTitle}>{next.title}</span>
          </Link>
        )}
      </Container>
    </>
  );
}
