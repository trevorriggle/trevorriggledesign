import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MetaRail, Meta } from "@/components/ui/MetaRail";
import { site } from "@/lib/site";
import grid from "@/components/ui/grid.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

/* ============================================================================
   ABOUT
   ============================================================================
   Copy: portfolio-copy.md → "ABOUT". All four paragraphs, verbatim, in the
   order they were written.

   The scaffold here used to be four numbered "movements" — What I do now /
   How I got here / How I work / What I'm looking for — each with a prompt
   under it. Those headings are gone. The copy is four paragraphs of continuous
   prose with no headings of its own, and slicing it under invented subheads
   would be writing structure the author did not write. The first paragraph
   takes the lead size; the rest run as body. That is a type decision, not an
   edit.

   The metadata rail is gone for the same reason: its three rows ("Building
   with", "Designing with", "Shipped on") were chip lists, and filling them
   would mean mining the prose for tool names and re-setting them as tags the
   author never wrote. The rail returns automatically if `location` or
   `availability` is ever filled in lib/site.ts.
   ========================================================================= */

export default function AboutPage() {
  const hasRail = Boolean(site.location || site.availability);

  return (
    <>
      <Container as="header" className={styles.head}>
        <h1 className={styles.title}>About</h1>
      </Container>

      <Container>
        <div className={styles.grid}>
          <div className={styles.main}>
            <p className={styles.lead}>
              I&rsquo;m a graphic designer with a BFA from West Virginia
              University. For the last four years I&rsquo;ve run catalogs and
              marketing at American Scientific, managing design for hundreds of
              clients — the kind of production work that teaches you systems
              whether you want to learn them or not.
            </p>

            <p className={styles.prose}>
              Somewhere in there I got tired of designing interfaces I
              couldn&rsquo;t build. I taught myself Swift, then SwiftUI, then
              the rest of it — TypeScript, Cloudflare Workers, Supabase, enough
              Metal to write a renderer. I now build and ship products under RIG
              Tech LLC.
            </p>

            <p className={styles.prose}>
              The through-line is that I don&rsquo;t hand off. I design the
              thing, build the thing, and own the parts of it that break. That
              means I&rsquo;ve had to make real engineering decisions with real
              costs — architecture I had to migrate, features I had to cut, a
              product I shelved because the economics didn&rsquo;t work. Those
              are on this site too.
            </p>

            <p className={styles.prose}>
              What I&rsquo;m looking for is the job where the design and the
              building are the same job.
            </p>
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
    </>
  );
}
