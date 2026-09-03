import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SelectedWork } from "@/components/ui/SelectedWork";
import { MetaRail, Meta } from "@/components/ui/MetaRail";
import { getSelected } from "@/content";
import { designCategories } from "@/content/design";
import { getDesignImages } from "@/lib/design-images";
import { site } from "@/lib/site";
import grid from "@/components/ui/grid.module.css";
import styles from "./page.module.css";

/* ============================================================================
   HOME
   ============================================================================
   The first screen states the through-line, not a list of projects. The hero
   is the opening statement from portfolio-copy.md at 129px, the largest type
   on the site by a wide margin, so "designer who ships software" lands before
   anything is clicked.

   Below it, the three Selected Work pieces at DESCENDING visual weight:
   DrawEvolve dominates, thoosie is second, Lynk is third and lightest. The
   hierarchy is size and space only. There are no "featured" / "secondary"
   labels anywhere, because a label that tells you what to look at is what you
   write when the layout does not.

   Then one quiet line to the archive. It is not competing for attention, and
   it is the second click that reaches every remaining piece of work.
   ========================================================================= */

export default function HomePage() {
  const selected = getSelected();
  const hasVitals = Boolean(site.availability || site.location);

  return (
    <>
      <Container as="section" className={styles.masthead}>
        <div className={styles.mastheadGrid}>
          <div className={styles.rule} aria-hidden="true" />

          <div className={styles.statement}>
            <h1 className={styles.headline}>
              Products I designed and built end to end.
            </h1>
          </div>

          <div className={styles.subheadWrap}>
            <p className={styles.subhead}>
              I spent four years making catalogs and marketing for hundreds of
              clients, then learned to build the products instead of decorating
              them. Now I design and ship AI tools end to end: interface,
              backend, model pipeline, and the parts nobody wants to own.
            </p>
          </div>

          {hasVitals && (
            <div className={`${styles.vitals} ${grid.railRuled}`}>
              <MetaRail>
                <Meta term="Focus" value={site.availability} />
                <Meta term="Based" value={site.location} />
              </MetaRail>
            </div>
          )}
        </div>
      </Container>

      <Container as="section" id="applications" className={styles.applications}>
        <div className={styles.applicationsHead}>
          <h2 className={styles.applicationsTitle}>Applications</h2>
          {/* "not date-sorted" went with the dates. Nothing on this site
              carries a date any more, so the claim had nothing to contrast
              against. */}
          <p className={styles.applicationsNote}>Manual running order</p>
        </div>

        <SelectedWork entries={selected} />
      </Container>

      {/* The second half of the argument. "Designer who ships software" only
          holds if both halves are on the page, this is not an appendix and it
          is not a single quiet link. */}
      <Container as="section" id="design" className={styles.design}>
        <div className={styles.designHead}>
          <h2 className={styles.designTitle}>
            <Link href="/design" className={styles.designTitleLink}>
              Design
            </Link>
          </h2>
          <p className={styles.designNote}>Five bodies of work</p>
        </div>

        <ul className={styles.categories}>
          {designCategories.map((category) => {
            const images = getDesignImages(category.slug, category.title);
            const lead = images[0];

            return (
              <li key={category.slug} className={styles.category}>
                <Link
                  href={`/design/${category.slug}`}
                  className={styles.categoryLink}
                >
                  {/* The lead image, when the folder has one. Decorative here:
                      the link is already named by the title beside it, so a
                      second description would just be read out twice. */}
                  {lead && (
                    <span className={styles.categoryMedia}>
                      <Image
                        src={lead.src}
                        alt=""
                        width={lead.width}
                        height={lead.height}
                        sizes="(max-width: 62rem) 100vw, 22rem"
                        loading="lazy"
                        className={styles.categoryImage}
                      />
                    </span>
                  )}

                  <span className={styles.categoryTitle}>{category.title}</span>
                  <span className={styles.categoryIntro}>{category.intro}</span>
                  <span className={styles.categoryMeta}>
                    {images.length > 0 && (
                      <span>
                        {images.length} image{images.length === 1 ? "" : "s"}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>

    </>
  );
}
