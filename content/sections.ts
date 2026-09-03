/* ============================================================================
   SECTIONS — the running order of the entire site, in two tiers.
   ============================================================================
   The old organisation was inherited from Adobe Portfolio: six categories by
   MEDIUM, sorted by year. That organises work by which tool made it, which is
   the one axis a hiring team does not care about, and it made the reader
   assemble the argument themselves.

   Two tiers now:

     TIER 1  "selected"  Three case studies. Full pages, full visual weight,
                         featured on the home page. Read in order.
     TIER 2  "archive"   One page, /archive. Five former categories become
                         anchored sections inside it. Image-led and dense. It
                         exists to prove range and craft, not to be read.

   NOTHING IS DATE-SORTED, anywhere, in either tier. `years` is a display
   label. To reorder the site: move a line in this array.

   COPY. Every `standfirst` is the section intro from portfolio-copy.md,
   verbatim. Nothing here is written, paraphrased or extended.
   ========================================================================= */

export type SectionKind = "case" | "gallery";
export type SectionTier = "selected" | "archive";

export type Section = {
  /** URL fragment, and the folder name under content/<kind>/. */
  id: string;
  title: string;
  /** Display-only. Never parsed, compared or sorted on. */
  years: string;
  kind: SectionKind;
  tier: SectionTier;
  /** Section intro, verbatim from portfolio-copy.md. */
  standfirst: string;
};

export const sections: Section[] = [
  /* ---- TIER 1 ---------------------------------------------------------- */
  {
    id: "ai-systems",
    title: "AI Systems & Development",
    years: "2025–26",
    kind: "case",
    tier: "selected",
    standfirst:
      "Products I designed and built end to end. Interface through infrastructure.",
  },

  /* ---- TIER 2 — the archive, in this order ----------------------------- */
  {
    id: "3d-graphics",
    title: "3D Graphics",
    years: "2025",
    kind: "gallery",
    tier: "archive",
    standfirst:
      "Product visualization and 3D work. Modeling, lighting, and render passes for commercial use.",
  },
  {
    id: "marketing",
    title: "Marketing",
    years: "2022",
    kind: "gallery",
    tier: "archive",
    standfirst:
      "Campaign work at American Scientific — animated product flyers, web banners, and social assets, produced at volume across hundreds of client accounts.",
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics",
    years: "2021",
    kind: "gallery",
    tier: "archive",
    standfirst:
      "Animation and motion work. Titles, product motion, and short-form pieces.",
  },
  {
    id: "print",
    title: "Print",
    years: "2021",
    kind: "gallery",
    tier: "archive",
    standfirst:
      "Catalog spreads and print layout. Long documents, tight grids, and the kind of typographic discipline that only shows up when it's missing.",
  },
  {
    id: "personal-works",
    title: "Personal Works",
    years: "2021",
    kind: "gallery",
    tier: "archive",
    standfirst:
      "Illustration and comics, mostly made for myself. One of them ended up on the front page of Reddit, which was not the plan.",
  },
];

export const sectionIds = sections.map((s) => s.id);
export type SectionId = (typeof sections)[number]["id"];

export function getSection(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}

/** The archive sections, in archive order. */
export const archiveSections = sections.filter((s) => s.tier === "archive");

/** Zero-padded ordinal WITHIN a tier — the archive numbers 01…05 on its own
 *  page rather than continuing a count the reader never saw. */
export function sectionOrdinal(id: string): string {
  const section = getSection(id);
  if (!section) return "--";
  const peers = sections.filter((s) => s.tier === section.tier);
  const i = peers.findIndex((s) => s.id === id);
  return i < 0 ? "--" : String(i + 1).padStart(2, "0");
}

/** Where a section's heading lives, for any link that points at one. */
export function sectionHref(id: string): string {
  const section = getSection(id);
  if (!section) return "/";
  return section.tier === "archive" ? `/archive#${id}` : `/#${id}`;
}
