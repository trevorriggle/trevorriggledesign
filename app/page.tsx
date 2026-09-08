import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { CardGrid } from "@/components/ui/Card";
import { VideoSlot } from "@/components/ui/Video";
import { Reveal } from "@/components/motion/Reveal";
import { getHomeTiles } from "@/lib/home-tiles";
import { caseStudyCards } from "@/lib/cards";
import { getSelected, getCaseStudy } from "@/content";
import styles from "./page.module.css";

/* ============================================================================
   HOME
   ============================================================================
   THE FIRST SCREEN IS ONE SENTENCE. The opening statement runs at
   --type-statement: 129px, the d5 step of the scale, 7.6x long-form body and
   2.25x the largest type anywhere else on the site. The page previously
   opened on a 2x2 of tiles and then three equal preview cards, all inside
   about one step of each other, so nothing stopped a scroll.

   The copy is `portfolio-copy.md` -> "Home - opening statement", both
   paragraphs, verbatim. Nothing here is written or composed. The statement is
   the page's <h1>, so the visually-hidden one this page used to carry is gone
   rather than duplicated.

   FIVE TIERS, IN THIS ORDER:

     1  the statement            129px, word-by-word reveal, alone on screen
     2  the clip                 thoosie's footage, full bleed, closes the hero
     3  DrawEvolve, featured     near-full-width, its cover at ~4x card area
     4  thoosie and Lynk         ordinary preview cards
     5  the four doors           the 2x2, as a footer-ward index

   THE STATEMENT'S REVEAL IS CSS, NOT FRAMER, and that is a load decision, not
   a style one. This is the page's LCP text. A framer reveal ships it as
   `opacity: 0` in the server HTML and waits for hydration to bring it back,
   which would make the largest paint on the site depend on a JS chunk. The
   keyframes in page.module.css run on first paint with no JS at all. Framer
   handles everything BELOW the fold, where a hydration wait costs nothing
   because nobody has scrolled to it yet.

   THE WORD SPLIT IS PRESENTATIONAL. The sentence is one string constant,
   split on spaces at render, so the copy exists once and no word is written
   here. Each word is a masked span: the mask clips, the word inside it rises.
   Screen readers get the sentence back intact because the spans carry no
   roles and no aria, and the <h1>'s text content is unchanged.

   THE FEATURE IS THE RUNNING ORDER'S FIRST ENTRY, not a hand-picked slug.
   `SELECTED` is [drawevolve, thoosie, lynk] and this destructures it, so the
   hierarchy follows the running order instead of hardcoding a second copy of
   it. Its card data comes from the SAME `caseStudyCards` mapper the grid below
   uses, so the deck, the status and the thumbnail choice are one decision.

   THE 2x2 MOVED TO THE BOTTOM. It is navigation, and it was standing where
   the work should have been. The tiles themselves, including Agentic AI, are
   untouched: same four doors, same source, same copy, same counts.
   ========================================================================= */

/** portfolio-copy.md, verbatim. Split on spaces for the reveal, never edited. */
const STATEMENT = "Graphic designer who ships software.";

export default function HomePage() {
  const tiles = getHomeTiles();
  const [feature, ...rest] = caseStudyCards(getSelected());

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
                  text content comes out as "Graphicdesignerwho...", which is
                  what a screen reader would then read and what the browser
                  would use as the accessible name. Spacing large display type
                  with margins instead of spaces breaks the text. */}
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

        <p className={styles.heroSub}>
          I spent four years making catalogs and marketing for hundreds of
          clients, then learned to build the products instead of decorating
          them. Now I design and ship AI tools end to end &mdash; interface,
          backend, model pipeline, and the parts nobody wants to own.
        </p>

        {/* Non-textual on purpose. A "scroll to explore" label would be copy
            that does not exist in portfolio-copy.md, so the cue is a rule that
            travels down its own track and is hidden from assistive tech. */}
        <span className={styles.cue} aria-hidden="true">
          <span className={styles.cueLine} />
        </span>
      </Container>

      {/* THE HERO'S OWN VISUAL, and the one full-bleed element on the site.
          It closes the first screen rather than opening a new section, which
          is why it sits inside the hero's rhythm and DrawEvolve below it is
          still the first piece of WORK a visitor meets.

          Real footage, and it is the site's existing clip: same file, same
          poster, same <AutoVideo> policy. That component already refuses to
          autoplay on a metered or unknown connection, under reduced motion,
          or off screen, and it preloads metadata only, so a 14MB file is not
          pulled down to decorate a page nobody scrolled. */}
      {clip && (
        <Container width="full" className={styles.band}>
          <VideoSlot video={clip} sizes="100vw" />
        </Container>
      )}

      <Container as="section" className={styles.applications}>
        <Reveal>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              <Link href="/applications" className={styles.sectionLink}>
                Applications
              </Link>
            </h2>
            <p className={styles.sectionMeta}>Manual running order</p>
          </div>
        </Reveal>

        {/* The feature. Its own composition, not a wider card: the cover runs
            at 6 of 12 columns with the deck and status set beside it, so it
            reads as a different KIND of object rather than the same card
            scaled up. The 0.08s delay lets the section rule land first, so the
            two read as one movement instead of firing together. */}
        {feature && (
          <Reveal delay={0.08}>
            <Link href={feature.href} className={styles.feature}>
              {feature.thumb && (
                <span className={styles.featureMedia}>
                  <Image
                    src={feature.thumb.url}
                    alt=""
                    fill
                    sizes="(max-width: 62rem) 100vw, 44rem"
                    /* Below the clip band, so never the LCP candidate. */
                    loading="lazy"
                    unoptimized={feature.thumb.unoptimized}
                    className={styles.featureImage}
                  />
                  <span className={styles.featureCursor} aria-hidden="true">
                    &rarr;
                  </span>
                </span>
              )}

              <span className={styles.featureText}>
                <span className={styles.featureTitle}>{feature.title}</span>
                {feature.description && (
                  <span className={styles.featureDeck}>
                    {feature.description}
                  </span>
                )}
                {feature.meta && (
                  <span className={styles.featureMeta}>{feature.meta}</span>
                )}
              </span>
            </Link>
          </Reveal>
        )}

        {/* The rest of the running order, at ordinary card size. */}
        <Reveal className={styles.rest}>
          <CardGrid cards={rest} label="Applications" />
        </Reveal>
      </Container>

      <Container as="section" className={styles.doors}>
        <Reveal>
          <ul className={styles.grid} aria-label="Sections">
            {tiles.map((tile) => (
              <li key={tile.slug} className={styles.cell}>
                <Link href={tile.href} className={styles.tile}>
                  {tile.image && (
                    <span className={styles.media}>
                      <Image
                        src={tile.image.url}
                        alt=""
                        width={tile.image.width}
                        height={tile.image.height}
                        sizes="(max-width: 48rem) 100vw, 50vw"
                        loading="lazy"
                        /* An animated tile thumbnail stays animated. */
                        unoptimized={tile.image.unoptimized}
                        className={styles.image}
                      />
                    </span>
                  )}

                  <span className={styles.label}>
                    <span className={styles.title}>{tile.title}</span>
                    {tile.meta && (
                      <span className={styles.meta}>{tile.meta}</span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </>
  );
}
