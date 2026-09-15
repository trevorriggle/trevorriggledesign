import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { Frame } from "@/components/ui/Frame";
import { VideoSlot } from "@/components/ui/Video";
import { Gallery } from "@/components/ui/Gallery";
import { ScrollSequence } from "@/components/ui/ScrollSequence";
import { Pager } from "@/components/ui/Pager";
import { MetaRail, Meta, MetaChips, MetaLinks } from "@/components/ui/MetaRail";
import { MdxBody } from "@/components/mdx/MdxBody";
import { Reveal } from "@/components/motion/Reveal";

import { SELECTED, getCaseStudy, getNeighbours } from "@/content";
import grid from "@/components/ui/grid.module.css";
import styles from "./page.module.css";

export function generateStaticParams() {
  return SELECTED.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCaseStudy(slug);
  if (!entry) return {};

  return {
    title: entry.title,
    /* The deck, which is author-written. Never generated. */
    description: entry.deck || undefined,
    alternates: { canonical: `/work/${entry.slug}` },
    openGraph: {
      title: entry.title,
      description: entry.deck || undefined,
      url: `/work/${entry.slug}`,
      type: "article",
    },
  };
}

/**
 * Split a markdown body into its first `##` section and everything after it.
 *
 * Returns ["", body] when there is no second heading, which is the safe
 * direction: nothing moves above the sequence unless there is genuinely a
 * section to leave behind.
 *
 * The match is anchored to the line start so a `##` inside a fenced code
 * block or mid-sentence cannot split the body.
 */
function splitAtSecondHeading(body: string): [string, string] {
  const heading = /^## /gm;
  const first = heading.exec(body);
  if (!first) return ["", body];
  const second = heading.exec(body);
  if (!second) return ["", body];
  return [body.slice(0, second.index).trimEnd(), body.slice(second.index)];
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCaseStudy(slug);
  if (!entry) notFound();

  const { prev, next } = getNeighbours(slug);

  /* Plates the body did not place itself. */
  const plates = entry.images.filter(
    (i) => i.exists && !entry.body.includes(i.src),
  );

  /* THE SEQUENCE IS COVER PLUS PLATES, AS ONE OBJECT. An entry that opts in
     stops rendering a lead plate above the prose and a gallery strip below
     it, because that split is what it is opting out of: five steps of one
     loop shown in two places is not a sequence, it is two galleries. See the
     note on `sequence` in content/index.ts.

     Falls back to the normal treatment on its own if there is nothing to
     sequence: <ScrollSequence> returns null under two shots, and these two
     flags are what the rest of the template branches on. */
  const sequence =
    entry.sequence && entry.cover?.exists ? [entry.cover, ...plates] : [];
  const hasSequence = sequence.length >= 2;

  /* THE FIRST SECTION OF PROSE RUNS ABOVE THE SEQUENCE.

     The sequence is the page's lead visual and it stays high, which is a
     decision this file already records and does not reverse. But it was
     landing directly under a one-line deck, so a reader met five screenshots
     of a product before a single sentence explaining what problem it solves.
     "The premise" is that sentence, and it belongs in front of the pictures
     it is the premise for.

     ONLY THE FIRST SECTION MOVES. Splitting at the second `## ` puts one
     section above and the remaining five below, so the argument is still
     read after the evidence — which is the ordering the sequence was raised
     for in the first place. Moving the whole body would put four sections
     of prose in front of the one thing that shows the thing running.

     An entry with no sequence, or a body with fewer than two headings, is
     untouched: `lead` is empty and `rest` is the whole body. */
  const [leadBody, restBody] = hasSequence
    ? splitAtSecondHeading(entry.body)
    : ["", entry.body];

  return (
    <>
      {/* NO BREADCRUMB. The head opened with "Applications / 01" on a ruled
          row above the mark. The block is gone, not just its text, and the
          head's own top padding now does the whole job of opening the page.
          The masthead's Applications tab is the way back. */}
      <Container as="header" className={styles.head}>
        <div className={styles.headGrid}>
          <div className={styles.headMain}>
            {/* THE MARK IS THE HEADING. It used to sit above an <h1> that
                set the entry's name in type, so the page opened by saying
                "DrawEvolve" twice: once as the wordmark it was designed as,
                and again underneath in Archivo. The brief calls that what it
                is, a type block that restates the wordmark.

                So the logo moved INSIDE the h1 and carries the accessible
                name as its alt text. There is still exactly one h1 on the
                page, it still reads the entry's name to a screen reader and
                to a crawler, and nothing is said twice in type.

                When there is no mark on disk the h1 renders the name as type,
                because a heading is not optional and a page whose title
                depends on a file existing is a page that can lose its title. */}
            <h1 className={styles.title}>
              {entry.logo?.exists ? (
                <span
                  className={styles.logo}
                  /* The box takes the logo's DECLARED aspect, which is the
                     mark's content bounds. Inline because it is per-entry
                     data, not a design token. */
                  style={
                    {
                      "--logo-aspect": `${entry.logo.width} / ${entry.logo.height}`,
                    } as CSSProperties
                  }
                >
                  <Image
                    src={entry.logo.url}
                    alt={entry.title}
                    fill
                    sizes="(max-width: 62rem) 70vw, 26rem"
                    priority
                    unoptimized={entry.logo.unoptimized}
                    className={styles.logoImage}
                  />
                </span>
              ) : (
                entry.title
              )}
            </h1>

            {/* THE ONE LINE OF ORIENTATION, and the only type in the head. A
                mark on its own tells a stranger nothing: "thoosie" is not a
                word, and a wordmark for an app nobody has heard of is a
                picture of a name. This says what the thing actually is. */}
            {entry.deck && <p className={styles.deck}>{entry.deck}</p>}

            {/* The second line. The deck names the thing; this says what it
                does. A mark plus four words is not orientation. */}
            {entry.deckB && <p className={styles.deckB}>{entry.deckB}</p>}

            {/* NO STATUS CHIP. `entry.state` is still read from frontmatter
                and still shown in the rail as Context, but it no longer gets
                a bordered pill of its own under the deck. See the note in
                page.module.css for why the prose carries it better. */}
          </div>

          <div className={`${styles.headRail} ${grid.railRuled}`}>
            <MetaRail>
              <Meta term="Role" value={entry.role.join(", ")} />
              <Meta term="Context" value={entry.context} />
              <MetaChips term="Stack" items={entry.stack} />
              <MetaLinks term="Links" links={entry.links} />
            </MetaRail>
          </div>
        </div>
      </Container>

      {/* CONTAINED, not full bleed. This clip used to run edge to edge as the
          one element on the site allowed to touch the viewport; on a centred
          page that made it the only thing wider than the content it belongs
          to. It sits on the content grid now, framed like every other piece
          of media here. */}
      {entry.video && (
        <Container className={styles.lead}>
          <VideoSlot
            video={entry.video}
            sizes="(max-width: 62rem) 100vw, 84rem"
          />
        </Container>
      )}

      {/* Every cover in content is a portrait screenshot, and a portrait lead
          at full width is the giant-image problem in its purest form. In the
          container, height-capped by Frame, it comes out near 585px wide and
          reads as a picture of an app rather than as wallpaper.

          Skipped entirely when the entry is a sequence: the cover is the
          sequence's first shot and rendering it here as well would put the
          same picture on the page twice, once above the prose and once
          inside the run it opens. */}
      {entry.cover?.exists && !hasSequence && (
        <Container className={styles.lead}>
          {/* `sizes` HAS TO MATCH THE BOX, and it did not. This said 40rem,
              which is 640px, while <Frame> lets the picture run to the full
              container: 1282px at a 90rem window. The browser was picking a
              source for a 640px slot and scaling it up to twice that, so the
              lead shot on every entry without a clip rendered soft. It read
              as a small image because it was a small image, stretched. */}
          <Frame
            image={entry.cover}
            sizes="(max-width: 62rem) 100vw, (max-width: 90rem) 92vw, 80rem"
            priority={!entry.video}
          />
        </Container>
      )}

      {/* THE SEQUENCE, AND IT IS HIGH ON THE PAGE ON PURPOSE.

          It used to render after the entire prose body, which put the one
          thing that shows the product actually running below four sections of
          argument about it. A reader deciding in fifteen seconds whether this
          is worth their time was being asked to read first and look second.
          It now sits directly under the deck, where the lead plate would
          otherwise be — because for a sequence entry it IS the lead plate,
          with the cover as its first shot.

          IT IS NOT WRAPPED IN <Reveal>. Reveal ships its children as
          opacity: 0 in the server HTML and waits for hydration to bring them
          back, which would mean the one block on this page whose entire point
          is that the first shot is visible on arrival would start invisible
          and depend on a JS chunk to appear. */}
      {/* The premise, above the pictures it is the premise for. */}
      {leadBody && (
        <Container as="section" className={styles.leadBlock}>
          <div className={styles.body}>
            <div className={styles.prose}>
              <MdxBody
                source={leadBody}
                images={entry.images}
                entryPath={`content/work/${entry.slug}/index.mdx`}
              />
            </div>
          </div>
        </Container>
      )}

      {hasSequence && (
        <Container as="section" className={styles.sequence}>
          <ScrollSequence
            shots={sequence.map((image) => ({
              url: image.url,
              alt: image.alt,
              width: image.width,
              height: image.height,
              caption: image.caption,
              unoptimized: image.unoptimized,
            }))}
            label={`${entry.title}, ${sequence.length} screens in sequence`}
            priorityFirst
          />
        </Container>
      )}

      {restBody && (
        <Container as="section" className={styles.block}>
          <Reveal className={styles.body}>
            <div className={styles.prose}>
              <MdxBody
                source={restBody}
                images={entry.images}
                entryPath={`content/work/${entry.slug}/index.mdx`}
              />
            </div>
          </Reveal>
        </Container>
      )}

      {/* THE PLATES, AS A GALLERY. They used to be a vertical stack that
          alternated between an indented measure and a pull past the right
          gutter, so a run of four screenshots was four screens of scrolling
          and no two of them were comparable. As a strip they are one object:
          plates at a single height that a visitor moves through sideways,
          which is how a set of screenshots from one app wants to be read.

          <Gallery> owns the mechanics: derived plate widths, native snap
          scrolling that works unhydrated, mouse drag, and no scrollbar. */}
      {plates.length > 0 && !hasSequence && (
        <Container as="section" className={styles.block}>
          <Reveal>
            <Gallery
              images={plates}
              label={`${entry.title}, ${plates.length} plates`}
            />
          </Reveal>
        </Container>
      )}

      <Container>
        <Reveal>
          <Pager prev={prev} next={next} />
        </Reveal>
      </Container>
    </>
  );
}
