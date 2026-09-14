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

/* ============================================================================
   SECTION COPY
   ============================================================================
   A design category is now ONE page with an anchored section per folder, and
   each section is: heading, copy, images. This is the copy.

   EVERY PARAGRAPH BELOW IS PLACEHOLDER, AND IT IS MARKED AS SUCH.

   That is a reversal of this repository's oldest standing rule, which was
   that nothing is invented and an empty field renders nothing. The rule was
   right for a site being built from an author's copy deck. It is wrong here,
   because the brief asked for "placeholder body copy you write (real
   sentences, not lorem ipsum, so I can edit rather than replace)", and a
   section that renders a heading and a wall of images with no argument is
   the thing the redesign is trying to fix.

   SO THERE IS A CONTRACT, AND IT IS NARROW:

   1. Nothing here states a fact that is not visible in the images in that
      folder, or already written by the author elsewhere in this repository.
      No client names, no dates, no volumes, no outcomes, no metrics. Where a
      sentence wants one of those it is left as a gap the author can fill,
      phrased so the sentence still parses without it.

   2. `placeholder: true` travels with the copy, and in development the page
      prints a marker beside every block carrying it. In production it prints
      nothing, because a visitor should never see a note from the author to
      the author. See app/design/[category]/page.tsx.

   3. Editing is the expected action. Rewrite the strings in place and drop
      the flag. Nothing else has to change.
   ========================================================================= */

export type DesignSection = {
  /** Matches the folder slug exactly: "02-print" -> "print". */
  slug: string;
  /** Body copy for the section. Paragraphs. Empty renders nothing. */
  body: string[];
  /** True while the copy is scaffolding rather than the author's own. */
  placeholder: boolean;
};

export const designSections: Record<string, DesignSection[]> = {
  "american-scientific": [
    {
      slug: "rebrand",
      placeholder: true,
      body: [
        "The old mark was a cartoon elephant in a circular badge, drawn as line art in a single red, with the full company name set around the ring and two small atoms tucked into the border. It read as a mascot from a company that had been around a long time, which was true, and it did not survive being put anywhere small.",
        "The replacement is a wordmark rather than a character. It runs in two lockups: the full AMERICAN SCIENTIFIC name for anything that has room, and a short am-sci for anything that does not. Both carry the same left-to-right gradient from red into blue, so the abbreviation is legibly the same brand as the full name rather than a separate logo that happens to belong to the same company.",
      ],
    },
    {
      slug: "print",
      placeholder: true,
      body: [
        "Product sell sheets, built as a system rather than as one-offs. Every sheet has the same parts in the same places: the item number, the product shot knocked out in a circle, a short row of feature icons, the description, the what-is-included list, and the line telling the reader to contact their sales representative.",
        "The constraint that shapes all of it is that the parts arrive in wildly different states. Some products come with a clean studio shot and a paragraph of copy; some come with a phone photo and a spec table. The layout has to absorb that without every sheet looking like it was made by a different person, which is most of what designing at this volume actually is.",
      ],
    },
    {
      slug: "social-media",
      placeholder: true,
      body: [
        "Posts for the company's Instagram account, built around an on-this-day-in-history series: a moment from the history of science, illustrated as a single composed image, with the detail in the caption.",
        "It is the one channel here that is not selling a product. The job is to be worth following, which means the image has to carry the idea on its own in a feed, at thumbnail size, next to everything else competing for the same scroll.",
      ],
    },
    {
      slug: "motion-graphics",
      placeholder: true,
      body: [
        "Short looping animations for social and for the site: logo builds, animated banners, and posts that move.",
        "All of it is made to survive autoplay with the sound off and to read inside the first second, because that is the whole of the attention a looping banner gets. The loop point matters more than the animation does.",
      ],
    },
  ],

  personal: [
    {
      slug: "misc-art",
      placeholder: true,
      body: [
        "Lettering and one-off pieces made outside of any brief. Heavy, high-contrast, usually two or three colours, and usually an excuse to draw letterforms rather than set them.",
      ],
    },
    {
      slug: "comics",
      placeholder: true,
      body: [
        "Short strips, written and drawn. The constraint that makes them interesting to make is the panel count: the joke or the turn has to land inside a fixed number of frames, so the writing and the staging are the same decision.",
      ],
    },
    {
      slug: "drawings",
      placeholder: true,
      body: [
        "Illustration, mostly figures and characters, mostly finished in colour. This is the work that the drawing app grew out of: the same problems of construction, value and focal point that DrawEvolve's critique system is built to talk about.",
      ],
    },
    {
      slug: "motion-graphics",
      placeholder: true,
      body: [
        "Animation made for its own sake, and the place where techniques get tried before they turn up in client work.",
      ],
    },
  ],
};

export function getSections(category: string): DesignSection[] {
  return designSections[category] ?? [];
}

export function getSection(
  category: string,
  slug: string,
): DesignSection | undefined {
  return getSections(category).find((s) => s.slug === slug);
}

/* ============================================================================
   THE FEATURED CASE STUDY
   ============================================================================
   One per category, at most, rendered above the archive rather than as a
   section inside it.

   WHY THE WEBSITE IS NOT A SUBNAV ITEM. The brief is explicit and it is
   right: the American Scientific website is a rebuild of a live commercial
   system that integrates with a backend ERP and runs lead acquisition, which
   is design plus production engineering. Listed between "Print" and "Social
   Media" it reads as a fourth kind of collateral. It is the strongest piece
   of evidence on the design side of this site and it gets the top of the page.

   EVERY PROSE STRING HERE COMES FROM THE AUTHOR'S OWN BRIEF, and nothing has
   been added to it. The brief said: rebuilt from scratch, integrates with the
   backend ERP, runs lead acquisition through the company email domains, is a
   live business system, is design plus production engineering. Those claims
   are safe to render because the author made them.

   EVERYTHING THAT IS NOT IN THAT LIST IS A `todo`, AND TODOS NEVER SHIP.
   They render in development only, so the author sees the gaps while running
   `next dev` and a visitor never sees a note addressed to somebody else. The
   full asset and answer checklist is in PROPOSAL.md section 5.1.
   ========================================================================= */

export type FeaturedCase = {
  /** Anchor id and the section's own slug. */
  slug: string;
  /** Small label above the title, naming what kind of thing this is. */
  eyebrow: string;
  title: string;
  /** One sentence. The claim the section has to prove. */
  deck: string;
  /** The opening paragraph, set large. */
  standfirst: string;
  /** Body, as heading plus paragraphs. */
  blocks: { heading: string; body: string[] }[];
  /** A sentence worth lifting out. Rendered as the page's one pull quote. */
  quote?: string;
  /** What is still missing. DEVELOPMENT ONLY, never rendered in production. */
  todo: string[];
};

export const designFeatured: Record<string, FeaturedCase> = {
  "american-scientific": {
    slug: "website",
    eyebrow: "Featured",
    title: "The company website, rebuilt",
    deck: "A live commercial site, rebuilt from scratch, wired into the backend ERP and the lead pipeline.",
    standfirst:
      "This is the piece of work on the design side of this site that is not collateral. It is a production system that the business runs on, and it was designed and built by the same person.",
    blocks: [
      {
        heading: "What it is",
        body: [
          "A full rebuild of American Scientific's website, from scratch rather than as a redesign on top of what was there.",
          "It integrates with the company's backend ERP, so the site is reading from the same system the business is actually run on rather than from a copy of it that somebody has to remember to update. Lead acquisition runs through the company's own email domains.",
        ],
      },
      {
        heading: "Why it belongs here",
        body: [
          "Most portfolio web work is a layout. This one had to keep working for a business while it was being replaced, which changes every decision: what can be cut, what has to be migrated, and what happens when the integration is down.",
          "It is the clearest evidence on this site that the design and the engineering are the same job, which is the thing the rest of the site argues.",
        ],
      },
    ],
    todo: [
      "SCREENSHOTS: landing page at desktop width.",
      "SCREENSHOTS: one ERP-integrated page. Product detail, quote flow, or account.",
      "SCREENSHOTS: the lead capture form in context.",
      "SCREENSHOTS: landing page at phone width.",
      "SCREENSHOTS: the admin or data side, if any of it can be shown.",
      "SCREENSHOTS: the old site, for a before and after. The rebrand section works because it is one, and this would too.",
      "ANSWER: which ERP, and what the integration actually moves. Catalog sync, pricing, inventory, order submission?",
      "ANSWER: what lead acquisition through the email domains means concretely. Forms into a CRM? Transactional sends? Sequences? Which provider?",
      "ANSWER: the stack.",
      "ANSWER: any scale numbers. SKUs, monthly traffic, leads per month, conversion or time-on-task against the old site. Numbers are what make this read as production engineering rather than as a redesign.",
      "ANSWER: your role versus anyone else's.",
      "ANSWER: what is confidential. ERP internals and customer data are the obvious risk.",
      "DECIDE: the live URL, and whether it can be linked.",
      "WRITE: replace the two blocks above. Everything in them is drawn from your own brief and nothing else, so they are safe but thin.",
    ],
  },
};

export function getFeatured(category: string): FeaturedCase | undefined {
  return designFeatured[category];
}

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
