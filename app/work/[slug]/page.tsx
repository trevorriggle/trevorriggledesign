import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { Frame } from "@/components/ui/Frame";
import { VideoSlot } from "@/components/ui/Video";
import { Pager } from "@/components/ui/Pager";
import { MetaRail, Meta, MetaChips, MetaLinks } from "@/components/ui/MetaRail";
import { MdxBody } from "@/components/mdx/MdxBody";
import { Reveal } from "@/components/motion/Reveal";

import { SELECTED, getSelected, getCaseStudy, getNeighbours } from "@/content";
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

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCaseStudy(slug);
  if (!entry) notFound();

  const { prev, next } = getNeighbours(slug);
  const position = getSelected().findIndex((s) => s.slug === slug) + 1;

  /* Plates the body did not place itself. */
  const plates = entry.images.filter(
    (i) => i.exists && !entry.body.includes(i.src),
  );

  return (
    <>
      <Container as="header" className={styles.head}>
        <p className={styles.breadcrumb}>
          <Link href="/applications">Applications</Link>
          <span aria-hidden="true">/</span>
          <span className={styles.crumbOrdinal}>
            {String(position).padStart(2, "0")}
          </span>
        </p>

        <div className={styles.headGrid}>
          <div className={styles.headMain}>
            <h1 className={styles.title}>{entry.title}</h1>
            {entry.deck && <p className={styles.deck}>{entry.deck}</p>}

            {/* The Status line, verbatim or not at all. No template branch can
                render a shelved project as active. */}
            {entry.state && (
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
          reads as a picture of an app rather than as wallpaper. */}
      {entry.cover?.exists && (
        <Container className={styles.lead}>
          <Frame
            image={entry.cover}
            sizes="(max-width: 62rem) 100vw, 40rem"
            priority={!entry.video}
          />
        </Container>
      )}

      {entry.body && (
        <Container as="section" className={styles.block}>
          <Reveal className={styles.body}>
            <div className={styles.prose}>
              <MdxBody
                source={entry.body}
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
          and no two of them were comparable. As a snap track they are one
          object: a filmstrip at a single height that a visitor moves through
          sideways, which is how a set of screenshots from one app actually
          wants to be read.

          NO JS. Native `overflow-x` plus `scroll-snap-type`, so trackpad,
          touch and the keyboard all work with nothing hydrated. The track is
          focusable and labelled so keyboard users can reach and arrow through
          it, and `data-lenis-prevent` keeps the smooth-scroll wrapper from
          swallowing a horizontal gesture that belongs to this element. */}
      {plates.length > 0 && (
        <Container as="section" className={styles.block}>
          <Reveal>
            <ul
              className={styles.gallery}
              tabIndex={0}
              role="group"
              aria-label={`${entry.title}, ${plates.length} plates`}
              data-lenis-prevent
            >
              {plates.map((image, i) => (
                <li key={image.src} className={styles.plate}>
                  <Frame
                    image={image}
                    ordinal={String(i + 1).padStart(2, "0")}
                    sizes="(max-width: 62rem) 88vw, 46rem"
                  />
                </li>
              ))}
            </ul>
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
