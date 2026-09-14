import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { DesignGrid } from "@/components/ui/DesignGrid";
import { SectionHead } from "@/components/ui/SectionHead";
import { SubNav } from "@/components/ui/SubNav";
import { FeaturedCase } from "@/components/ui/FeaturedCase";
import {
  designCategories,
  getCategory,
  categoryNeighbours,
  getSection,
  getFeatured,
} from "@/content/design";
import { getDesignGroups, getUngroupedImages } from "@/lib/design-images";
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
   /design/[category], a body of work, ON ONE PAGE.
   ============================================================================
   THIS USED TO BE TWO TIERS AND IT IS NOW ONE. A category with group folders
   rendered a browsing index of the groups, and each group had its own route
   at /design/<category>/<group> where the pieces actually were. So seeing
   four print pieces was: land on the category, read a list, click "Print",
   land on a third page. Three navigations to see a picture.

   It is now a single page. Every group is a section on it, the sticky subnav
   moves between them, and the work is on screen from the moment the page
   loads. The group routes are gone and redirect to the anchors, see
   next.config.ts.

   THREE SHAPES, DECIDED BY THE CONTENT, and the third one is new:

   1. A FEATURED CASE plus an archive. American Scientific: the website
      rebuild is a band at the top of the page, above everything, because it
      is production engineering on a live business system rather than a fourth
      kind of collateral. Then the subnav and the four sections.

   2. GROUPS AS SECTIONS. Personal Works: subnav and sections, no feature.

   3. A FLAT GALLERY, unchanged. Taranto's has no group folders, three pieces
      and no copy. It renders exactly as it did: heading, gallery, pager. No
      subnav, because a sticky bar with one item in it is furniture, and no
      invented sections, because splitting three pieces into sub-groups would
      be structure invented to satisfy a pattern.

   WHICH SHAPE A CATEGORY GETS IS STILL READ OFF THE DISK. Group folders mean
   sections; no group folders mean a flat gallery. Nothing was added to the
   content model to choose, which keeps the folder-is-the-config contract the
   design side has always run on.

   PLACEHOLDER COPY IS MARKED IN DEVELOPMENT AND SILENT IN PRODUCTION. See
   content/design.ts for the contract the section copy was written under.
   ========================================================================= */

const IS_DEV = process.env.NODE_ENV !== "production";

export default async function DesignCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const found = getCategory(category);
  if (!found) notFound();

  const groups = getDesignGroups(found.slug, found.title);
  const loose = getUngroupedImages(found.slug, found.title);
  const featured = getFeatured(found.slug);
  const { prev, next } = categoryNeighbours(found.slug);

  /* The subnav indexes the SECTIONS, which are the groups. The featured case
     is deliberately not in it: the brief is explicit that it must not read as
     a peer of "Print", and it sits above the bar where nothing has scrolled
     past it yet. A bar with one item is furniture, so one group gets none. */
  const navItems = groups.map((group) => ({
    id: group.slug,
    label: group.title,
  }));

  return (
    <>
      <Container as="header" className={styles.head}>
        <p className={styles.breadcrumb}>
          <Link href="/design">Design</Link>
        </p>

        <div className={styles.headGrid}>
          <h1 className={styles.title}>{found.title}</h1>
          {found.intro && <p className={styles.intro}>{found.intro}</p>}
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

      {featured && <FeaturedCase data={featured} />}

      {navItems.length > 1 && (
        <SubNav items={navItems} label={`${found.title}, sections`} />
      )}

      {groups.map((group, i) => {
        const copy = getSection(found.slug, group.slug);

        return (
          <Container
            as="section"
            key={group.slug}
            className={styles.section}
          >
            <SectionHead
              id={group.slug}
              number={String(i + 1).padStart(2, "0")}
              title={group.title}
            />

            {copy && copy.body.length > 0 && (
              <div className={styles.sectionCopy}>
                {/* Development only. `process.env.NODE_ENV` is inlined at
                    build time, so this whole branch is dropped from a
                    production bundle and the marker cannot ship. */}
                {IS_DEV && copy.placeholder && (
                  <p className={styles.placeholderMark}>
                    Placeholder copy. Edit in content/design.ts and drop the
                    flag. Development only, never rendered in production.
                  </p>
                )}
                {copy.body.map((para, j) => (
                  <p key={j} className={styles.sectionPara}>
                    {para}
                  </p>
                ))}
              </div>
            )}

            <div className={styles.sectionGrid}>
              <DesignGrid images={group.items} priorityFirst={i === 0} />
            </div>
          </Container>
        );
      })}

      {/* Loose files at the category root. Taranto's whole gallery is this. */}
      {loose.length > 0 && (
        <Container as="section" className={styles.section}>
          <DesignGrid images={loose} priorityFirst={groups.length === 0} />
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
