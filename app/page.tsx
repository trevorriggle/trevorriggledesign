import { Fragment, type CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { VideoSlot } from "@/components/ui/Video";
import { Band } from "@/components/ui/Band";
import { SectionHead } from "@/components/ui/SectionHead";
import { WorkGrid } from "@/components/ui/WorkGrid";
import { caseStudyRows, designCategoryRows } from "@/lib/cards";
import { getSelected, getCaseStudy } from "@/content";
import styles from "./page.module.css";

/* ============================================================================
   HOME
   ============================================================================
     1  the statement    the opening line, revealed word by word
     2  the clip         thoosie's footage, full bleed, closing the hero
     3  Applications     three shipped products, as pictures
     4  the band         one sentence, ultramarine, full bleed
     5  Design           three bodies of work, as pictures

   THE FOUR DOORS ARE GONE. This page was a 2x2 of section names, Applications,
   Design, Agentic AI, About, each over a thumbnail read from public/home/.
   Two of the four had no image, so half the grid was a word on flat ground,
   and the two that did were stale: the Applications tile was a rough line
   sketch from an old build sitting one click from the finished portrait the
   case study leads with.

   A DOOR IS NOT WORK, which is the real reason they went. Someone who has
   just come out of a final-round interview and wants to look at what this
   person makes was being handed four category names to choose between. The
   page now opens with the statement and then shows six pieces of work.

   THIS REVERSES A DECISION THIS REPOSITORY MADE ON PURPOSE, and it is worth
   naming rather than quietly undoing. The doors replaced an earlier home that
   carried the applications inline, on the argument that the page was "showing
   the same set twice and the doors were competing with a copy of what they
   open". That argument was sound about THAT build, where home rendered the
   full browse tier: decks, status, the lot. It is a portfolio home page, and
   a portfolio home page that shows no work is solving the wrong problem. The
   duplication is handled by the two tiers being genuinely different: this is
   a picture and a name, and /applications is the picture, the name and the
   deck at reading size. See components/ui/WorkGrid.

   NAVIGATION DID NOT MOVE INTO THE WORK. Agentic AI and About lost their
   tiles and keep their nav tabs, which is where a section that is not work
   belongs. Contact was never here.

   THE STATEMENT'S REVEAL IS CSS, NOT FRAMER, and that is a load decision. This
   is the page's LCP text. A framer reveal ships it as `opacity: 0` in the
   server HTML and waits for hydration, which would make the largest paint on
   the site depend on a JS chunk. The keyframes in page.module.css run on
   first paint with no JS at all.
   ========================================================================= */

/** The site's opening line. Split on spaces for the reveal, never edited. */
const STATEMENT = "Graphic Designer & Developer";

/* The band's sentence is the author's own, supplied for this slot. It used to
   be lifted verbatim from /about; it is its own line now, and /about no
   longer carries a version of it, so the two do not say the same thing in two
   places. */
const BAND_LINE =
  "I design, build and break software before putting it back together. It’s all part of the process.";

export default function HomePage() {
  const applications = caseStudyRows(getSelected());
  const design = designCategoryRows();

  /* The one clip in the whole content set. Rendered only if the mp4 is
     actually on disk; VideoSlot falls back to its poster frame and then to
     nothing at all, so an absent file is an absent band, never an empty one. */
  const clip = getCaseStudy("thoosie")?.video ?? null;

  return (
    <>
      <Container as="section" className={styles.hero}>
        <h1 className={styles.statement}>
          {STATEMENT.split(" ").map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              {/* A REAL TEXT NODE, not a margin. The masks are inline-block,
                  so without this the words butt together and the heading's
                  text content comes out as "GraphicDesigner&Developer", which
                  is what a screen reader would read. */}
              {i > 0 && " "}
              <span
                className={styles.mask}
                style={{ "--i": i } as CSSProperties}
              >
                <span className={styles.word}>{word}</span>
              </span>
            </Fragment>
          ))}
        </h1>
      </Container>

      {/* THE HERO'S OWN VISUAL. Real footage, the site's existing clip.
          <AutoVideo> refuses to autoplay on a metered or unknown connection,
          under reduced motion, or off screen, and preloads metadata only, so
          a 14MB file is not pulled down to decorate a page nobody scrolled. */}
      {clip && (
        <Container width="full" className={styles.band}>
          <VideoSlot video={clip} sizes="100vw" />
        </Container>
      )}

      <Container as="section" className={styles.section}>
        <SectionHead title="Applications" />
        <div className={styles.grid}>
          <WorkGrid
            entries={applications}
            label="Applications"
            /* Three tiles, all of them in the first screen after the clip on
               a desktop window. */
            priorityCount={3}
          />
        </div>
      </Container>

      {/* A FULL-BLEED BAND BETWEEN THE TWO SETS. It divides the page, which is
          what makes colour structural here rather than decorative: a reader
          scrolling past knows the set changed without reading a word.

          `ultramarine-deep`, NOT `ultramarine`. The bright #1b2ecc read too
          hot behind a 49px line; this is the same blue the American Scientific
          website-rebuild band already uses, so the two loudest colour fields
          on the site are now the same colour rather than two blues.

          NO "ABOUT" LINK. The band carried one under the sentence. It is gone:
          About is a masthead tab on every page, and the band is a statement,
          not a door. */}
      <Band ground="ultramarine-deep" grid className={styles.quoteBand}>
        <p className={`quote ${styles.quote}`}>{BAND_LINE}</p>
      </Band>

      <Container as="section" className={styles.section}>
        <SectionHead title="Design" />
        <div className={styles.grid}>
          <WorkGrid entries={design} label="Bodies of design work" />
        </div>
      </Container>
    </>
  );
}
