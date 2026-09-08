import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { DesignGrid } from "@/components/ui/DesignGrid";
import { designCategories, getCategory } from "@/content/design";
import { getDesignGroup, getDesignGroups } from "@/lib/design-images";
import { site } from "@/lib/site";
import styles from "../page.module.css";

/* ============================================================================
   /design/[category]/[group], the detail view for one group of work.
   ============================================================================
   THE SECOND TIER, and the only place a design piece renders at its own
   proportion. Its parent is the browsing tier: a grid of 4:3 cards, one per
   group. Click one and you land here, where every piece in that group is
   shown, in folder order, in a gallery bounded by the container and by a
   viewport-relative height cap.

   ROUTES ARE DERIVED FROM DIRECTORIES. public/design/<category>/NN-<group>/
   is the entire declaration: it produces this page, its card upstairs, its
   place in the running order and its count. There is no manifest, no route
   config and no copy to write, which is the same contract the rest of the
   design side has always run on.

   NO COPY LIVES HERE. A group has a name, a count and its pieces. The written
   material belongs to the category, one level up, and is not duplicated or
   paraphrased down here.

   The title is DERIVED from the directory name, "03-social-media" -> "Social
   Media", so renaming the folder renames the page.
   ========================================================================= */

export function generateStaticParams() {
  return designCategories.flatMap((category) =>
    getDesignGroups(category.slug, category.title).map((group) => ({
      category: category.slug,
      group: group.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; group: string }>;
}): Promise<Metadata> {
  const { category, group } = await params;
  const found = getCategory(category);
  if (!found) return {};

  const foundGroup = getDesignGroup(found.slug, found.title, group);
  if (!foundGroup) return {};

  const title = `${foundGroup.title}, ${found.title}`;
  return {
    title,
    /* The category's own intro. Never a sentence generated for the group. */
    description: found.intro || site.description,
    alternates: { canonical: `/design/${found.slug}/${foundGroup.slug}` },
    openGraph: {
      title,
      description: found.intro || site.description,
      url: `/design/${found.slug}/${foundGroup.slug}`,
      type: "article",
    },
  };
}

export default async function DesignGroupPage({
  params,
}: {
  params: Promise<{ category: string; group: string }>;
}) {
  const { category, group } = await params;
  const found = getCategory(category);
  if (!found) notFound();

  const groups = getDesignGroups(found.slug, found.title);
  const index = groups.findIndex((g) => g.slug === group);
  if (index < 0) notFound();

  const current = groups[index];
  const prev = groups[index - 1] ?? null;
  const next = groups[index + 1] ?? null;

  return (
    <>
      <Container as="header" className={styles.head}>
        <p className={styles.breadcrumb}>
          <Link href="/design">Design</Link>
          <span aria-hidden="true"> / </span>
          <Link href={`/design/${found.slug}`}>{found.title}</Link>
        </p>

        <div className={styles.headGrid}>
          <h1 className={styles.title}>{current.title}</h1>
        </div>
      </Container>

      <Container as="section" className={styles.gridBlock}>
        <DesignGrid images={current.items} priorityFirst />
      </Container>

      <Container as="nav" className={styles.pager} aria-label={found.title}>
        {prev ? (
          <Link
            href={`/design/${found.slug}/${prev.slug}`}
            className={styles.pagerPrev}
          >
            <span className={styles.pagerLabel}>Previous</span>
            <span className={styles.pagerTitle}>{prev.title}</span>
          </Link>
        ) : (
          <Link href={`/design/${found.slug}`} className={styles.pagerPrev}>
            <span className={styles.pagerLabel}>Back to</span>
            <span className={styles.pagerTitle}>{found.title}</span>
          </Link>
        )}
        {next && (
          <Link
            href={`/design/${found.slug}/${next.slug}`}
            className={styles.pagerNext}
          >
            <span className={styles.pagerLabel}>Next</span>
            <span className={styles.pagerTitle}>{next.title}</span>
          </Link>
        )}
      </Container>
    </>
  );
}
