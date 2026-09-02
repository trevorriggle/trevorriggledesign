import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { MetaRail, Meta, MetaLinks } from "@/components/ui/MetaRail";
import { site } from "@/lib/site";
import grid from "@/components/ui/grid.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  /* TODO: under ~160 characters. */
  description: "TODO",
};

export default function ContactPage() {
  /* Widened to string: `site` is `as const`, so the literal type would
     narrow to never the moment it is compared against "TODO". */
  const email: string = site.email;
  const hasEmail = email !== "TODO" && email.includes("@");

  return (
    <Container className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <h1 className={styles.title}>Contact</h1>

          {/* TODO: one or two sentences. What you want to be contacted about,
              and what a useful first message contains. */}
          <p className={styles.lead}>TODO</p>

          {hasEmail ? (
            <p className={styles.address}>
              <ExternalLink href={`mailto:${email}`}>
                {email}
              </ExternalLink>
            </p>
          ) : (
            <p className={styles.todo}>
              TODO — set <strong>email</strong> in lib/site.ts. The address
              renders here at display size once it is real.
            </p>
          )}
        </div>

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
      </div>
    </Container>
  );
}
