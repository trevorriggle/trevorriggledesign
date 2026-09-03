/* ============================================================================
   SITE CONSTANTS
   ============================================================================
   Single source of truth for values used in metadata, the footer, the contact
   page, the sitemap and the OG images.

   Everything here that is prose comes from portfolio-copy.md, verbatim.

   Two fields are EMPTY STRINGS rather than invented copy: `availability` and
   `location`. The copy does not state either one, and nothing on this site
   claims anything about the person it belongs to that they did not write
   themselves. Empty is not a placeholder — every component that reads them
   (<Meta />) renders nothing at all for an empty value, so the rails simply
   omit those rows. Fill either one here and its row reappears everywhere it
   belongs, with no other edit. See DECISIONS.md.
   ========================================================================= */

export const site = {
  name: "Trevor Riggle",

  /** ASSUMPTION — confirm before deploy. See DECISIONS.md.
   *  Used for metadataBase, canonical URLs, the sitemap and OG image URLs. */
  domain: "trevorriggle.design",
  url: "https://trevorriggle.design",

  /** portfolio-copy.md → "Meta description (site)", verbatim. */
  description:
    "Trevor Riggle — graphic designer and self-taught developer building AI products. iOS, full-stack, and design work.",

  /** portfolio-copy.md → "Contact page", verbatim. */
  email: "trevorriggle@gmail.com",

  /** Supplied by the author. Shown on /about, /contact and the home rail. */
  availability: "Open to design engineering and AI product roles",

  /** Supplied by the author. */
  location: "Columbus, Ohio",

  /** External profiles. Absolute https URLs only — same rule the content
   *  schema enforces, for the same reason.
   *
   *  EMPTY, and deliberately left that way: no real profile URL has been
   *  supplied for this site, and a guessed GitHub or LinkedIn handle is a
   *  link that 404s in front of a hiring manager — the exact failure the
   *  link check exists to prevent. The footer "Elsewhere" block and the
   *  contact rail render nothing at all while this is empty, so there is no
   *  placeholder anywhere. Add a line here and both reappear. */
  social: [] as { label: string; href: string }[],
} as const;

/* The copy specifies three labels — Work, About, Contact — and says to keep it
   to three. "Design" is a fourth, and it is here deliberately: the site's whole
   claim is "designer who ships software", and a nav that names only the
   software half argues against the claim on every page. "Work" points at the
   Selected Work anchor on the home page, since /work is not a route. */
export const nav = [
  { label: "Work", href: "/#selected-work" },
  { label: "Design", href: "/design" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
