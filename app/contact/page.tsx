import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/ui/ContactForm";
import { site } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: site.description,
  alternates: { canonical: "/contact" },
};

/* ============================================================================
   CONTACT
   ============================================================================
   Copy: portfolio-copy.md, "Contact page". The heading, both sentences and
   the address are verbatim.

   THE FORM IS PRIMARY AND THE ADDRESS IS SECONDARY, AND BOTH ARE ON SCREEN.
   The page used to be a heading, two sentences and a mailto link set at title
   scale. That is a fine contact page for someone who is already sold; it is a
   worse one for a hiring manager on a phone between meetings, for whom
   "open my mail client, compose, find the address" is three steps with three
   places to abandon.

   The address did not shrink into a footnote to make room. It is still set
   large and it is still the first thing under the copy, because plenty of
   people would rather write from their own client, where they have their
   signature and a record of having sent it. A form that hides the address is
   optimising for the owner's inbox over the sender's habits.

   THE FORM IS THE ONLY CLIENT COMPONENT ON THIS PAGE. The heading, the copy
   and the address are all server-rendered, so the contact route's content
   does not depend on hydration: if the JS never arrives, the address is still
   there, still set at title scale, still a working mailto.
   ========================================================================= */

export default function ContactPage() {
  return (
    <Container className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <h1 className={styles.title}>Get in touch</h1>

          <p className={styles.lead}>
            I&rsquo;m looking for design engineering and AI product roles. Happy
            to talk about anything on this site in as much detail as you want.
          </p>

          {/* THE ADDRESS, and it is a plain <a>, not <ExternalLink>. That
              component appends a mark after the label, which on a mailto was
              a blue "@" printed after an address that already contains one.
              An email address announces itself. */}
          <p className={styles.address}>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>

          <div className={styles.formBlock}>
            <h2 className={styles.formHeading}>Or send this</h2>
            <ContactForm email={site.email} />
          </div>
        </div>

        {/* NO RAIL. It carried Based / Columbus, Ohio and Looking for / the
            roles, in a ruled column beside the address. Removed entirely, by
            instruction. Both facts are still on the site: the location is in
            the footer sign-off on every page and the roles are the first
            sentence of this page. A rail that repeats what is already two
            inches to its left is furniture. /about keeps its own rail. */}
      </div>
    </Container>
  );
}
