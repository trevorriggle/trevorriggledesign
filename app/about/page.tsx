import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Band } from "@/components/ui/Band";
import { MetaRail, Meta } from "@/components/ui/MetaRail";
import { getResume } from "@/lib/resume";
import { site } from "@/lib/site";
import grid from "@/components/ui/grid.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
  alternates: { canonical: "/about" },
};

/* ============================================================================
   ABOUT
   ============================================================================
   Copy: portfolio-copy.md, "ABOUT". Four paragraphs, in the order they were
   written, edited once for the site-wide plain-declarative pass. The third
   paragraph lost "Designing, building, and taking apart whatever project
   comes to mind. It's all part of the process.", which was a dangling
   fragment followed by a sentence that said nothing. Nothing was added.

   THREE PARAGRAPHS NOW, NOT FOUR. The fourth was the ask, "What I'm looking
   for is the job where the design and the building are the same job.", set as
   the page's one pull quote on an ultramarine field. It is deleted, by
   instruction, along with the block that carried it. What it was saying is
   now said literally rather than rhetorically, by the "Looking for" row in
   the rail: see `availability` in lib/site.ts.

   THE RAIL IS REAL METADATA. Based and Looking for come from lib/site.ts and
   render nothing when empty, so the rail cannot become a labelled void.

   THE RESUME IS DISPLAYED, not just linked. Its own section, centred, with a
   render of page one on the page and the download under it. Both the PDF and
   the image have to be on disk or the part that is missing does not render.
   See lib/resume.ts.

   THE REAL RESUME IS ON DISK NOW. public/resume/trevor-riggle-resume.pdf,
   one page, 87 KB. The *-PLACEHOLDER.pdf stub that used to sit there is
   deleted: lib/resume.ts takes the first PDF in the folder, so leaving both
   would have been a coin toss between them.

   THE PALETTE WAS REBALANCED OFF OCHRE. The page carried an ochre pull quote
   AND an ink closing band with ochre type on it, and navy-plus-gold at that
   scale reads as collegiate rather than as this site. Both moved to
   ultramarine, which is the palette's dominant and the ground the home page
   already closes on, so About now matches it instead of being the one page
   with a private colour scheme. Ochre survives as the hover state on the
   closer and as the subnav's active rule, which is the rationing tokens.css
   describes.

ARCHIVO AND DM SANS, AND NOTHING ELSE. The standfirst used to be set in
   Instrument Serif via the global `.intro` utility and the resume's file size
   in DM Mono, which put all four of the site's faces on one page. Both moved
   to the display and text faces. With the pull quote deleted the serif is now
   absent from this page entirely, which is the correct end state for a page
   with no quotation on it.
   ========================================================================= */

const LEAD =
  "I’m a graphic designer with a BFA from West Virginia University. For the last four years I’ve run catalogs and marketing at American Scientific, managing design for hundreds of clients. The kind of production work that teaches you systems whether you want to learn them or not.";

const BODY = [
  "Somewhere in there I got tired of designing interfaces I couldn’t build. I taught myself Swift, then SwiftUI, then the rest of it: TypeScript, Cloudflare Workers, Supabase, enough Metal to write a renderer. I now build and ship products under RIG Tech LLC.",
  "The through-line is that I don’t hand off. That means I’ve had to make real engineering decisions with real costs: architecture I had to migrate, features I had to cut, a product I shelved because the economics didn’t work. Those are on this site too.",
];

export default async function AboutPage() {
  const resume = await getResume();
  const hasRail = Boolean(site.location || site.availability);

  return (
    <>
      <Container as="header" className={styles.head}>
        <h1 className={styles.title}>About</h1>
        <p className={styles.lead}>{LEAD}</p>
      </Container>

      <Container className={styles.body}>
        <div className={styles.grid}>
          <div className={styles.main}>
            {BODY.map((para, i) => (
              <p key={i} className={styles.prose}>
                {para}
              </p>
            ))}
          </div>

          {hasRail && (
            <div className={`${styles.rail} ${grid.railRuled}`}>
              <MetaRail>
                <Meta term="Based" value={site.location} />
                <Meta term="Looking for" value={site.availability} />
              </MetaRail>
            </div>
          )}
        </div>
      </Container>

      {/* THE RESUME, AS ITS OWN SECTION.

          It used to be a button at the bottom of the metadata rail, which on
          a wide screen put the one thing a reader might want to take away
          with them in the narrowest column on the page, under two lines of
          metadata, below the fold. It was findable only if you already knew
          it was there. It is now a titled section on the page's own axis,
          which is what "obvious" means for an element whose whole job is to
          be picked up.

          It still renders only when a PDF is actually on disk. See
          lib/resume.ts: the button is real or it is absent, and there is no
          third state where it is present and broken. */}
      {resume && (
        <Container as="section" className={styles.resumeBlock}>
          <h2 className={styles.resumeHeading}>Resume</h2>

          {/* THE DOCUMENT ITSELF, ON THE PAGE. A download button on its own
              asks a reader to commit to a file before they can see whether it
              is worth opening, which on the one page where somebody is
              deciding about a person is the wrong way round. The PDF is still
              there and still the thing to take away; this is so they do not
              have to take it away in order to read it.

              It renders only when the image is actually on disk. See
              lib/resume.ts. */}
          {resume.image && (
            <Image
              src={resume.image.url}
              alt="Trevor Riggle's resume, one page: experience at American Scientific and RIG Tech, freelance design, a BFA from West Virginia University, and a list of technical, creative and marketing skills"
              width={resume.image.width}
              height={resume.image.height}
              sizes="(max-width: 62rem) 100vw, 46rem"
              className={styles.resumeSheet}
            />
          )}

          <a
            href={resume.url}
            download={resume.filename}
            className={styles.resume}
          >
            <span className={styles.resumeLabel}>Download resume</span>
            <span className={styles.resumeMeta}>
              PDF{resume.sizeKb > 0 && `, ${resume.sizeKb} KB`}
            </span>
          </a>
        </Container>
      )}

      {/* NO PULL QUOTE. "What I'm looking for is the job where the design and
          the building are the same job." sat here on an ultramarine field as
          the page's one pull quote. The sentence and the block are both gone,
          by instruction. The page now closes on the resume and the band.

          This leaves /about with no pull quote at all, which is why the serif
          no longer appears on it: the standfirst was moved off the serif in an
          earlier pass precisely so the quote could be the one place it showed
          up. Instrument Serif is now absent from this page entirely. */}

      {/* A closing band, and the only navigation this page offers. Somebody
          who has read to the bottom of the about page is the reader most
          likely to want to get in touch, and making them go back up to the
          masthead for it is a small, avoidable failure. */}
      <Band ground="ultramarine" pad="tight" className={styles.closer}>
        <p className={styles.closerLine}>
          <Link href="/contact" className={styles.closerLink}>
            Get in touch
          </Link>
        </p>
      </Band>
    </>
  );
}
