/* ============================================================================
   SITE CONSTANTS
   ============================================================================
   Single source of truth for values used in metadata, the footer, the contact
   page, the sitemap and the OG images.

   Everything here that is prose comes from portfolio-copy.md, verbatim.

   Two fields are EMPTY STRINGS rather than invented copy: `availability` and
   `location`. The copy does not state either one, and nothing on this site
   claims anything about the person it belongs to that they did not write
   themselves. Empty is not a placeholder, every component that reads them
   (<Meta />) renders nothing at all for an empty value, so the rails simply
   omit those rows. Fill either one here and its row reappears everywhere it
   belongs, with no other edit. See DECISIONS.md.
   ========================================================================= */

export const site = {
  name: "Trevor Riggle",

  /** ASSUMPTION, confirm before deploy. See DECISIONS.md.
   *  Used for metadataBase, canonical URLs, the sitemap and OG image URLs. */
  domain: "trevorriggle.design",
  url: "https://trevorriggle.design",

  /** portfolio-copy.md → "Meta description (site)", verbatim. */
  description:
    "Trevor Riggle: graphic designer and self-taught developer building AI products. iOS, full-stack, and design work.",

  /** portfolio-copy.md → "Contact page", verbatim. */
  email: "trevorriggle@gmail.com",

  /** Supplied by the author. Shown on /about, /contact and the home rail.
   *
   *  ONE STRING, TWO PAGES. The rail on /about and the rail on /contact both
   *  read this, so the roles are stated once. The list is deliberately long:
   *  it is the answer to "what would you actually do here", and naming five
   *  disciplines is the point of it rather than a failure to choose. */
  availability:
    "Graphic Design, Motion design, UX/UI design, design engineering and AI product roles",

  /** Supplied by the author. */
  location: "Columbus, Ohio",

  /** External profiles. Absolute https URLs only, same rule the content
   *  schema enforces, for the same reason.
   *
   *  EMPTY, and deliberately left that way: no real profile URL has been
   *  supplied for this site, and a guessed GitHub or LinkedIn handle is a
   *  link that 404s in front of a hiring manager, the exact failure the
   *  link check exists to prevent. The footer "Elsewhere" block and the
   *  contact rail render nothing at all while this is empty, so there is no
   *  placeholder anywhere. Add a line here and both reappear. */
  social: [] as { label: string; href: string }[],
} as const;

/* Six tabs.

   This departs from portfolio-copy.md, which specifies three (Work, About,
   Contact) and argues for keeping it to three. The three-label version named
   only the software half of "designer who ships software", which argued
   against the site's own claim on every page.

   HOME IS FIRST, AND IT IS THE ONE TAB THAT DUPLICATES SOMETHING. The logo
   lockup at the left of the masthead has always linked to `/`, so the route
   was never unreachable. It was, however, only discoverable to someone who
   already expects a wordmark to be a home link, which is a convention and not
   an affordance: nothing about the mark announces it. An explicit label is
   what makes the way back legible to somebody who has clicked into a case
   study and wants out.

   It leads the list because the nav is ordered by depth — the root, then the
   three bodies of work, then the two pages about the person. Putting it last,
   beside Contact, would group it with the things it is not.

   "Applications" is the three shipped products. "Agentic AI" is its own
   section rather than a subsection of them, because the multi-agent build
   process is a separate competence from the products it produced.

   Applications points at /applications, a real route. It used to be the
   fragment /#applications, because the home page WAS the applications page.
   Home now shows the work rather than being the list of it, and every nav
   label resolves to its own page, so no tab scrolls you down someone else's.

   Agentic AI and About kept their tabs when the home page's four doors were
   deleted. A section that is not work belongs in the nav, not in the grid of
   work. */
export const nav = [
  { label: "Home", href: "/" },
  { label: "Applications", href: "/applications" },
  { label: "Design", href: "/design" },
  { label: "Agentic AI", href: "/agentic-ai" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
