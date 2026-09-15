import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { DesignGrid } from "@/components/ui/DesignGrid";
import { SectionHead } from "@/components/ui/SectionHead";
import { SubNav } from "@/components/ui/SubNav";
import { FeaturedCase } from "@/components/ui/FeaturedCase";
import { Compare, type CompareSide } from "@/components/ui/Compare";
import {
  designCategories,
  getCategory,
  categoryNeighbours,
  getSection,
  getFeatured,
} from "@/content/design";
import type { CompareShot } from "@/content/design";
import { getDesignGroups, getUngroupedImages } from "@/lib/design-images";
import type { DesignItem } from "@/lib/design-images";
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

   1. A FEATURED CASE INSIDE the archive. American Scientific: the website
      rebuild is a band that sits between two of the folder sections, in the
      subnav alongside them, numbered with them. `after` in content/design.ts
      names the group it follows. It used to sit above the whole run and stay
      out of the index, on the argument that a subnav entry between "Print"
      and "Social Media" would make it read as a fourth kind of collateral;
      see that file for why that reversed. What makes it read as the feature
      is the treatment, which has not changed: it is the page's only colour
      band, and the only section with a deck, a table, statistics and scroll
      sequences.

   2. GROUPS AS SECTIONS. Personal Works: subnav and sections, no feature.

   3. A FLAT GALLERY, for a category whose folder holds loose files rather
      than group folders. Nothing is in this shape today. Taranto's used to
      be, and the note here still described it that way long after the three
      pieces were regrouped into 01-menu, 02-marketing and 03-logo-variants
      and given copy: it renders as shape 2, with a three-item subnav. The
      branch stays because it is what the template does with a bare folder,
      and dropping loose files into one is still the way to get it.

   WHICH SHAPE A CATEGORY GETS IS STILL READ OFF THE DISK. Group folders mean
   sections; no group folders mean a flat gallery. Nothing was added to the
   content model to choose, which keeps the folder-is-the-config contract the
   design side has always run on.

   PLACEHOLDER COPY IS MARKED IN DEVELOPMENT AND SILENT IN PRODUCTION. See
   content/design.ts for the contract the section copy was written under.
   ========================================================================= */

const IS_DEV = process.env.NODE_ENV !== "production";

/** The filename at the end of a media URL. */
function basename(url: string): string {
  return url.slice(url.lastIndexOf("/") + 1);
}

/**
 * Resolve a declared comparison shot against what is actually on disk.
 *
 * THE DIMENSIONS COME FROM THE FILE, NOT FROM THE DECLARATION. Both exist:
 * content/design.ts states them so the shape of the comparison is readable
 * without opening an image, and lib/design-images.ts measures the real header
 * at build time. The measured one wins, because a declaration can drift from
 * the file it describes and the file cannot drift from itself.
 *
 * Returns null when the named file is not there, and the caller then renders
 * no comparison at all rather than a frame around a missing image. Same
 * standing rule as every other media slot on this site.
 */
function resolveShot(
  shot: CompareShot,
  items: DesignItem[],
  label: string,
): CompareSide | null {
  const found = items.find((item) => basename(item.src) === shot.src);
  if (!found) return null;

  return {
    src: found.src,
    alt: shot.alt,
    width: found.width,
    height: found.height,
    caption: shot.caption,
    redact: shot.redact,
    unoptimized: found.passthrough,
    label,
  };
}

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

  /* ONE RUNNING ORDER, BUILT ONCE, and the subnav and the page read from the
     same array. They used to be derived separately, which is how the featured
     case ended up present on the page and absent from the index.

     Each entry is either a folder section or the featured case. The featured
     case is spliced in after the group named by `after`; with no `after`, or
     with a name that matches no folder, it leads, which is where it used to
     live and is a safe place to land. A bar with one item is furniture, so a
     single-entry run still renders no subnav. */
  type Row =
    | { kind: "group"; id: string; label: string; group: (typeof groups)[number] }
    | { kind: "featured"; id: string; label: string };

  const rows: Row[] = [];
  if (featured && !featured.after) {
    rows.push({ kind: "featured", id: featured.slug, label: featured.nav });
  }
  for (const group of groups) {
    /* The section's own title wins over the one derived from the folder
       name. `03-logo-variants` generates a published redirect, so the folder
       cannot be renamed; the heading and the subnav label can. */
    const label = getSection(found.slug, group.slug)?.title ?? group.title;
    rows.push({ kind: "group", id: group.slug, label, group });
    if (featured && featured.after === group.slug) {
      rows.push({ kind: "featured", id: featured.slug, label: featured.nav });
    }
  }
  /* `after` naming a folder that is not on disk would drop the section
     entirely. It leads instead. */
  if (featured && featured.after && !rows.some((r) => r.kind === "featured")) {
    rows.unshift({ kind: "featured", id: featured.slug, label: featured.nav });
  }

  const navItems = rows.map((row) => ({ id: row.id, label: row.label }));

  return (
    <>
      {/* THE BAR IS THE FIRST THING ON THE PAGE, above the masthead's own
          title block rather than buried under it.

          It used to render after the intro copy and after the featured case,
          which meant the one control for moving around a very long page was
          itself below the fold on a phone: you had to scroll past everything
          the bar exists to let you skip in order to find the bar. Putting it
          at the top costs the title nothing (it is still the <h1>, still the
          first thing read) and means the index is on screen at the moment
          the page arrives, which is when somebody deciding where to look
          actually wants it. */}
      {navItems.length > 1 && (
        <SubNav items={navItems} label={`${found.title}, sections`} />
      )}

      {/* NO BREADCRUMB. A ruled row reading "Design" used to sit above the
          title. The block is gone, not just its text, and the head's own top
          padding opens the page. The masthead's Design tab is the way back. */}
      <Container as="header" className={styles.head}>
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

      {/* `i` is still the running index: it drives which section eager-loads
          its lead image. It no longer prints an ordinal. */}
      {rows.map((row, i) => {
        if (row.kind === "featured") {
          return <FeaturedCase key={row.id} data={featured!} />;
        }

        const group = row.group;
        const copy = getSection(found.slug, group.slug);

        /* A section may lead with a before/after. When it does, the two files
           it names DROP OUT OF THE GALLERY below it: the comparison has
           already shown both, at a size chosen for the comparison, and
           printing them again as loose thumbnails underneath is the same
           picture twice with less to say the second time. This is the same
           claiming rule lib/design-images.ts uses to stop a video's poster
           frame rendering as a still of its own. */
        const before = copy?.compare
          ? resolveShot(copy.compare.before, group.items, "Before")
          : null;
        const after = copy?.compare
          ? resolveShot(copy.compare.after, group.items, "After")
          : null;
        const compare = before && after ? { before, after } : null;

        const claimed = new Set(
          compare
            ? [basename(compare.before.src), basename(compare.after.src)]
            : [],
        );
        const items = compare
          ? group.items.filter((item) => !claimed.has(basename(item.src)))
          : group.items;

        /* A LAYOUT MAY PLACE PICTURES ON BOTH SIDES OF THE COPY. Rows marked
           `lead` render above it, everything else below, and the two grids
           are given disjoint sets of files so neither can print the other's.
           See the note on `lead` in content/design.ts. */
        const leadRows = copy?.layout?.filter((r) => r.lead) ?? [];
        const bodyRows = copy?.layout?.filter((r) => !r.lead) ?? [];
        const leadFiles = new Set(
          leadRows.flatMap((r) => r.cells.flatMap((c) => c.files)),
        );
        const leadItems = items.filter((it) =>
          leadFiles.has(it.src.slice(it.src.lastIndexOf("/") + 1)),
        );
        const bodyItems = items.filter(
          (it) => !leadFiles.has(it.src.slice(it.src.lastIndexOf("/") + 1)),
        );

        return (
          <Container
            as="section"
            key={group.slug}
            className={styles.section}
          >
            <SectionHead id={group.slug} title={copy?.title ?? group.title} />

            {compare && copy?.compare && (
              <div className={styles.sectionCompare}>
                <Compare
                  label={copy.compare.label}
                  before={compare.before}
                  after={compare.after}
                  eager={i === 0}
                />
              </div>
            )}

            {leadRows.length > 0 && leadItems.length > 0 && (
              <div className={styles.sectionLead}>
                <DesignGrid images={leadItems} layout={leadRows} />
              </div>
            )}

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

            {bodyItems.length > 0 && (
              <div className={styles.sectionGrid}>
                <DesignGrid
                  images={bodyItems}
                  priorityFirst={i === 0 && !compare && leadItems.length === 0}
                  /* Placed rows when the section declares them, the automatic
                     grid when it does not. See content/design.ts. */
                  layout={bodyRows}
                />
              </div>
            )}
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
