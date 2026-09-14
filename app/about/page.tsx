import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Band } from "@/components/ui/Band";
import { PullQuote } from "@/components/ui/PullQuote";
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
   Copy: portfolio-copy.md, "ABOUT". All four paragraphs, verbatim, in the
   order they were written. Nothing here is rewritten, condensed or added to.

   WHAT THE OVERHAUL CHANGED IS COMPOSITION, NOT WORDS. The page was four
   paragraphs stacked in one column at two sizes, which is the flat, minimal
   thing the brief is about. The same four paragraphs now run through three
   registers: the first as a serif standfirst, the middle two as body on the
   reading measure beside a metadata rail, and the fourth lifted out as the
   page's one pull quote on an ochre field.

   THE FOURTH PARAGRAPH IS THE PULL QUOTE AND IS NOT ALSO IN THE PROSE. It is
   one sentence, it is the ask, and it was already being given its own rule
   and its own air at the bottom of the column. Setting it twice would be the
   same mistake the case study heads were making with the wordmark.

   THE RAIL IS REAL METADATA. Based and Looking for come from lib/site.ts and
   render nothing when empty, so the rail cannot become a labelled void.

   THE RESUME IS ITS OWN SECTION, not a button in the rail, and it appears
   only when a real file exists. See lib/resume.ts.

   A PLACEHOLDER PDF IS CURRENTLY ON DISK, at the author's explicit request,
   and it is the one thing on this page that should not ship as it stands.
   lib/resume.ts argues at length against exactly this file, and the argument
   still holds: the reader most likely to click it is a hiring manager in a
   debrief, and handing that reader a stub is worse than showing them no
   button. It is named *-PLACEHOLDER.pdf so it cannot be mistaken for the
   real thing in a directory listing. Drop the real export into
   public/resume/ and delete it; no code changes.

   THE PALETTE WAS REBALANCED OFF OCHRE. The page carried an ochre pull quote
   AND an ink closing band with ochre type on it, and navy-plus-gold at that
   scale reads as collegiate rather than as this site. Both moved to
   ultramarine, which is the palette's dominant and the ground the home page
   already closes on, so About now matches it instead of being the one page
   with a private colour scheme. Ochre survives as the hover state on the
   closer and as the subnav's active rule, which is the rationing tokens.css
   describes.

   ARCHIVO AND DM SANS, AND THE SERIF ONLY IN THE PULL QUOTE. The standfirst
   used to be set in Instrument Serif via the global `.intro` utility and the
   resume's file size in DM Mono, which put all four of the site's faces on
   one page. The serif is now on this page exactly once, in the quote.
   ========================================================================= */

const LEAD =
  "I’m a graphic designer with a BFA from West Virginia University. For the last four years I’ve run catalogs and marketing at American Scientific, managing design for hundreds of clients. The kind of production work that teaches you systems whether you want to learn them or not.";

const BODY = [
  "Somewhere in there I got tired of designing interfaces I couldn’t build. I taught myself Swift, then SwiftUI, then the rest of it: TypeScript, Cloudflare Workers, Supabase, enough Metal to write a renderer. I now build and ship products under RIG Tech LLC.",
  "The through-line is that I don’t hand off. Designing, building, and taking apart whatever project comes to mind. It’s all part of the process. That means I’ve had to make real engineering decisions with real costs: architecture I had to migrate, features I had to cut, a product I shelved because the economics didn’t work. Those are on this site too.",
];

const ASK =
  "What I’m looking for is the job where the design and the building are the same job.";

export default function AboutPage() {
  const resume = getResume();
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
          <div className={styles.resumeGrid}>
            <h2 className={styles.resumeHeading}>Resume</h2>
            <div className={styles.resumeBody}>
              <p className={styles.resumeCopy}>
                The whole thing on one page, for reading offline or passing
                along.
              </p>
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
            </div>
          </div>
        </Container>
      )}

      {/* The ask, as the page's one pull quote. Ink on ochre: the brief asked
          for ochre pull quotes, and ochre type on this ground is 2.00:1. The
          field carries the colour and the sentence stays readable. */}
      <Container className={styles.askBlock}>
        <PullQuote ground="ultramarine">{ASK}</PullQuote>
      </Container>

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
