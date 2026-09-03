import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { MetaRail, Meta, MetaLinks } from "@/components/ui/MetaRail";
import { site } from "@/lib/site";
import grid from "@/components/ui/grid.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: site.description,
};

/* Copy: portfolio-copy.md → "Contact page". Heading, both sentences and the
   address are verbatim; nothing is added around them. */
export default function ContactPage() {
  const hasRail = Boolean(site.location || site.availability || site.social.length);

  return (
    <Container className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <h1 className={styles.title}>Get in touch</h1>

          <p className={styles.lead}>
            I&rsquo;m looking for design engineering and AI product roles. Happy
            to talk about anything on this site in as much detail as you want.
          </p>

          <p className={styles.address}>
            <ExternalLink href={`mailto:${site.email}`}>
              {site.email}
            </ExternalLink>
          </p>
        </div>

        {/* Renders only when there is something to put in it. An empty ruled
            rail is worse than no rail. */}
        {hasRail && (
          <div className={`${styles.rail} ${grid.railRuled}`}>
            <MetaRail>
              <Meta term="Based" value={site.location} />
              <Meta term="Looking for" value={site.availability} />
              <MetaLinks
                term="Elsewhere"
                links={site.social.map((s) => ({
                  ...s,
                  kind: "other" as const,
                }))}
              />
            </MetaRail>
          </div>
        )}
      </div>
    </Container>
  );
}
