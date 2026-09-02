/* ============================================================================
   SITE CONSTANTS
   ============================================================================
   Single source of truth for values used in metadata, the footer, the contact
   page, the sitemap and the OG images.

   Every string marked TODO is deliberately unwritten. Nothing on this site
   claims anything about the person it belongs to that they did not write
   themselves — a plausible-sounding invented bio is worse than an empty one,
   because it has to be defended in an interview.
   ========================================================================= */

export const site = {
  /** Real, and safe to fill: it is the repository author's own name. */
  name: "Trevor Riggle",

  /** ASSUMPTION — confirm before deploy. See DECISIONS.md.
   *  Used for metadataBase, canonical URLs, the sitemap and OG image URLs. */
  domain: "trevorriggle.design",
  url: "https://trevorriggle.design",

  /** TODO: one line, under ~160 characters. Used for <meta description> and as
   *  the OG description on every page that does not override it. */
  description: "TODO",

  /** TODO: the address you want in front of hiring teams. */
  email: "TODO",

  /** TODO: what you are looking for. Shown on /contact and /about. */
  availability: "TODO",

  /** TODO: city, or remote + timezone. */
  location: "TODO",

  /** External profiles. Absolute https URLs only — same rule the content
   *  schema enforces, for the same reason. Uncomment and fill. */
  social: [
    // { label: "GitHub", href: "https://github.com/TODO" },
    // { label: "LinkedIn", href: "https://www.linkedin.com/in/TODO" },
    // { label: "Read.cv", href: "https://read.cv/TODO" },
  ] as { label: string; href: string }[],
} as const;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
