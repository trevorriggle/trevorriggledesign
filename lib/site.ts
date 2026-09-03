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

  /** No copy states this. Empty renders nothing; it is not a placeholder. */
  availability: "",

  /** No copy states this. Empty renders nothing; it is not a placeholder. */
  location: "",

  /** External profiles. Absolute https URLs only — same rule the content
   *  schema enforces, for the same reason. The copy names none, so this is
   *  empty and the "Elsewhere" blocks render nothing rather than a prompt. */
  social: [] as { label: string; href: string }[],
} as const;

/* Three labels, exactly as the copy specifies. "Work" points at the Selected
   Work anchor on the home page, because /work no longer exists as a route —
   the two-tier structure put the work itself on the home page and everything
   else on /archive. The archive is reachable from the home page and the
   footer, which keeps every piece of work within two clicks of the home
   page without adding a fourth nav label the copy does not have. */
export const nav = [
  { label: "Work", href: "/#selected-work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
