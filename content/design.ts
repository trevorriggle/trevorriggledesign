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
    /* WRITTEN FOR THIS SLOT. This category was the one row on /design with no
       description at all, so the largest body of work on the site introduced
       itself with a name and a picture. It names the five kinds of work the
       page actually contains, in the order the page runs them. */
    intro:
      "Four years of in-house design for a wholesale science supplier. The elephant mark reduced to one colour and one weight, a sell-sheet system that absorbs whatever state the product data arrives in, an on-this-day social series, looping banners, and the company's e-commerce site rebuilt from scratch.",
    body: [],
    demonstrates: "",
  },
  {
    slug: "tarantos",
    title: "Taranto's",
    intro:
      "A neighbourhood pizzeria, and the whole of its printed and posted output. A trifold menu dense enough to carry thirteen categories and still be read at a table, the seasonal promotions that run on top of it, and the alternate marks drawn for the places the main logo does not fit.",
    body: [],
    demonstrates: "",
  },
  {
    slug: "personal",
    title: "Personal Works",
    intro:
      "Illustration, comics and motion, made outside any brief. Figures finished in colour, short strips written and drawn to a fixed panel count, lettering as an excuse to draw letterforms rather than set them, and the 3D work where a technique gets tried before it reaches a client. One comic reached the front page of Reddit, which was not the plan.",
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
  /* The Solar Spectrum poster, framed on a classroom wall.

     This was the flyer mockup at 02-print/01.jpg, which is a legible "this is
     print work" frame and not much else: one sheet, one product, low contrast,
     and at 380px it reads as a pale rectangle at an angle. The spectrum poster
     wins the card on every axis that matters at that size. It is already
     almost exactly the card's ratio so the crop takes nothing; the spectrum
     band is the highest-contrast element in the whole archive and survives
     being 380px wide; and the classroom around it says who the work is for,
     which is the one thing a category card for this client should say. */
  "american-scientific": "02-print/03.jpg",
  /* The new lockup. The rebrand section leads with a real before/after device
     now rather than with one file that happened to contain both states, so
     this only has to be the best single frame of the work. */
  "american-scientific/rebrand": "02-after.png",
  "american-scientific/print": "01.jpg",
  /* Phone mockups with a post open. Reads as social at any size. */
  "american-scientific/social-media": "02.jpg",
  /* The logo build. Square, so it crops cleanly, and 6.7 MB rather than the
     55 MB and 33 MB clips beside it, which matters on a browsing page. */
  "american-scientific/motion-graphics": "02.gif",

  /* A card-only asset, the second one on the site. See the note under
     `personal` below for what `card.jpg` is and why it is not in the gallery.

     It replaces the menu trifold at 01-menu/01.jpg, which was 2400x1200: a 2:1
     spread, and the one picture on /design that could not be made the same
     size as the other two without losing a third of itself. The browse rows
     take a single 4:3 frame now, so the trifold was re-exported by hand at
     1920x1440 rather than centre-cropped to fit. The spread is still the first
     piece inside the menu section; this is the cover for the whole category. */
  tarantos: "card.jpg",
  "tarantos/menu": "01.jpg",
  "tarantos/marketing": "01.jpg",
  "tarantos/logo-variants": "01.jpg",

  /* THE ONLY CARD ON THIS SITE THAT IS NOT ALSO A PIECE IN THE ARCHIVE.
     `card.jpg` at a category root is a card-only asset: measured and pickable
     like anything else, filtered out of every gallery. See the note on
     CARD_FILE in lib/design-images.ts.

     It replaces the reaper at 03-drawings/01.jpg, which was a fine crop and
     the wrong register: the other two categories show their work in context,
     on a classroom wall and as a printed trifold, and this one showed a raw
     file on flat ground. This is the portrait from 03-drawings/05.jpg on an
     iPad on a desk, which says what Personal Works is in the same voice the
     other two cards use. 1448x1086 is exactly 4:3, so the card crops nothing. */
  personal: "card.jpg",
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

/* ============================================================================
   A BEFORE AND AN AFTER
   ============================================================================
   Declared as plain data here and mapped onto <Compare> at the render site.
   This file imports nothing and nothing imports a component into it, which is
   what keeps the content layer readable by somebody who is not going to open
   a .tsx file.

   `redact` masks a region of a shot that must not be published, as
   PERCENTAGES of the image box. Percentages rather than pixels because the
   frame is rendered at the image's own ratio at every width, so a panel
   pinned at 16% from the left covers the same content on a phone as on a
   desktop. See components/ui/Compare.tsx.
   ========================================================================= */

export type Redaction = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type CompareShot = {
  /** Filename inside the folder this comparison belongs to. */
  src: string;
  alt: string;
  /** Intrinsic dimensions, so the frame reserves its height before load. */
  width: number;
  height: number;
  /** One line under the frame. */
  caption?: string;
  redact?: Redaction[];
};

export type ComparePair = {
  label: string;
  before: CompareShot;
  after: CompareShot;
};

/* ============================================================================
   COMPOSED LAYOUT, for a section whose pictures are placed rather than flowed.
   ============================================================================
   <DesignGrid> derives every image's column span from its own proportion and
   its pixel width, automatically, and that is still the default and still what
   most sections want: it never crops, never upscales, and needs no decisions.

   IT CANNOT SAY "THESE TWO, ONE LINE, SAME HEIGHT, CENTRED." Which is what a
   composed section needs, and there was no way to express it short of
   hand-writing a grid per section. This is that vocabulary, and a section
   without it behaves exactly as it did before.

   A ROW IS A ROW OF THE TWELVE-COLUMN GRID. Cells carry a span; the spans in
   a row should sum to twelve, or less when the row is centred.

   A CELL IS ONE FILE, OR SEVERAL STACKED WITH NO GAP. The stack is what makes
   "Citrus Splash directly above the brain infographic, with the padding
   between them removed" expressible at all.

   `equal` IS THE HEIGHT RULE AND THE FIRST CELL SETS IT. Every other cell in
   the row fills that height and crops to it, which is how a poster ends up
   exactly as tall as the two pieces stacked beside it. It is done by layout
   rather than by arithmetic: the first cell sizes itself from its own files,
   the others are absolutely positioned inside it, so the heights are equal at
   every viewport width with no numbers written down anywhere.

   `ratio` OVERRIDES THAT with an explicit width-over-height for every cell in
   the row, for a row where no single file should decide the shape.

   ANY FILE NOT NAMED IN A ROW STILL RENDERS, in the automatic grid underneath.
   A layout that forgets a picture loses its placement, never the picture.
   ========================================================================= */

export type DesignLayoutCell = {
  /** Filenames, exactly as on disk. More than one stacks them, no gap. */
  files: string[];
  /** Columns of twelve. */
  span: number;
  /** `object-position` for this cell when it crops. Defaults to centre. */
  focus?: string;
};

export type DesignLayoutRow = {
  cells: DesignLayoutCell[];
  /** Centre the row when its spans do not fill all twelve columns. */
  center?: boolean;
  /** Every cell the same height, cropping to fill. The first cell sets it. */
  equal?: boolean;
  /** width / height for every cell in an `equal` row, overriding the first. */
  ratio?: number;
};

export type DesignSection = {
  /** Matches the folder slug exactly: "02-print" -> "print". */
  slug: string;
  /** Body copy for the section. Paragraphs. Empty renders nothing. */
  body: string[];
  /** True while the copy is scaffolding rather than the author's own. */
  placeholder: boolean;
  /**
   * An optional before/after, rendered above the section's copy.
   *
   * THE TWO FILES IT NAMES DROP OUT OF THE GALLERY BELOW. A section whose
   * argument is a comparison should not then print both halves of it again
   * as loose thumbnails; the page filters them by filename. Same idea as the
   * poster-claiming rule in lib/design-images.ts.
   */
  compare?: ComparePair;
  /**
   * Overrides the group title derived from the folder name.
   *
   * The folder is `03-logo-variants` and the redirect it generates is a
   * published URL, so the folder cannot be renamed without breaking it. This
   * changes what the page says without touching what the page is at.
   */
  title?: string;
  /** Placed layout. Absent means the automatic grid. See above. */
  layout?: DesignLayoutRow[];
};

export const designSections: Record<string, DesignSection[]> = {
  "american-scientific": [
    {
      slug: "rebrand",
      placeholder: false,
      compare: {
        label: "The American Scientific mark, before and after",
        before: {
          src: "01-before.png",
          width: 1366,
          height: 1228,
          alt: "The original American Scientific logo: a cartoon elephant's head in three-quarter view, drawn in grey with a heavy black outline, wearing a blue cap and holding a test tube in its raised trunk, set inside a red circular badge with AMERICAN arcing over the top and SCIENTIFIC around the bottom in white, and two small atom symbols in the ring",
          /* MATCHED PAIR. These two used to run to twenty-two and nineteen
             words in different shapes, so the eye read them as two separate
             notes rather than as one measurement taken twice. Same length,
             same construction, same order of terms: colour, weight, what
             surrounds the elephant. */
          caption:
            "Five colours, a heavy outline, and a badge ringed with type and atoms.",
        },
        after: {
          src: "02-after.png",
          width: 2400,
          height: 857,
          alt: "The rebranded system: at left the same elephant badge redrawn as a single-weight outline in one dark red with no fills, at right the am-sci shorthand set in a heavy lowercase with a left-to-right gradient running from red through violet into blue",
          caption:
            "One colour, one weight, and the am-sci shorthand it now travels with.",
        },
      },
      body: [
        "The original mark was overdesigned in a specific and datable way. A character illustration with a black keyline. A rendered gradient on the body, a prop in the trunk, a hard-edged badge behind it, and the full company name curved around the ring, with two atoms tucked into the border in case the test tube had not made the point. It belonged to the era of design that produced it, and it fell apart at small sizes, which by then was most of where it had to live.",
        "The obvious move was to kill it. That was not on the table. The founder was attached to the elephant, and the attachment had a reason behind it: the company had traded under that mark for a long time. A rebrand that opens by throwing away the one thing leadership cares about does not get approved.",
        "So the elephant stayed and everything around it was reduced. The mark is now a single-value line drawing in one colour. No fills. No keyline sitting separately from the art, no rendered gradient on the body, no second ring of type competing with the first. The ornament is still there, quiet enough now to read as texture. I adopted “am-sci” as the shorthand at the same time, which is what the company was already called out loud, and put the weight the old mark spent on ornament into one device: a gradient running red to blue across the letterforms.",
        "I built the full AMERICAN SCIENTIFIC wordmark as an alternative lockup, carrying the same gradient. Some applications want the whole name. Mostly, though, it let leadership see the new system next to the old one and read it as continuity. Showing only the abbreviation would have made the change look bigger than it is.",
        "The mark is not the interesting part of this project. Reducing an overdrawn logo is a known exercise, and any competent designer can do it. The constraint was the problem. Solve for a stakeholder’s real attachment to a specific piece of artwork, and do it without shipping something dated. Those two requirements pull against each other. The work was finding the version that satisfies both.",
      ],
    },
    {
      slug: "print",
      placeholder: true,
      /* 01 is the measuring-cylinder flyer and 03 is the Solar Spectrum
         poster on a classroom wall. They are the two single pieces in the
         section and they run as a matched pair: 1.52 against 1.40, close
         enough that levelling them costs about a four per cent crop.

         02 is the envelope-and-stirrer collage, centred at ten columns
         rather than the eight its proportion earned it.

         05 IS NOT LISTED BECAUSE IT NO LONGER EXISTS. The holiday-catalog
         collage was deleted from disk, by instruction. */
      layout: [
        {
          equal: true,
          cells: [
            { files: ["01.jpg"], span: 6 },
            { files: ["03.jpg"], span: 6 },
          ],
        },
        { center: true, cells: [{ files: ["02.jpg"], span: 10 }] },
        { cells: [{ files: ["04.jpg"], span: 12 }] },
      ],
      body: [
        "Product sell sheets, built as a system. Every sheet has the same parts in the same places: the item number, the product shot knocked out in a circle, a short row of feature icons, the description, the what-is-included list, and the line telling the reader to contact their sales representative.",
        "The parts arrive in wildly different states. Some products come with a clean studio shot and a paragraph of copy. Some come with a phone photo and a spec table. The layout has to absorb that without every sheet looking like a different person made it.",
      ],
    },
    {
      slug: "social-media",
      placeholder: true,
      /* The colour broadcast mockup takes its own line, centred and a step
         larger. The three square posts keep the size they had and move
         underneath it as one row of three rather than wrapping around it. */
      layout: [
        { center: true, cells: [{ files: ["02.jpg"], span: 8 }] },
        {
          cells: [
            { files: ["01.jpg"], span: 4 },
            { files: ["03.png"], span: 4 },
            { files: ["04.jpg"], span: 4 },
          ],
        },
      ],
      body: [
        "Posts for the company's Instagram account, built around an on-this-day-in-history series: a moment from the history of science, illustrated as a single composed image, with the detail in the caption.",
        "It is the one channel here that is not selling a product. The job is to be worth following. The image has to carry the idea on its own, at thumbnail size, in a feed.",
      ],
    },
    {
      slug: "motion-graphics",
      placeholder: true,
      body: [
        "Short looping animations for social and for the site: logo builds, animated banners, and posts that move.",
        "All of it has to survive autoplay with the sound off and read inside the first second, because that is the whole of the attention a looping banner gets. The loop point matters more than the animation.",
      ],
      /* The three squares come DOWN a step, from six columns each to four,
         which is what puts all three on one line across the full twelve
         instead of two-then-one. 02 is the elephant logo build and leads.

         The two long banners take a line each, centred, at ten columns
         rather than the eight their proportion earned them. */
      layout: [
        {
          cells: [
            { files: ["02.gif"], span: 4 },
            { files: ["01.gif"], span: 4 },
            { files: ["03.gif"], span: 4 },
          ],
        },
        { center: true, cells: [{ files: ["04.gif"], span: 10 }] },
        { center: true, cells: [{ files: ["05.gif"], span: 10 }] },
      ],
    },
  ],

  /* TARANTO'S IS NO LONGER A FLAT GALLERY. It was three loose files at the
     category root, which the template renders as a heading and a strip of
     pictures with no argument attached to them. The three pieces are not
     three pictures, they are three different jobs — the menu, the promotions
     that sit on top of it, and the marks — so they are three sections, and
     the folders on disk were regrouped to match. The page shape follows the
     disk, as it always has: group folders mean sections.

     THIS COPY IS THE AUTHOR'S, not scaffolding, so it carries no placeholder
     flag. It states what the author supplied — the menu was rebuilt from
     scratch, the marketing includes the Cinco de Mayo promotion, the variant
     marks were drawn for uses the primary logo could not serve — plus what
     is visible in the three files themselves, and nothing else. No dates, no
     volumes, no outcomes. */
  tarantos: [
    {
      slug: "menu",
      placeholder: false,
      /* One piece, centred. The section had a single image hanging off the
         left of a twelve-column page. */
      layout: [{ center: true, cells: [{ files: ["01.jpg"], span: 8 }] }],
      body: [
        "The menu, rebuilt from scratch. A trifold that has to carry subs, lunch combos, a kids' menu, take-and-bake, desserts, catering, build-your-own pizza at four sizes, specialty pizzas, entrees, appetizers, salads, soups and drinks, and still be readable by somebody holding it at a table.",
        "The hard part of a menu this dense is hierarchy. Every item wants to be a heading. The ones that earn it are the categories a customer is scanning for, and everything else drops a level. The cover panel carries the mark and the food photography and nothing else, so the piece opens as a brand and unfolds into a price list.",
      ],
    },
    {
      slug: "marketing",
      placeholder: false,
      /* One piece, centred. The section had a single image hanging off the
         left of a twelve-column page. */
      layout: [{ center: true, cells: [{ files: ["01.jpg"], span: 6 }] }],
      body: [
        "Promotional work that runs on top of the menu: in-store posters, seasonal and limited-time offers, and co-branded pieces where a partner's mark has to sit next to the restaurant's without either one losing.",
        "The Cinco de Mayo taco pizza promotion is the one that shows the constraint. It is a limited-time item with a date range, a co-brand, a product shot, an address block and a call to action, all on a single poster read from across a dining room. Everything on it competes for the same few seconds, so the decision that matters is what gets to be large. The offer won that, over the logo.",
      ],
    },
    {
      slug: "logo-variants",
      placeholder: false,
      /* "Logo variant", singular: there is one variant mark in this section
         and the plural was counting the folder rather than the work. The
         folder stays `03-logo-variants` because next.config.ts generates a
         published redirect from it. */
      title: "Logo variant",
      layout: [{ center: true, cells: [{ files: ["01.jpg"], span: 6 }] }],
      body: [
        "Alternate marks, drawn for the places the primary logo does not go. The main lockup is a full wordmark in a banner with a tagline under it, which is right on a menu cover and wrong on anything small, square, or aimed at children.",
        "The variants solve those cases one at a time: a single illustrated character mark, built from the same pizza and the same two brand colours, that reads at any size and in any orientation without the wordmark beside it. A variant that only works when the original is also present is a decoration.",
      ],
    },
  ],

  personal: [
    {
      slug: "misc-art",
      placeholder: true,
      /* ONE RECTANGLE, THREE PIECES. Citrus Splash sits directly on top of
         the brain infographic with no gap between them, and the Dracula
         poster runs down the right at the height of both plus the gap that
         is not there.

         The stack is one cell, which is the only way to say "no padding
         between these two" without removing it from the whole grid. Dracula
         is the second cell, so it takes the stack's height and crops to it:
         at 7/5 the poster's natural height comes out about 11% short, and
         `focus: top` spends that crop on the bottom edge so the title and
         the face stay whole. */
      layout: [
        {
          equal: true,
          cells: [
            { files: ["01.png", "03.jpg"], span: 7 },
            { files: ["02.jpg"], span: 5, focus: "50% 0%" },
          ],
        },
      ],
      body: [
        "Lettering and one-off pieces made outside of any brief. Heavy, high-contrast, usually two or three colours, and usually an excuse to draw letterforms rather than set them.",
      ],
    },
    {
      slug: "comics",
      placeholder: true,
      /* 02 is the three-panel strip and leads at full width. 01 is the
         four-panel strip and 03 is the page carrying five of them; they run
         as one centred pair at matched height, which is the point — the
         second holds more comics and is not therefore a bigger picture.

         04 is the Reddit front page. It is a 600px file, so four columns
         (403px) is as large as it goes before it is being upscaled, which is
         the one sizing mistake this grid refuses to make anywhere else. */
      layout: [
        { cells: [{ files: ["02.jpg"], span: 12 }] },
        {
          center: true,
          equal: true,
          cells: [
            { files: ["01.jpg"], span: 5 },
            { files: ["03.jpg"], span: 5 },
          ],
        },
        { center: true, cells: [{ files: ["04.jpg"], span: 4 }] },
      ],
      body: [
        "Short strips, written and drawn. The panel count is what makes them interesting to make. The joke has to land inside a fixed number of frames, so the writing and the staging are one decision.",
      ],
    },
    {
      slug: "drawings",
      placeholder: true,
      /* FIVE PIECES, TWO ROWS, THREE THEN TWO. The section ran 6/4/6/6/6
         across a twelve-column dense grid, which packed into four ragged
         rows with a different gap under every picture.

         Both rows are square frames rather than natural proportions: these
         five are a landscape scene, two near-squares, a square and a tall
         portrait, and nothing reads as even while each keeps its own shape.
         `ratio: 1` is what makes the row a row. The two portraits crop from
         the bottom so the faces survive it. */
      layout: [
        {
          equal: true,
          ratio: 1,
          cells: [
            { files: ["01.jpg"], span: 4 },
            { files: ["02.jpg"], span: 4, focus: "50% 0%" },
            { files: ["03.png"], span: 4 },
          ],
        },
        /* The second row takes NO `ratio`. Forced square at six columns it
           produced 623px boxes that dwarfed the row above and cut the top and
           bottom off both pieces. 04 is very nearly square already, so letting
           it set the height crops it not at all, and 05 gives up its bottom
           quarter — the signature, not the face. */
        {
          equal: true,
          cells: [
            { files: ["04.png"], span: 6 },
            { files: ["05.jpg"], span: 6, focus: "50% 0%" },
          ],
        },
      ],
      body: [
        "Illustration, mostly figures and characters, mostly finished in colour. This is the work that the drawing app grew out of: the same problems of construction, value and focal point that DrawEvolve's critique system is built to talk about.",
      ],
    },
    {
      slug: "motion-graphics",
      placeholder: true,
      /* The Similac render first and the map GIF beside it, at matched
         height. The render is 1920x1080 and sets the row; the GIF is 490x360
         and fills what is left, which at 7/5 is close enough to its own
         proportion that the crop is a few pixels off each side. */
      layout: [
        {
          equal: true,
          cells: [
            { files: ["02-similac-360-packaging-render.mp4"], span: 7 },
            { files: ["01.gif"], span: 5 },
          ],
        },
      ],
      body: [
        "Animation and 3D, and the place where techniques get tried before they turn up in client work. The Similac render is a packaging study: a real product, modelled and lit from scratch, for the practice rather than for a brief.",
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

   IT IS IN THE SUBNAV AND IT IS NOT AT THE TOP. BOTH OF THOSE REVERSED.

   This file used to argue the opposite at length: that listing the website
   between "Print" and "Social Media" would make a rebuild of a live commercial
   system read as a fourth kind of collateral, and that it therefore had to sit
   above the run with no entry in the index. That argument was about the wrong
   risk. A section long enough to need an index entry and missing from the
   index is not protected, it is unreachable: the one control for moving around
   the page silently refuses to admit the biggest thing on it.

   It sits after Rebrand instead, with its own entry, and it keeps every
   treatment that made it read as the feature in the first place. It is the
   only full-bleed colour band on the page, the only section with a deck, a
   table and a set of statistics, and the only one carrying scroll sequences.
   None of that is a function of its position. `after` names the group it
   follows and `nav` gives it its label, so the order is data rather than a
   branch in the template.

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

export type SpecRow = { label: string; was: string; now: string };
export type Stat = { figure: string; label: string; note?: string };

/**
 * One shot in a featured case's before/after run.
 *
 * SAME FIELDS AS A CompareShot PLUS A LABEL, because these render through
 * <ScrollSequence> rather than through <Compare>. The label is what the
 * component shows in place of a plate number: "01 / 02" is the wrong mark on
 * a two-shot comparison, where BEFORE and AFTER is the whole information.
 */
export type SequenceShot = CompareShot & { label: string };

export type Sequence = {
  /** The accessible name for the whole run. */
  label: string;
  shots: SequenceShot[];
};

export type FeaturedCase = {
  /** Anchor id and the section's own slug. */
  slug: string;
  /** The subnav label. Short, like a group's. */
  nav: string;
  /**
   * The group slug this section follows, or absent for the top of the page.
   *
   * IT IS A SECTION IN THE RUN NOW, NOT A PREAMBLE ABOVE IT. See the note on
   * the running order below.
   */
  after?: string;
  /** Small label above the title, naming what kind of thing this is. */
  eyebrow: string;
  title: string;
  /** One sentence. The claim the section has to prove. */
  deck: string;
  /** An opening paragraph, set large. Absent renders nothing. */
  standfirst?: string;
  /**
   * Before and after, as pinned scroll sequences, directly under the deck.
   *
   * HIGH ON THE PAGE, DELIBERATELY. The old site no longer exists anywhere,
   * so these screenshots are the only surviving evidence that it did, and a
   * rebuild case study that describes a predecessor nobody can see is asking
   * to be taken on trust. Files resolve against public/media/<dir>/.
   *
   * SEQUENCES RATHER THAN SIDE-BY-SIDE FRAMES. These are full-page desktop
   * grabs at roughly 2:1. Set two of those beside each other and each lands
   * at about 580px across, which is a picture of a website rather than a
   * website anybody can read, and what is written on the two pages is the
   * entire argument. See components/ui/ScrollSequence.
   */
  compareDir?: string;
  sequences?: Sequence[];
  /** Body, as heading plus paragraphs. */
  blocks: { heading: string; body: string[] }[];
  /** Old against new, one layer per row. */
  table?: { caption: string; rows: SpecRow[] };
  /** Counts the cutover actually moved. */
  numbers?: { label: string; heading: string; stats: Stat[] };
  /** What is still missing. DEVELOPMENT ONLY, never rendered in production. */
  todo: string[];
};

export const designFeatured: Record<string, FeaturedCase> = {
  "american-scientific": {
    slug: "website",
    nav: "Website",
    /* Directly after the rebrand, which is the section that establishes the
       mark this site was then built in. */
    after: "rebrand",
    eyebrow: "Featured",
    title: "The company website, rebuilt",
    deck: "A B2B wholesaler whose site was guessing at a number its ERP already knew exactly.",

    /* NO STANDFIRST. This section ran to about nine hundred words, longer than
       Rebrand, Print, Social Media and Motion Graphics combined, on a page
       about American Scientific as a whole. The cut went at the parts that
       restated each other: the standfirst was the pricing story told once
       before the prose told it again, the pull quote at the bottom was the
       deck above rephrased, and a closing "what is still not done" section
       added a fourth pass over the same ground. The deck states the claim, the
       screenshots show it, two blocks explain it, and the table carries the
       detail. */

    compareDir: "american-scientific",
    sequences: [
      {
        label: "The home page, before and after",
        shots: [
          {
            src: "01-home-before.jpg",
            label: "Before",
            width: 2560,
            height: 1315,
            alt: "The previous American Scientific home page: the old elephant badge above a site search field, a grey navigation bar, a carousel promoting an Understanding Coronavirus kit over a spread of lab equipment, and four flat colour tiles below it linking to protective equipment, sale items, a 2020 catalog and product videos",
            caption:
              "A carousel, four tiles, and a 2020 catalog link still on the page.",
          },
          {
            src: "02-home-after.jpg",
            label: "After",
            width: 2560,
            height: 1315,
            alt: "The rebuilt home page: a red-to-blue announcement bar carrying the wholesale notice and the office contact details, the am-sci mark, a dark hero reading Wholesale scientific supply, engineered for educators, with Browse Catalog and Request an Account actions, six category cards to the right each showing its subcategory count, and a row beneath reading Wholesale, 4 core disciplines, K-College, Tiered",
            caption:
              "Categories with live counts, and an account request as a first-class action.",
          },
        ],
      },
      {
        label: "The catalog, before and after",
        shots: [
          {
            src: "03-catalog-before.jpg",
            label: "Before",
            width: 2560,
            height: 1315,
            alt: "The previous Physics and Physical Science listing: a grey banner over a breadcrumb, a count reading 1-15 of 560, a plain text list of subcategories down the left, a Featured Products carousel of four items, and a product below it whose image has failed to load and renders as a broken-image placeholder",
            caption:
              "The same category on the old site. A featured-products carousel, a plain list of subcategories, and an image that had stopped loading.",
          },
          /* NO REDACTIONS ON THIS ONE, and that is a property of the shot
             rather than a decision. The grab it replaced was taken signed in
             as an admin, so it carried an account name in the masthead and a
             row of account-resolved prices, both of which had to be masked.
             This one is signed out: every price reads "Sign in for price" and
             there is nothing on the page that belongs to anybody. A shot with
             nothing to hide is better evidence than a shot with panels over
             it, because a reader cannot tell what is under a panel. */
          {
            src: "04-catalog-after.jpg",
            label: "After",
            width: 2560,
            height: 1315,
            alt: "The rebuilt Physics and Physical Science category, signed out: a header showing 303 products beside a Sign in for your account pricing prompt, a row of subcategory filters each carrying its own count with Light and Sound Waves active, a line reading Showing 78 of 303 products, and a grid of product cards with images, category tags, option counts and a Sign in for price link where the figure would be",
            caption:
              "Physics and Physical Science, with a real count on every subcategory and one of them applied. Price sits behind sign-in, because price depends on the account.",
          },
        ],
      },
    ],

    blocks: [
      /* RESTORED. This block was cut in the first pass on a misread of the
         brief, which asked for the section to come down "potentially by half"
         and not for this argument to go. It is the reason the rebuild
         happened, so the section does not work without it. The standfirst
         that used to sit above it stays deleted: it was a compressed
         duplicate of these three paragraphs, which is why the brief named
         that copy and not this. */
      {
        heading: "The number nobody could produce",
        body: [
          "American Scientific is a wholesale distributor. Almost nobody pays list. What an account pays depends on its price level and on the quantity on the line, and NetSuite, the ERP the business is run on, holds all of that exactly.",
          "The old site synced a base price out of NetSuite and threw the rest away. A pair of custom SOAP plugins pulled the matrix down. A WordPress plugin then re-derived each customer’s tier from their WordPress user role and applied a discount to the base figure. The role stood in for the price level, maintained by hand, in a second system, with nothing reconciling the two.",
          "So the price a customer saw was a WordPress plugin’s reconstruction of a number that already existed, correct and authoritative, one API call away. A site that cannot state a price is a catalog with a phone number on it, and the ordering happens somewhere else.",
        ],
      },
      {
        heading: "What was actually running",
        body: [
          "Thirty-plus plugins, all depending on each other. The catalog, the faceting, the pricing and the ERP integration each belonged to a different one, so upgrading any of them meant first finding out what the other twenty-nine would do about it. None of them were upgraded.",
          "The catalog ran off a NetSuite saved search called DO NOT DELETE. Nobody still at the company knew what was in it or who had built it. They knew the catalog stopped working without it.",
          "By the end the backend data had stopped reaching the customer. Most of the product images no longer resolved and the sync meant to keep the listings current had quietly failed. Nothing alerted. It degraded until somebody noticed.",
        ],
      },
      {
        heading: "What replaced it",
        body: [
          "A Next.js application on Cloudflare Workers through OpenNext, with D1 as the catalog store. A second Worker owns the NetSuite integration and exposes it over an internal boundary. Nothing that touches the ERP runs in the same process as a page render.",
          "The site now asks NetSuite for the price level on the account and resolves the real figure for the quantity requested. The WordPress user role does not exist in the new system.",
          "The catalog is one SQL query, in version control. Somebody who was not there when it was written can read it and change it in a diff.",
        ],
      },
    ],

    table: {
      caption:
        "The same five layers, before and after. Everything in the right-hand column is running now.",
      rows: [
        {
          label: "Stack",
          was: "WordPress + WooCommerce + FacetWP + a custom SOAP plugin pair, inside 30+ interdependent plugins",
          now: "Next.js on Cloudflare Workers (OpenNext) with D1, and a second Worker owning NetSuite",
        },
        {
          label: "Pricing",
          was: "Base price synced out of NetSuite, tiers re-derived from WordPress user roles",
          now: "The real NetSuite price level, resolved per account against the quantity on the line",
        },
        {
          label: "Catalog",
          was: "A NetSuite saved search named DO NOT DELETE that nobody could explain",
          now: "One SQL query, in version control, readable in a diff",
        },
        {
          label: "Credentials",
          was: "NetSuite token-based auth keys hardcoded in PHP",
          now: "Wrangler secrets, out of the source tree entirely",
        },
        {
          label: "API auth",
          was: "REST endpoints registered with no permission_callback",
          now: "Gated. Guests get a 401 on anything that resolves a price",
        },
      ],
    },

    numbers: {
      label: "Cutover",
      heading: "The cutover",
      stats: [
        { figure: "2,013", label: "Accounts migrated" },
        { figure: "2,371", label: "Redirects mapped" },
        {
          figure: "41",
          label: "Carts recovered",
          note: "across 100 line items, carried over from the old store",
        },
      ],
    },

    todo: [
      "ANSWER: how long the rebuild took, and over what period it ran.",
      "ANSWER: your role versus anyone else's on it.",
      "DECIDE: whether the live URL can be linked from here.",
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
