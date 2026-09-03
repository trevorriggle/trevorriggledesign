import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { Argument, hasArgument } from "@/components/ui/Argument";
import { Diagram } from "@/components/ui/Diagram";
import { Frame } from "@/components/ui/Frame";
import { VideoSlot } from "@/components/ui/Video";
import { GallerySet } from "@/components/ui/GallerySet";
import { Pager } from "@/components/ui/Pager";
import { ModelTable, BudgetBlock, FailureTable } from "@/components/ui/Tables";
import {
  MetaRail,
  Meta,
  MetaChips,
  MetaLinks,
} from "@/components/ui/MetaRail";
import { MdxBody } from "@/components/mdx/MdxBody";

import { getAllEntries, getEntry, getNeighbours } from "@/content";
import { sectionOrdinal, sectionHref } from "@/content/sections";
import grid from "@/components/ui/grid.module.css";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getAllEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};

  /* The deck for a case study, the caption for a gallery set. Both are
     author-written; neither is generated, because a generated description of
     someone's work is a claim they did not make. */
  const description =
    entry.kind === "case" ? entry.deck : (entry.caption ?? undefined);

  return {
    title: entry.title,
    description,
    alternates: { canonical: `/work/${entry.slug}` },
    openGraph: {
      title: entry.title,
      description,
      url: `/work/${entry.slug}`,
      type: "article",
    },
  };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const { prev, next } = getNeighbours(slug);

  return (
    <>
      <Container as="header" className={styles.head}>
        <p className={styles.breadcrumb}>
          <Link href="/#selected-work">Selected work</Link>
          <span aria-hidden="true">/</span>
          <span className={styles.crumbOrdinal}>
            {sectionOrdinal(entry.section)}
          </span>
          <Link href={sectionHref(entry.section)}>
            {entry.sectionMeta.title}
          </Link>
          {entry.year && (
            <>
              <span aria-hidden="true">/</span>
              <span>{entry.year}</span>
            </>
          )}
        </p>

        <div className={styles.headGrid}>
          <div className={styles.headMain}>
            <h1 className={styles.title}>{entry.title}</h1>

            {entry.kind === "case" ? (
              <p className={styles.deck}>{entry.deck}</p>
            ) : (
              entry.caption && <p className={styles.deck}>{entry.caption}</p>
            )}

            {/* A shelved project is labelled as shelved, in the author's own
                words from the copy's **Status:** line. Nothing here softens it
                to "paused", "on hold" or "upcoming", and there is no template
                branch that could: this prints `state` verbatim or prints
                nothing. Framing dead work as alive is the one thing on a
                portfolio a technical reader always catches. */}
            {entry.kind === "case" && entry.state && (
              <p
                className={
                  entry.context === "shelved" ? styles.shelved : styles.state
                }
              >
                {entry.state}
              </p>
            )}
          </div>

          <div className={`${styles.headRail} ${grid.railRuled}`}>
            <MetaRail>
              <Meta term="Year" value={entry.year} />
              {entry.kind === "case" ? (
                <>
                  <Meta term="Role" value={entry.role.join(", ")} />
                  <Meta term="Timeline" value={entry.timeline} />
                  {/* No Status row: `state` is already set as a chip under
                      the deck, and printing the same sentence twice on one
                      screen reads as a template with a slot to fill. */}
                  <Meta term="Context" value={entry.context} />
                  <Meta term="With" value={entry.collaborators} />
                  <MetaChips term="Stack" items={entry.stack} />
                </>
              ) : (
                <Meta term="Medium" value={entry.medium} />
              )}
              <MetaLinks term="Links" links={entry.links} />
            </MetaRail>
          </div>
        </div>
      </Container>

      {/* ---- Case study --------------------------------------------------- */}
      {entry.kind === "case" && (
        <>
          {/* The video leads. When a case study has a clip, the clip is the
              strongest thing on the page and nothing should sit above it. */}
          {/* Full bleed. The lead media is the only element on the site that
              touches the viewport edge, which is what makes it read as the
              opening of the page rather than as the first item in it. */}
          {entry.video && (
            <Container width="full">
              <VideoSlot video={entry.video} sizes="100vw" />
            </Container>
          )}

          {entry.cover && (
            <Container width="full">
              <Frame
                image={entry.cover}
                role="cover"
                sizes="100vw"
                priority={!entry.video}
              />
            </Container>
          )}

          {hasArgument(entry) && (
            <Container>
              <div className={styles.body}>
                <div className={styles.argument}>
                  <Argument study={entry} />
                </div>
              </div>
            </Container>
          )}

          {(entry.architecture ||
            entry.models.length > 0 ||
            entry.budget ||
            entry.failureModes.length > 0) && (
            <Container as="section" className={styles.block}>
              <p className={styles.blockLabel}>How it is built</p>
              <div className={styles.body}>
                <div className={styles.systems}>
                  {entry.architecture && (
                    <Diagram architecture={entry.architecture} />
                  )}
                  {entry.budget && <BudgetBlock budget={entry.budget} />}
                  <ModelTable models={entry.models} />
                  <FailureTable modes={entry.failureModes} />
                </div>
              </div>
            </Container>
          )}

          {/* No "Detail" label: the body is the case study, not an appendix
              to a summary. It carries the copy's own headings and nothing
              else is added around it. */}
          {entry.body && (
            <Container as="section" className={styles.block}>
              <div className={styles.body}>
                <div className={styles.prose}>
                  <MdxBody
                    source={entry.body}
                    images={entry.images}
                    entryPath={`content/work/${entry.slug}/index.mdx`}
                  />
                </div>
              </div>
            </Container>
          )}

          {/* Images declared but not placed in the body render here as a plate
              series, so a declared asset is never silently unused. */}
          {entry.images.filter((i) => !entry.body.includes(i.src)).length > 0 && (
            <Container as="section" className={styles.block}>
              <p className={styles.blockLabel}>Plates</p>
              <ul className={styles.plateStack}>
                {entry.images
                  .filter((i) => !entry.body.includes(i.src))
                  .map((image, i) => (
                    <li
                      key={image.src}
                      className={image.bleed ? styles.plateWide : styles.plateInset}
                    >
                      <Frame
                        image={image}
                        role={`plate ${String(i + 1).padStart(2, "0")}`}
                        ordinal={String(i + 1).padStart(2, "0")}
                        sizes={
                          image.bleed
                            ? "(max-width: 60rem) 100vw, 84rem"
                            : "(max-width: 60rem) 100vw, 38rem"
                        }
                      />
                    </li>
                  ))}
              </ul>
            </Container>
          )}
        </>
      )}

      {/* ---- Gallery ------------------------------------------------------ */}
      {entry.kind === "gallery" && (
        <>
          <Container as="section">
            <GallerySet images={entry.images} priorityFirst />
          </Container>

          {entry.body && (
            <Container as="section" className={styles.block}>
              <div className={styles.body}>
                <div className={styles.prose}>
                  <MdxBody
                    source={entry.body}
                    images={entry.images}
                    entryPath={`content/gallery/${entry.slug}/index.mdx`}
                  />
                </div>
              </div>
            </Container>
          )}
        </>
      )}

      <Container>
        <Pager prev={prev} next={next} />
      </Container>
    </>
  );
}
