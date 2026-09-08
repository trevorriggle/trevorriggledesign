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

/* ============================================================================
   THUMBNAILS, the one place a card's picture is chosen.
   ============================================================================
   Keyed by "<category>" for a category card and "<category>/<group>" for a
   group card. The value is a path inside that folder.

   WHY THIS EXISTS. Without it a card shows the first file in the folder, and
   the first file is whatever sorted first, not the strongest piece. Every
   entry below was picked by looking at the images: a card has to read at
   roughly 380x285, so a wide banner cropped to a landscape card loses its
   ends, a dense infographic turns into texture, and a tall poster keeps only
   a band out of its middle. What survives that crop is a single subject with
   contrast, or a mockup shot at an angle.

   To override one, change the path. Nothing else needs editing, and a path
   that matches no file on disk falls back to the first item rather than
   blanking the card.
   ========================================================================= */

export const designThumbs: Record<string, string> = {
  /* The flyer mockup. The most legible "this is print work" frame in the
     archive, and it survives the card crop because the piece is shot at an
     angle against flat ground. */
  "american-scientific": "02-print/01.jpg",
  /* Old elephant seal beside the new am-sci wordmark: the rebrand IS the
     before and after, so the only frame that shows the work is this one. */
  "american-scientific/rebrand": "01.png",
  "american-scientific/print": "01.jpg",
  /* Phone mockups with a post open. Reads as social at any size. */
  "american-scientific/social-media": "02.jpg",
  /* The logo build. Square, so it crops cleanly, and 6.7 MB rather than the
     55 MB and 33 MB clips beside it, which matters on a browsing page. */
  "american-scientific/motion-graphics": "02.gif",

  /* The menu trifold. Centre of the spread is the branded cover panel, which
     is exactly what a landscape crop keeps. */
  tarantos: "02.jpg",

  /* The reaper. 1920x1440 is already the card's ratio, and it is one
     high-contrast subject rather than a page of small marks. */
  personal: "03-drawings/01.jpg",
  /* Citrus Splash lettering: heavy, two colours, legible at any size. */
  "personal/misc-art": "01.png",
  "personal/comics": "03.jpg",
  "personal/drawings": "01.jpg",
  "personal/motion-graphics": "01.gif",
};

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
