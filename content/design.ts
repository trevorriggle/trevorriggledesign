/* ============================================================================
   DESIGN WORK, the five categories.
   ============================================================================
   Order is Print, Marketing, 3D, Motion, Personal. Manual, and never sorted by
   the `years` label, which is display-only.

   COPY, and where each field comes from:

     intro         portfolio-copy.md → "GALLERY SECTIONS", verbatim.
     body          design-work-copy.md → the per-category copy.
     demonstrates  design-work-copy.md → the "What it demonstrates" line.

   `body` and `demonstrates` are EMPTY because design-work-copy.md is not in
   the repository, see DECISIONS.md. Nothing is invented to fill them and
   nothing renders in their place: the category pages show their heading, their
   intro and their images. Paste the copy into the two fields and both elements
   appear, with no other edit anywhere.
   ========================================================================= */

export type DesignCategory = {
  /** URL segment: /design/<slug>, and the image folder public/design/<slug>/ */
  slug: string;
  title: string;
  /** Display-only. Never a sort key. */
  years: string;
  /** Verbatim from portfolio-copy.md. */
  intro: string;
  /** Paragraphs, verbatim from design-work-copy.md. Empty renders nothing. */
  body: string[];
  /** The "What it demonstrates" line, verbatim. Empty renders nothing. */
  demonstrates: string;
};

export const designCategories: DesignCategory[] = [
  {
    slug: "print",
    title: "Print",
    years: "2021",
    intro:
      "Catalog spreads and print layout. Long documents, tight grids, and the kind of typographic discipline that only shows up when it's missing.",
    body: [],
    demonstrates: "",
  },
  {
    slug: "marketing",
    title: "Marketing",
    years: "2022",
    intro:
      "Campaign work at American Scientific: animated product flyers, web banners, and social assets, produced at volume across hundreds of client accounts.",
    body: [],
    demonstrates: "",
  },
  {
    slug: "3d",
    title: "3D Graphics",
    years: "2025",
    intro:
      "Product visualization and 3D work. Modeling, lighting, and render passes for commercial use.",
    body: [],
    demonstrates: "",
  },
  {
    slug: "motion",
    title: "Motion Graphics",
    years: "2021",
    intro:
      "Animation and motion work. Titles, product motion, and short-form pieces.",
    body: [],
    demonstrates: "",
  },
  {
    slug: "personal",
    title: "Personal Works",
    years: "2021",
    intro:
      "Illustration and comics, mostly made for myself. One of them ended up on the front page of Reddit, which was not the plan.",
    body: [],
    demonstrates: "",
  },
];

/**
 * The /design landing copy, from design-work-copy.md → "section landing copy".
 *
 * Empty for the same reason as the fields above. The landing page renders its
 * heading and the five categories without it.
 */
export const designLanding: { body: string[] } = { body: [] };

export function getCategory(slug: string): DesignCategory | undefined {
  return designCategories.find((c) => c.slug === slug);
}

export function categoryNeighbours(slug: string) {
  const i = designCategories.findIndex((c) => c.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: designCategories[i - 1] ?? null,
    next: designCategories[i + 1] ?? null,
  };
}
