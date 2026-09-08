/* ============================================================================
   DESIGN WORK, three bodies of work.
   ============================================================================
   Order is American Scientific, Taranto's, Personal Works. Manual, hardcoded.

   THE ORGANISING AXIS CHANGED. This used to be five categories by MEDIUM,
   Print, Marketing, 3D, Motion, Personal, which sorted the work by the tool
   used to make it. It is now sorted by WHO IT WAS FOR. A medium split answers
   "can he use After Effects"; a client split answers "what did he own, and for
   how long", which is the question the work is actually evidence for. Print,
   marketing, 3D and motion pieces made at American Scientific now sit in one
   place, as the single sustained body of work they were.

   NO DATES. Categories carry no year. A design archive stamped 2021 tells a
   reader the work is old before they have looked at it, which is the opposite
   of what an archive is for.

   COPY, and where each field comes from:

     intro         portfolio-copy.md → "GALLERY SECTIONS", verbatim.
     body          design-work-copy.md → the per-category copy.
     demonstrates  design-work-copy.md → the "What it demonstrates" line.

   The two client categories have EMPTY copy in all three fields, because no
   copy has been written for this grouping yet and nothing here is invented.
   Every field renders nothing when empty: those pages show their heading and
   their images and no gap where a sentence should be. Paste the copy in and
   the elements appear, with no other edit anywhere.

   Personal Works keeps its intro, which was already written for exactly this
   category and survives the reorganisation unchanged.
   ========================================================================= */

export type DesignCategory = {
  /** URL segment: /design/<slug>, and the image folder public/design/<slug>/ */
  slug: string;
  title: string;
  /** Verbatim from portfolio-copy.md. Empty renders nothing. */
  intro: string;
  /** Paragraphs, verbatim from design-work-copy.md. Empty renders nothing. */
  body: string[];
  /** The "What it demonstrates" line, verbatim. Empty renders nothing. */
  demonstrates: string;
};

export const designCategories: DesignCategory[] = [
  {
    slug: "american-scientific",
    title: "American Scientific",
    intro: "",
    body: [],
    demonstrates: "",
  },
  {
    slug: "tarantos",
    title: "Taranto's",
    intro: "",
    body: [],
    demonstrates: "",
  },
  {
    slug: "personal",
    title: "Personal Works",
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
 * heading and the three categories without it.
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
