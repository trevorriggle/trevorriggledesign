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
    intro:
      "A neighbourhood pizzeria, and the whole of its printed and posted output: the menu, the promotions that run on top of it, and the marks that go where the main logo does not fit.",
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

  /* The menu trifold. Centre of the spread is the branded cover panel, which
     is exactly what a landscape crop keeps. The path gained a folder when
     Taranto's stopped being a flat gallery and became three sections. */
  tarantos: "01-menu/01.jpg",
  "tarantos/menu": "01.jpg",
  "tarantos/marketing": "01.jpg",
  "tarantos/logo-variants": "01.jpg",

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
          caption:
            "Five colours, a heavy outline, a character, a badge, a ring of type and two atoms. Every element is doing something.",
        },
        after: {
          src: "02-after.png",
          width: 2400,
          height: 857,
          alt: "The rebranded system: at left the same elephant badge redrawn as a single-weight outline in one dark red with no fills, at right the am-sci shorthand set in a heavy lowercase with a left-to-right gradient running from red through violet into blue",
          caption:
            "The same elephant, reduced to one value and one colour, beside the am-sci shorthand it now travels with.",
        },
      },
      body: [
        "The original mark was overdesigned, and it was overdesigned in a specific and datable way: a character illustration with a black keyline, a rendered gradient on the body, a prop in the trunk, a hard-edged badge behind it and the full company name curved around the ring, with two atoms tucked into the border in case the test tube had not made the point. It belonged to the era of design that produced it. It also did not survive being made small, which by then was most of where it had to live.",
        "The obvious move was to kill it. That was not on the table. The founder was attached to the elephant, and the attachment was not vanity — it was a mark the company had traded under for a long time, and the person who had built the company was not wrong to want it to survive. A rebrand that opens by throwing it away is a rebrand that does not get approved, and an unapproved rebrand is not work, it is a deck.",
        "So the elephant stayed and everything around it was reduced. The mark is now a single-value line drawing in one colour: no fills, no keyline sitting separately from the art, no rendered gradient on the body, and no second ring of type competing with the first. The ornament is still present but it is de-emphasised to the point where it reads as texture rather than as content. At the same time I adopted “am-sci” as the shorthand, which is what the company was already called out loud, and put the emphasis the old mark spent on ornament into a single modern device instead: a gradient running red to blue across the letterforms.",
        "I also built the full AMERICAN SCIENTIFIC wordmark as an alternative lockup, carrying the same gradient. Partly that is a practical need — some applications want the whole name — but mostly it was so leadership could see the new system next to the old name and read it as continuity rather than as a break. Showing only the abbreviation would have made the change look like a bigger departure than it is.",
        "The mark is not the interesting part of this project. Reducing an overdrawn logo is a known exercise and any competent designer can do it. The actual problem was constraint-driven: solve for a stakeholder’s genuine attachment to a specific piece of artwork, and do it without shipping something dated. Those two requirements pull directly against each other, and the work was finding the version where both are satisfied rather than the version where one of them quietly loses.",
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
      body: [
        "The menu, rebuilt from scratch rather than reset. A trifold that has to carry subs, lunch combos, a kids' menu, take-and-bake, desserts, catering, build-your-own pizza at four sizes, specialty pizzas, entrees, appetizers, salads, soups and drinks, and still be readable by somebody holding it at a table.",
        "The hard part of a menu this dense is not the layout, it is the hierarchy: every item wants to be a heading, and the ones that actually earn it are the categories a customer is scanning for. Everything else drops a level. The cover panel carries the mark and the food photography and nothing else, so the piece opens as a brand and unfolds into a price list.",
      ],
    },
    {
      slug: "marketing",
      placeholder: false,
      body: [
        "Promotional work that runs on top of the menu rather than beside it: in-store posters, seasonal and limited-time offers, and co-branded pieces where a partner's mark has to sit next to the restaurant's without either one losing.",
        "The Cinco de Mayo taco pizza promotion is the one that shows the constraint. It is a limited-time item with a date range, a co-brand, a product shot, an address block and a call to action, all on a single poster read from across a dining room. Everything on it is competing for the same few seconds, so the decision that matters is what gets to be large — and it is the offer, not the logo.",
      ],
    },
    {
      slug: "logo-variants",
      placeholder: false,
      body: [
        "Alternate marks, drawn for the places the primary logo does not go. The main lockup is a full wordmark in a banner with a tagline under it, which is right on a menu cover and wrong on anything small, square, or aimed at children.",
        "The variants solve those cases specifically rather than generally: a single illustrated character mark, built from the same pizza and the same two brand colours, that reads at any size and in any orientation and does not need the wordmark next to it to be recognisable. A variant that only works when the original is also present is not a variant, it is a decoration.",
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

export type SpecRow = { label: string; was: string; now: string };
export type Stat = { figure: string; label: string; note?: string };

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
  /**
   * Before and after, rendered directly under the standfirst.
   *
   * HIGH ON THE PAGE, DELIBERATELY. The old site no longer exists anywhere,
   * so these screenshots are the only surviving evidence that it did, and a
   * rebuild case study that describes a predecessor nobody can see is asking
   * to be taken on trust. Files resolve against public/media/<dir>/.
   */
  compareDir?: string;
  compare?: ComparePair[];
  /** Body, as heading plus paragraphs. */
  blocks: { heading: string; body: string[] }[];
  /** Old against new, one layer per row. */
  table?: { caption: string; rows: SpecRow[] };
  /** Counts the cutover actually moved. */
  numbers?: { label: string; heading: string; stats: Stat[] };
  /**
   * What is still not done.
   *
   * THIS IS A RENDERED SECTION, NOT A `todo`. It ships. A case study that
   * lists only what works is a brochure, and the Lynk entry already set the
   * precedent on this site that the honest gap is part of the argument
   * rather than an admission to be kept off the page.
   */
  gap?: { heading: string; body: string[] };
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
    deck: "A B2B wholesaler whose site was guessing at a number its ERP already knew exactly.",
    standfirst:
      "The old stack pulled NetSuite’s full price matrix on a schedule, discarded almost all of it, and then had a WordPress plugin re-approximate each customer’s negotiated price from their user role. Every other problem on the site was downstream of that one.",

    compareDir: "american-scientific",
    compare: [
      {
        label: "The home page, before and after",
        before: {
          src: "01-before-home.png",
          width: 2543,
          height: 1214,
          alt: "The previous American Scientific home page: the old elephant badge above a search field, a blue navigation bar, a carousel promoting a stream table kit with a paragraph of copy over a product photograph, and four flat colour tiles below it linking to protective equipment, sale items, a 2020 catalog and product videos",
          caption:
            "A carousel, four tiles, and a 2020 catalog link still on the page.",
        },
        after: {
          src: "03-after-home.png",
          width: 2541,
          height: 1310,
          alt: "The rebuilt home page: a gradient announcement bar, the am-sci mark, a dark hero reading Wholesale scientific supply, engineered for educators, with Browse Catalog and Request an Account actions, and six category cards to the right showing subcategory counts",
          caption:
            "Categories with live counts, and an account request as a first-class action.",
          redact: [{ left: 75, top: 5.5, width: 7.5, height: 4 }],
        },
      },
      {
        label: "The catalog, before and after",
        before: {
          src: "02-before-catalog.png",
          width: 2528,
          height: 1242,
          alt: "The previous All Products listing: a grey banner, a nearly empty category sidebar offering a single Laboratory checkbox, a count reading 1-15 of 1308, and a grid in which most product images have failed to load and render as broken-image placeholders",
          caption:
            "1,308 products, one filter, and most of the product images no longer loading.",
        },
        after: {
          src: "04-after-catalog.png",
          width: 2536,
          height: 1314,
          alt: "The rebuilt Physics and Physical Science category: a titled header showing 303 products, a row of subcategory filters each carrying its own count, and a grid of product cards with images, category tags, option counts, SKUs and prices",
          caption:
            "The same catalog, filtered by real subcategory counts. Prices and the signed-in account are masked here; they resolve per account.",
          redact: [
            { left: 69.5, top: 4.5, width: 7.5, height: 4.5 },
            { left: 16, top: 89, width: 59, height: 6 },
          ],
        },
      },
    ],

    blocks: [
      {
        heading: "The number nobody could produce",
        body: [
          "American Scientific is a wholesale distributor. Almost nobody pays list: price depends on which price level an account sits at and how many units are on the line, and NetSuite, the ERP the business is actually run on, holds all of that exactly.",
          "The old site synced a base price out of NetSuite and threw the rest away. A pair of custom SOAP plugins pulled the matrix down; a WordPress plugin then re-derived each customer’s tier from their WordPress user role and applied a discount to the base figure. The role was a proxy for the price level, maintained by hand, in a second system, with nothing reconciling the two. So the price a customer saw was a WordPress plugin’s reconstruction of a number that existed, correct and authoritative, one API call away.",
          "That is the whole case in one sentence, and everything else follows from it: if the site cannot be trusted to state a price, then it is a catalog with a phone number on it, and the ordering has to happen somewhere else.",
        ],
      },
      {
        heading: "What was actually running",
        body: [
          "Thirty-plus plugins, interdependent, with the catalog, the faceting, the pricing and the ERP integration each owned by a different one. Upgrading any of them meant establishing first what the other twenty-nine would do about it, which in practice meant none of them were upgraded.",
          "The product catalog was driven by a NetSuite saved search named DO NOT DELETE. Nobody currently at the company could explain what was in it, who had built it, or what its criteria were — only that the catalog stopped working without it. That is not an unusual artefact in a system of this age, and it is a precise measure of how much of the business logic had leaked out of anywhere it could be read.",
          "By the end the backend data had stopped reaching the customer at all. The product grid in the screenshot above is the live site: most of the images had stopped resolving, and the sync that was supposed to be keeping the listings current had quietly failed. Nothing alerted; it simply degraded until somebody noticed.",
        ],
      },
      {
        heading: "What replaced it",
        body: [
          "A Next.js application running on Cloudflare Workers through OpenNext, with D1 as the catalog store, and a second Worker that owns the NetSuite integration on its own and exposes it to the first over an internal boundary. Nothing that touches the ERP lives in the same process as the thing rendering a page.",
          "Pricing is no longer derived from anything. The site asks NetSuite for the price level on the account and resolves the real figure for the quantity requested. The WordPress user role, and the entire concept of inferring a customer’s tier from their login, is gone rather than reimplemented.",
          "The catalog is one SQL query in version control. It can be read, reviewed, changed with a diff, and explained to somebody who was not there when it was written — which is the actual replacement for DO NOT DELETE, and it is worth more than the performance of it.",
        ],
      },
    ],

    table: {
      caption:
        "The same five layers, before and after. Nothing in the right-hand column is planned work; all of it is running.",
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

    gap: {
      heading: "What is still not done",
      body: [
        "Order write-back to NetSuite has not shipped. A customer can browse the real catalog at their own real price and build a real cart, and then a sales rep keys the resulting order into the ERP by hand, exactly as they did before.",
        "That is the largest remaining piece of work and it is the one that would close the loop, so it is worth being precise about what the rebuild has and has not achieved: reading out of the ERP is solved, writing back into it is not.",
      ],
    },

    quote:
      "A wholesaler’s site was guessing at a number its own ERP already knew exactly.",

    todo: [
      "ANSWER: how long the rebuild took, and over what period it ran.",
      "ANSWER: your role versus anyone else’s on it.",
      "DECIDE: whether the live URL can be linked from here.",
      "CHECK: the masked regions on the two after shots. If those are public list prices rather than account-resolved ones, delete the `redact` arrays and the masks come off.",
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
