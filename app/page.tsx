import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { VideoSlot } from "@/components/ui/Video";
import { Reveal } from "@/components/motion/Reveal";
import { getHomeTiles } from "@/lib/home-tiles";
import { getCaseStudy } from "@/content";
import styles from "./page.module.css";

/* ============================================================================
   HOME
   ============================================================================
   Three things, in this order, and nothing else:

     1  the statement   129px, revealed word by word, alone on the first screen
     2  the clip        thoosie's footage, full bleed, closing the hero
     3  the four doors  Applications, Design, Agentic AI, About

   THE APPLICATIONS BAND IS GONE. This page used to carry the statement, then
   an "Applications" heading, then DrawEvolve as a large feature, then thoosie
   and Lynk as preview cards, and then the doors. Those three boxes were the
   whole of `/applications`, one click away and reachable from a door directly
   beneath them, so the page was showing the same set twice and the doors were
   competing with a copy of what they open. The browsing tier lives on
   `/applications` and `/design`; this page's job is the statement, the clip,
   and four ways in.

   THE STATEMENT'S REVEAL IS CSS, NOT FRAMER, and that is a load decision, not
   a style one. This is the page's LCP text. A framer reveal ships it as
   `opacity: 0` in the server HTML and waits for hydration to bring it back,
   which would make the largest paint on the site depend on a JS chunk. The
   keyframes in page.module.css run on first paint with no JS at all. Framer
   handles the doors, which are below the fold, where a hydration wait costs
   nothing because nobody has scrolled to them yet.

   THE WORD SPLIT IS PRESENTATIONAL. The statement is one string constant,
   split on spaces at render, so it exists once and no word is written into the
   markup. Each word is a masked span: the mask clips, the word inside rises.
   The <h1>'s text content is the sentence, spaces and all, so the accessible
   name is unchanged.
   ========================================================================= */

/** The site's opening line. Split on spaces for the reveal, never edited. */
const STATEMENT = "Graphic Designer & Developer";

export default function HomePage() {
  const tiles = getHomeTiles();

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
                  is what a screen reader would read and what the browser would
                  use as the accessible name. */}
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
      </Container>

      {/* THE HERO'S OWN VISUAL, and the one full-bleed element on the site.
          It closes the first screen rather than opening a new section.

          Real footage, and it is the site's existing clip: same file, same
          poster, same <AutoVideo> policy. That component already refuses to
          autoplay on a metered or unknown connection, under reduced motion, or
          off screen, and it preloads metadata only, so a 14MB file is not
          pulled down to decorate a page nobody scrolled. */}
      {clip && (
        <Container width="full" className={styles.band}>
          <VideoSlot video={clip} sizes="100vw" />
        </Container>
      )}

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
