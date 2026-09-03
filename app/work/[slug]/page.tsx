import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { Frame } from "@/components/ui/Frame";
import { VideoSlot } from "@/components/ui/Video";
import { Pager } from "@/components/ui/Pager";
import { MetaRail, Meta, MetaChips, MetaLinks } from "@/components/ui/MetaRail";
import { MdxBody } from "@/components/mdx/MdxBody";

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
          <Link href="/#applications">Applications</Link>
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

      {/* Full bleed. The only element on the site that touches the viewport. */}
      {entry.video && (
        <Container width="full">
          <VideoSlot video={entry.video} sizes="100vw" />
        </Container>
      )}

      {entry.cover?.exists && (
        <Container width="full">
          <Frame
            image={entry.cover}
            sizes="100vw"
            priority={!entry.video}
          />
        </Container>
      )}

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

      {plates.length > 0 && (
        <Container as="section" className={styles.block}>
          <ul className={styles.plateStack}>
            {plates.map((image, i) => (
              <li
                key={image.src}
                className={image.bleed ? styles.plateWide : styles.plateInset}
              >
                <Frame
                  image={image}
                  ordinal={String(i + 1).padStart(2, "0")}
                  sizes={
                    image.bleed
                      ? "(max-width: 62rem) 100vw, 84rem"
                      : "(max-width: 62rem) 100vw, 38rem"
                  }
                />
              </li>
            ))}
          </ul>
        </Container>
      )}

      <Container>
        <Pager prev={prev} next={next} />
      </Container>
    </>
  );
}
