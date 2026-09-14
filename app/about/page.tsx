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

   THE RESUME BUTTON APPEARS ONLY WHEN A REAL FILE EXISTS. No placeholder PDF
   is shipped. See lib/resume.ts for why that is worth a deviation from the
   brief on the one page where the reader is deciding something.
   ========================================================================= */

const LEAD =
  "I’m a graphic designer with a BFA from West Virginia University. For the last four years I’ve run catalogs and marketing at American Scientific, managing design for hundreds of clients. The kind of production work that teaches you systems whether you want to learn them or not.";

const BODY = [
  "Somewhere in there I got tired of designing interfaces I couldn’t build. I taught myself Swift, then SwiftUI, then the rest of it: TypeScript, Cloudflare Workers, Supabase, enough Metal to write a renderer. I now build and ship products under RIG Tech LLC.",
  "The through-line is that I don’t hand off. I design the thing, build the thing, and own the parts of it that break. That means I’ve had to make real engineering decisions with real costs: architecture I had to migrate, features I had to cut, a product I shelved because the economics didn’t work. Those are on this site too.",
];

const ASK =
  "What I’m looking for is the job where the design and the building are the same job.";

export default function AboutPage() {
  const resume = getResume();
  const hasRail = Boolean(site.location || site.availability || resume);

  return (
    <>
      <Container as="header" className={styles.head}>
        <h1 className={styles.title}>About</h1>
        <p className={`intro ${styles.lead}`}>{LEAD}</p>
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

              {resume && (
                <a
                  href={resume.url}
                  download={resume.filename}
                  className={styles.resume}
                >
                  <span className={styles.resumeLabel}>Download resume</span>
                  <span className={`mono ${styles.resumeMeta}`}>
                    PDF{resume.sizeKb > 0 && `, ${resume.sizeKb} KB`}
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* The ask, as the page's one pull quote. Ink on ochre: the brief asked
          for ochre pull quotes, and ochre type on this ground is 2.00:1. The
          field carries the colour and the sentence stays readable. */}
      <Container className={styles.askBlock}>
        <PullQuote>{ASK}</PullQuote>
      </Container>

      {/* A closing band, and the only navigation this page offers. Somebody
          who has read to the bottom of the about page is the reader most
          likely to want to get in touch, and making them go back up to the
          masthead for it is a small, avoidable failure. */}
      <Band ground="ink" pad="tight" className={styles.closer}>
        <p className={styles.closerLine}>
          <Link href="/contact" className={styles.closerLink}>
            Get in touch
          </Link>
        </p>
      </Band>
    </>
  );
}
