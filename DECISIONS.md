# Decisions

What I chose, and why. Anything I resolved without you is in
[Assumptions](#assumptions-i-made-confirm-these) at the bottom, those are the
lines to read first.

---

## AMENDED, 2026-09-14: the editorial redesign

A redesign brief supersedes parts of this document. It is being built in
phases on `redesign/editorial`, and this note exists so that nobody reads a
section below and believes something the code stopped doing.

**Superseded by Phase 1 (foundation).** Read these sections as history:

| Section | What it says | What is true now |
| --- | --- | --- |
| [Colour](#colour) | One ink, one ground, one rationed accent on a cool neutral. | Five colours on a warm Paper ground. Ultramarine is dominant and used as full-bleed bands. Ochre and Flare are rationed. Colour is a GROUND, set by `data-ground`, and each ground declares what text colour is legal on it. |
| [Type](#type) | Archivo at 700, narrow, scale pointed one step down. | Archivo at 900. Every display role went back UP one step: the statement reaches 129px again. Instrument Serif is a fourth family, rationed to pull quotes and section intros. |
| [The steps are unchanged. The headings came down one.](#the-steps-are-unchanged-the-headings-came-down-one) | The whole of it. | Reversed. The vw coefficients were multiplied by 1.5 to match, so each role reaches its ceiling at the same viewport it did before. |
| [Space and composition](#space-and-composition) | Rhythms up to 256px. | Every rhythm came down by roughly half. Ceilings are 36 / 56 / 120 where they were 56 / 120 / 256. The brief: the old spacing "reads empty rather than composed". |

**Superseded by Phase 2 (the browse tier).**

| Section | What it says | What is true now |
| --- | --- | --- |
| [The browse tier is an index, and the preview card is deleted](#the-browse-tier-is-an-index-and-the-preview-card-is-deleted) | Names at display scale, pictures held under the pointer. | `<IndexList>` is deleted. `<WorkIndex>` puts the ordinal, name, deck AND picture in the layout, on every device, server-rendered, with no client JavaScript at all. |
| [Hover: one idiom, everywhere](#hover-one-idiom-everywhere) | Hover reveals the work. | Hover reveals nothing. It moves an arrow, tints a title and lifts a picture by 1.2%, all of which can be deleted without changing what the page communicates. That is the test the old idiom failed. |

The reason is the audience, not taste. Most readers are on a phone, and a
meaningful number arrive after a final-round interview while deciding whether
to argue for the candidate in a debrief. A browse tier whose pictures need a
mouse shows that reader a list of four words. The old component did have a
touch fallback, so phones were not literally broken, but it meant the design
was maintained twice and the version the author looked at while building was
the gated one. That is how a gate survives review.

Every derived meta string went with it: the status badges ("Shipped to
TestFlight; approved for external testing", "Shelved") and the folder counts
("16 pieces", "3 pieces", "3 applications"). The facts survive where they are
load-bearing and stronger: DrawEvolve's body states the TestFlight outcome
under its own Outcome heading, with the detail a chip cannot carry, and Lynk's
deck names the shelving in the sentence that introduces it.

**Superseded by Phase 3 (the design pages).**

| Section | What it says | What is true now |
| --- | --- | --- |
| [Design work: three real pages](#design-work-three-real-pages) | A category with group folders is a browsing tier; each group is its own route. | A category is ONE page. Each group is an anchored section on it, reached by a sticky subnav. The eight `/design/<category>/<group>` routes are deleted and 308 to their anchors. |

Seeing four print pieces used to be three navigations: land on the category,
read a list of group names, click one, land on a third page. The work is now
on screen when the page loads.

**Still true, and extended:** a folder is still the config. Group folders
decide the sections, and they now also generate the redirect list in
`next.config.ts`, read off the same directories.

**Taranto's is deliberately unchanged.** No group folders, three pieces, so it
still renders as a flat gallery with no subnav. A sticky bar with one item in
it is furniture, and splitting three pieces into sub-groups would be structure
invented to satisfy a pattern.

**One rule this reverses: placeholder copy now exists.** The standing rule was
that nothing is invented and an empty field renders nothing, and the build was
verified to contain zero `TODO`, `lorem` or `[[NEEDS` strings. The brief asked
for written placeholder copy that can be edited rather than replaced, so there
is now section copy that is not the author's own. The contract it was written
under is at the top of `content/design.ts`: no claim that is not visible in the
folder's own images or already written elsewhere in this repository, no client
names, dates, volumes, outcomes or metrics. Every block carries
`placeholder: true`, and the marker renders in development only. The production
HTML is still verified to contain none of those strings.

**Superseded by Phase 4 (the application pages).**

| Section | What it says | What is true now |
| --- | --- | --- |
| [Three media fields, three jobs](#three-media-fields-three-jobs) | `cover` is the lead plate, `images` are the plate gallery. | Still true for thoosie and Lynk. DrawEvolve opts into `sequence: true`, which renders cover plus images as ONE pinned scroll run and suppresses both the lead plate and the gallery strip. |
| [Logos of three different paddings, at one optical weight](#logos-of-three-different-paddings-at-one-optical-weight) | The mark sits above the `<h1>` with `alt=""`, because the h1 already names the entry. | The mark IS the `<h1>`, and carries the entry name as its alt text. The page no longer says "DrawEvolve" twice, once as the wordmark and again underneath in Archivo. |

The head is now the mark and one line of orientation. That line matters more
than it looks: a wordmark for an app nobody has heard of is a picture of a
name, and "thoosie" is not a word. The deck is what tells a stranger what the
thing is.

**The scroll sequence is CSS, with no JavaScript at all**, and its unenhanced
state is the default rather than a fallback. The base stylesheet is a plain
vertical stack of all five screenshots; the pinning is layered on inside three
conditions that must all hold: `@supports (animation-timeline: view())`,
`min-width: 62rem`, and `prefers-reduced-motion: no-preference`. Written the
other way round, Firefox would get the pinned layout with nothing driving it,
which is a 500vh block showing one screenshot and four invisible ones.

A phone gets the stack, deliberately. A pinned sequence fights the address bar
collapsing, breaks momentum scrolling and strands people mid-run, and most of
this site's readers are on a phone.

**Kept, and not a chip:** the `Stack` row in a case study's metadata rail
("Swift, Metal, Cloudflare Workers, Supabase"). The brief's cull named status
badges and count labels. Stack is evidence a technical reader wants, it is a
rail row rather than a badge, and deleting it would lose information rather
than noise. Flagged rather than assumed.

**Still true, and load-bearing.** [There is no dark mode](#there-is-no-dark-mode),
[No em dashes](#no-em-dashes), [No dates, anywhere](#no-dates-anywhere), and
the folder-is-the-config contract on the design side.

**One correction this document should carry.** The brief assigned Ochre
`#E0A526` to pull quotes and active nav states, which are both text on the
Paper ground. Measured, that pairing is 2.00:1 and fails every contrast
threshold at every size. Ochre is used as a FIELD with ink on top of it, as
rules, and as underlines instead. Flare `#FF4D2E` is 3.01:1 and is never body
copy. The full measured table is the contrast contract at the top of
`styles/tokens.css`, and it is the reason the palette is built out of
`--on-*` pairs rather than a list of five hexes.

**Not yet done.** Phases 2 to 5: killing the hover-gated index, removing the
metadata chips, the design pages' subnav rewrite, the American Scientific
website case study, the DrawEvolve scroll sequence, the home grid, About, and
a working contact form. See `PROPOSAL.md`.

---

## Direction

**[A] Editorial.** Chosen, not proposed: of the three, it is the only one whose
demands match the content. The site is three long-form prose case studies and a
dense archive; poster scale (14vw, cropped, bled) fights 900 words of argument,
and the technical direction is dark by default, which is the thing you said you
did not want.

## There is no dark mode

Deleted, not disabled. `styles/tokens.css` previously carried a
`@media (prefers-color-scheme: dark)` block that inverted paper and ink, which
meant anyone with a dark OS saw a completely different site from the one that
was designed, and that is what you were looking at.

There is now zero `prefers-color-scheme` anywhere in the project (verified
against the built CSS, not just the source), `color-scheme: light` is declared
on `:root`, and `app/layout.tsx` sends one unconditional `themeColor`. The page
is one colour on every device.

---

## Type

| Role | Face | Foundry | Licence |
| --- | --- | --- | --- |
| Display | **Archivo** (variable) | Omnibus-Type | OFL 1.1 |
| Text | **DM Sans** (variable) | Colophon Foundry | OFL 1.1 |
| Data | **DM Mono** | Colophon Foundry | OFL 1.1 |

**Instrument Serif was removed first.** It was elegant and it was safe, and
safe was the complaint: a high-contrast didone reads as tasteful editorial,
which is the house style of roughly every portfolio built this year.

**Bricolage Grotesque replaced it, and was removed in turn.** It was a
genuinely odd face — uneven weight distribution, flat-sided bowls, a
squared-off `g`, terminals stopping where you do not expect them — and the
oddness was the problem. A display face that draws attention to its own
drawing competes with the work it is introducing.

**Why Archivo.** A neo-grotesque in the American gothic line: even weight
distribution, closed apertures, no ornament. At 129px it reads as a shape
rather than as a personality, which is what a page title should do — frame the
work, not perform beside it.

**The width axis survived the swap, and that is why Archivo specifically.**
Archivo is variable across weight (100-900) *and* width (62-125), which is
rare in this category; Inter and most neo-grotesques have no width axis at
all. Display type stays narrow (`wdth` 88 at hero size, 94 elsewhere) and
heavy (700). At 130px a regular weight reads as "large text"; a compressed
heavy weight reads as a decision, and the narrow width keeps a long headline
off a fourth line. The size and spacing scale did not change.

Bricolage's `opsz` axis has no Archivo equivalent and was dropped. Its effect
was subtle and the size ramp already does that job explicitly.

**Why DM Sans under it.** Archivo is cool and engineered, so the text face
carries the warmth: low contrast, generous apertures, slightly geometric
roundness.

All three are OFL 1.1 and self-hosted by `next/font` at build time. No font-CDN
request at runtime, no third-party origin.

### The steps are unchanged. The headings came down one.

Ratio 1.5 on the display tier, compounding off the 17px body:

| Step | Size |
| --- | --- |
| `--display-1` | 25.5px |
| `--display-2` | 38.3px |
| `--display-3` | 57.4px |
| `--display-4` | **86.1px** (hero only) |
| `--display-5` | 129.1px, no longer referenced by any role |

Every display role was re-pointed one rung down: hero `d5` to `d4`, title `d4`
to `d3`, section `d3` to `d2`, entry `d2` to `d1`. The vw coefficients were
divided by the same 1.5, so each role still reaches its ceiling at the same
viewport it did before. The type is smaller; the fluid behaviour is identical.

**The 6x brief no longer holds, and that was the trade.** The hero was 129.1px,
7.59x long-form body. It is now 86.1px, **5.06x**, under the 6x the brief asked
for. It is still by a wide margin the largest thing on any page and the
internal order of the scale is intact, but the headline no longer dominates the
way the original brief specified. Repoint `--type-hero` at `--display-5` to
undo it; nothing else needs touching.

`--display-5` is kept in the file. The scale is the system, not the list of
what currently references it.

Two floors are deliberately not display steps: `--type-section` and
`--type-entry` clamp their low end at `--text-lg` (21px) rather than one step
below `d1`, which would be 17px, the body size. A section heading that renders
at exactly body size on a phone is not a heading.

Leading is set per size: 0.86 hero, 0.9 display, 1.02 title, 1.62 body.

---

## Colour

```
--ground: #f4f4f2   cool off-white, very slightly green of neutral
--ink:    #111214   true near-black, a hair blue
--accent: #1b4dd8   electric blue
```

**The warmth is gone.** The cream ground and the warmed near-black were chosen
for Instrument Serif and then kept through Bricolage. Archivo is a neo-grotesque
with no warmth to answer, and the cream under it read as a leftover rather than
a decision. The accent moved with it: on a cool ground the vermilion was the
only warm thing on the page and it fought everything else.

Every other colour derives from those three by `color-mix` in oklab. Changing
the three retheres the site, which is what this file has always claimed and is
now actually true end to end.

Measured against the ground, all AA-normal:

| | ratio |
| --- | --- |
| ink on ground | 17.02:1 |
| accent on ground | 6.15:1 |
| `--ink-mute` metadata on ground | 5.21:1 |

The accent on ink is only 2.77:1, which does not pass, but nothing puts it
there: `.on-ink :focus-visible` already switches the ring to `--color-text-invert`
and the skip link is the only inverted surface.

The accent is the first thing on the page: a solid `--space-2` bar across the
full measure directly under the nav. It also carries every hanging ordinal, the
"What it demonstrates" label, the `Shelved` status word, focus rings and hover
states. It no longer carries a rule above the lead case study, because there is
no lead case study any more.

Still one accent, still no gradients, no shadows, and `--radius-*` is `0`.

### One colour is written twice, and only one

`lib/og.tsx` hand-copies five values, because satori cannot read CSS custom
properties. They had **drifted**: paper was `#faf8f5` against a `#f7f4ed`
ground, and the ink and accent matched nothing, so a shared OG card was a
slightly different site to the one it linked to. They are now exact, with
`RULE` and `MUTED` computed from the same oklab mixes `tokens.css` uses.
`app/layout.tsx` `themeColor` had drifted the same way and now matches the
ground.

---

## No em dashes

Every em dash in the project has been removed: 173 of them across 46 files,
including source comments and both markdown documents. Verified zero in the
rendered HTML of every page.

The replacements were made by hand for rendered copy rather than by
substitution, because an em dash does different work in different sentences. It
became a colon where it introduced a list ("end to end: interface, backend,
model pipeline"), a full stop where the clause stood alone ("It was the right
call. The standalone build launched a day early"), and a comma where it was
parenthetical. En dashes in numeric ranges ("2025-26", "October 2025 - present")
are untouched; the instruction was about em dashes.

`portfolio-copy.md` keeps its original wording as the authored record, so the
case study bodies are no longer byte-identical to it.

---

## No dates, anywhere

Every date the site displayed is gone, and the fields that carried them were
removed from the models so no template can render one by accident:

| Was | Now |
| --- | --- |
| `year` and `timeline` on a case study | removed from `CaseStudy`, not read from frontmatter, deleted from the three `.mdx` files |
| `years` on a design category | removed from `DesignCategory` |
| "Year" and "Timeline" rows in the case study rail | gone |
| The year in the breadcrumb, the home rows and the pager | gone |
| The year on `/design` rows and the category breadcrumb | gone |
| `© {new Date().getFullYear()}` in the footer | gone |
| "Manual running order, not date-sorted" | now "Manual running order" |
| "Shipped to TestFlight in May 2026." | "Shipped to TestFlight." |
| "Launched August 2026." | "Launched." |

The last two are edits to authored prose, made because the instruction was
"entirely". Verified: **no four-digit year, no month name and no date label
appears in the built HTML of any page.**

Durations survive, because they are not dates and they carry real weight:
"I spent four years making catalogs", "I learned it in about two weeks",
"the only way one person covers that much surface area in six months".

The design categories were the reason to do this. Five sections stamped 2021,
2021, 2021, 2022 and 2025 told a reader the design work was old before they had
looked at any of it, which is the opposite of what an archive is for.

---

## The masthead came back, as one sentence

The home page opens on the statement again. It is not the old masthead: there
is no accent bar and no vitals rail, and the tile grid is still four doors.
What returned is the opening statement and its supporting paragraph, and
nothing else.

The accent still carries hover and the focus ring; the solid bar is still not
on the page.

---

## The headline is gone too, and it was the author's own sentence

Recorded because it took two attempts to land and should not be re-derived from
scratch if a hero ever comes back.

`portfolio-copy.md` opens "Graphic designer who ships software." That was
replaced twice, both times on request. The first replacement was built from the
About copy's "I design the thing, build the thing" and was rejected as a
slogan, which it was. The version that stood was the opening line of the AI
Systems section intro, verbatim:

> Products I designed and built end to end.

**It was removed on request when the home page became a tile grid**, not
because anything was wrong with it, and it is **back on request**, restored
above the grid in `app/page.tsx` exactly as the note here said to do it.

What went back was `portfolio-copy.md` → "Home — opening statement", both
paragraphs verbatim: the opening line as the page's `<h1>` and the
four-years-of-catalogs paragraph under it. The visually-hidden `<h1>` the tile
page carried is gone rather than duplicated.

**Neither of those two strings is on the page now.** Both were superseded on
request, separately:

- the `<h1>` is **"Graphic Designer & Developer"**, author-supplied, which
  replaced "Graphic designer who ships software." That is the third time this
  line has been rewritten and the second time on request. `portfolio-copy.md`
  has not been updated to match, so the doc and the page disagree; **the page
  is the authority.**
- the supporting paragraph is **out of the build entirely.** The statement
  stands alone above the clip. The longer version of that same biography is
  already on `/about`, verbatim, where a visitor who wants it will look, and
  the first screen's job is the statement and the footage.

**It runs at `--type-statement`, the only role on the site pointing at d5**
(129.1px, 7.6x long-form body). The one-step-down pass recorded in
`tokens.css` still holds for every other role, so the largest type anywhere
else on the site is `--type-title` at 57.4px and the statement outranks it by
2.25x. That gap is the whole point of restoring it: the previous page ran tile
titles at 25.5px against card titles at 21px, roughly one step apart, so
nothing on it was big enough to stop a scroll.

---

## The home page has three tiers

**The applications band is gone.** The page carried the statement, an
"Applications" heading, DrawEvolve as a large feature, thoosie and Lynk as
preview cards, and then the doors. Those three boxes were the entire contents
of `/applications`, one click away and reachable from a door sitting directly
beneath them: the page was showing the same set twice and the doors were
competing with a copy of what they open. Browsing lives on `/applications` and
`/design`. This page is the statement, the clip, and four ways in.

**The scroll cue is gone**, on request. The travelling hairline under the
paragraph is out of the build, along with the only looping animation the site
had.

**The statement is now "Graphic Designer & Developer"**, author-supplied, and
it supersedes `portfolio-copy.md`'s "Graphic designer who ships software." The
copy doc has not been rewritten, so the two disagree; the page is the
authority. It still runs at `--type-statement` and still reveals word by word.

**And it stands alone.** The supporting paragraph beneath it, the
four-years-of-catalogs sentence, is out of the build on request. The first
screen is the statement and the clip. That biography is still on `/about`,
verbatim, which is where anyone who wants it will look.

---

## Superseded: the home page had five tiers

The page was a 2x2 of tiles and then three equal preview cards. Both tiers sat
within about one step of each other (tile titles at `--type-entry`, 25.5px at
the top of its clamp, card titles at `--text-lg`, 21px), so there was no first
moment: nothing on the page was bigger than anything else, and the three
applications were flatly interchangeable.

The order now, each tier visibly a different weight:

| | | |
|---|---|---|
| 1 | the statement | 129px, revealed word by word, alone on the first screen |
| 2 | the clip | thoosie's footage, full bleed, 21:9, closing the hero |
| 3 | DrawEvolve, featured | cover at 6 of 12 columns, text beside it |
| 4 | thoosie and Lynk | ordinary preview cards, unchanged |
| 5 | the four doors | the 2x2, moved to the bottom |

**The clip band is the one full-bleed element on the site**, and it belongs to
the hero rather than opening a section of its own, which is why DrawEvolve
below it is still the first piece of WORK a visitor meets. It is cropped to
21:9 and capped at 62vh: the file is 1920x1080, so at 100vw on a 1440 window
its natural height is 810px and it would otherwise be a whole screen sitting
between the statement and the work. It renders through the existing
`<AutoVideo>`, so it inherits that component's autoplay policy unchanged.

**The 2x2 moved to the bottom because it is navigation** and it was standing
where the work should have been. The tiles are otherwise untouched: same four
doors, same source, same derived counts. The Agentic AI tile is one of them and
its content did not change.

**The feature is a different composition, not a bigger card.** A preview card
is a 4:3 crop with its text stacked under it; the feature is a 3:4 crop at 6
columns with the deck and status set beside it, bottom-aligned. Three identical
cards at three different widths would still read as one tier. The crop is 3:4
because every application cover in content is a 2064x2752 iPad screenshot, so
the box is the asset's own shape rather than a guess at it, and `max-height:
40rem` keeps it to about one screen on a laptop.

**It is the running order's first entry, not a hardcoded slug.** `app/page.tsx`
destructures `caseStudyCards(getSelected())`, so whatever sits first in
`SELECTED` gets the feature treatment and the deck, status and thumbnail come
from the same mapper the grid below uses. There is no second copy of the
running order on the page.

**DrawEvolve's own cover leads it, not thoosie's clip.** The brief allowed
either. `content/work/drawevolve/index.mdx` already calls `02.jpg` "the
strongest of the five" and "the one picture that proves the deck's claim", it
is the frame with the AI Feedback panel open over a finished drawing, and
featuring one entry with another entry's asset would break the link between
the picture and the title beside it.

---

## Three media fields, three jobs

`content/index.ts` used to read one image per entry and use it everywhere.
There are now three, and they are not interchangeable:

| field | job | where it renders |
|---|---|---|
| `logo` | identity | the entry's own page, above the title |
| `cover` | the evidence that proves the deck | the lead media |
| `thumb` | a picture composed for a 380px 4:3 box | the preview card |

**The card reads `thumb` first.** It used to take the entry's lead: a video's
poster or the cover, on the reasoning that the case study had already picked
its best picture. It had, but for a different job. A 2064x2752 iPad grab
centre-cropped to a landscape card loses the AI panel that made it worth
leading with, and a 16:9 action still loses its subject. The old chain stays
behind `thumb`, so an entry without one cards up exactly as before.

**The logo never displaces the cover.** A logo is identity, not evidence, so it
got its own field and its own slot rather than overwriting the lead. On
thoosie the clip still leads the page.

### The uploads, and which ones were used

Two of the five uploaded files were **not** used, because the repo already had
the same artwork in a better form:

- `drawevolve logo.jpg` — the same wordmark on a 1600x1200 white canvas. The
  repo's existing file is the same mark tight-cropped at 1129x372 with real
  transparency. Kept as `logo.png`.
- `lynk-logo.png` — 146x70. The repo's existing wordmark is the same mark at
  839x269, 5.7x the resolution, and the only one of the two that can carry a
  head at this size. Kept as `logo.png`.

Both uploads are still sitting in the repo root and can be deleted.

### Logos of three different paddings, at one optical weight

`aspect` on a logo is declared to the **mark's content bounds, not the file's
canvas**, and the head crops to it. thoosie's export is a 1600x1200 canvas with
the wordmark in a band across the middle, so it is declared `1600:700`; the
other two are tight and declared at their true size. The box takes that aspect
and the image **covers** it, so the padded export's white margin is cropped
away and a tight one is untouched. One rule, no per-entry CSS.

**`mix-blend-mode: multiply` means no logo needs an alpha channel.** On a light
ground, multiply drops white and leaves ink and colour alone, so a wordmark
exported flat onto white reads as if it were cut out; transparent PNGs are
unaffected, so the same rule covers both kinds of file.

It requires `isolation: isolate` **and an explicit background**, and the two go
together or neither works: an isolated group with no background of its own has
a transparent backdrop, and multiplying against transparency is a no-op — the
white would come straight through and the treatment would silently do nothing.
The group paints the page ground, which is what the mark multiplies onto.

---

## The browse tier is an index, and the preview card is deleted

`components/ui/IndexList.tsx`. Every page whose job is "here is a set of things
to look at" — `/applications`, `/design`, and a category's groups — is now a
ruled list of NAMES at 38-57px, with each entry's picture held under the
pointer. `Card.tsx`, `Card.module.css` and `CardMedia.tsx` are out of the
build.

### Why the card grid was the wrong shape, not the wrong finish

It got two hover passes. The first added an image scale, an offset accent rule
and an arrow badge. The second replaced that with a pointer-anchored magnify,
registration marks drawn as eight background gradients, and a chip tracking the
cursor. Both were rejected, and both were polish on a format that was never
going to be the answer:

- **A grid of equal boxes says every item is equivalent.** It flattens a
  shipped iOS app, a live web toy and a shelved product into three tiles.
- **A 4:3 crop throws away the one thing each picture had to say.** Every asset
  arrived pre-flattened: a 2064x2752 iPad grab, a 16:9 clip still and a
  1615x896 workspace shot all came out as the same rectangle.
- **It ignored the single most distinctive thing this site owns.** The type
  scale is a 1.5 ratio that exists, in its own words, "so one thing can
  dominate". A card title ran at 21px. The scale goes to 129px.

The lesson worth keeping: **when two rounds of hover work in a row do not
land, the interaction is not the problem.** Adding a fourth layer to a card
would have failed a third time.

### What the index does instead

**The type is the page.** Names at `--type-title`, topping out at 57.4px:
2.7x a card title, and the largest type anywhere on the site except the home
statement. Ordinals hang in the left margin, the deck sits under the name, the
status is pinned right. It reads as a table of contents.

**The pictures are not in the layout.** Each row owns a preview panel, and
`pointermove` on the list writes two pixel values, `--px`/`--py`, that CSS
positions all of them from. So the picture that shows is whichever row is
hovered, it appears where the pointer already is, and it renders **at its own
proportion** — nothing is cropped to a box, which is the thing the 4:3 card was
destroying. The panel is up to 26rem wide, larger than any card thumbnail was.

**One preview element per row, not one shared element whose `src` swaps.** That
swap is what causes the flash of the previous project's image in most versions
of this effect. Nothing is measured per row and no React state changes on move.

**`:has()` does the de-emphasis.** While one row is hovered, every other row's
name drops to the single muted tone, in CSS, with no state and no JS. This is
the one place that tone earns its keep as emphasis rather than as metadata:
not a grey ramp, one step down, on the rows you are not looking at, for as long
as you are not looking at them.

**The panel hangs below the cursor and is clamped to the list.** Two bugs
avoided: centred vertically at `-50%`, the panel's top half went through the
page heading and off the top of the window on the first row; and an absolutely
positioned panel hanging past the page's left edge adds horizontal overflow to
the whole document, so a scrollbar appeared on the body every time the first
column was hovered. `translate(-50%, -22%)` and a `clamp()` on `left` that
never lets it get closer to an edge than half its own width.

**The rotation is deliberate and it is the only one on the site.** `-2.5deg`.
Legitimate here precisely because the panel is not in the layout: it is a loose
print held over it, not an element on the grid.

### Where it degrades, and where it doesn't

**No pointer, no floating panel.** All of it is inside
`@media (hover: hover) and (pointer: fine)`. On a touch screen the previews lay
out inline under each name at full width instead, because a hover-only reveal
on a phone is a picture nobody ever sees.

**It is a list before it is anything else.** Server-rendered `<ol>` of `<li>`
of `<a>`, in running order, with the ordinal, name, deck and status all in the
markup as text. The panel is decoration on top: `alt=""` because the name is in
the same link, `aria-hidden` on the ordinal because the list numbers itself.

**Under reduced motion the panel still appears and still follows.** That is the
interface, not an embellishment, and withholding it would leave a visitor with
no way to see the work. What goes is the travel, the scale-in and the rotation.

**The rect is cached on `pointerenter`**, not read per move.
`getBoundingClientRect` forces a layout flush and doing it per `pointermove` is
the difference between free and janky.

### One thing that came out of it

`lib/cards.ts` now carries **real width and height** with every picture, not
just a URL, because the browse tier renders at true proportion. The mappers are
`caseStudyRows`, `designCategoryRows` and `designGroupRows`.

`DesignGrid` is untouched: a category's actual artwork is not a browse tier and
a dense archive grid is genuinely the right read for it.

---

## Motion: framer-motion and Lenis, and where each one is not used

Added on request. `framer-motion` for component animation, `lenis` for smooth
scroll, and one reusable reveal rather than `whileInView` copy-pasted per
component.

**`components/motion/Reveal.tsx` is the only scroll-triggered pattern.** Fade
plus a 16px rise, once, fired 12% before the block reaches the fold. Every
reveal on every page is this component with a `delay`, so the vocabulary
cannot drift.

**Four to five moments per page, not fifteen.** Home: the statement's word
reveal, the clip band, the section head, the feature, the card grid, the
doors. Case study: the prose, the plate gallery, the pager. The head of a case
study does not animate at all.

### Three things deliberately do NOT use framer

**The home statement animates in CSS.** It is the page's LCP text. Framer
renders `initial` into the server HTML, so a framer reveal would ship the
site's largest paint at `opacity: 0` and make it wait for a JS chunk. The
keyframes in `page.module.css` run on first paint with nothing hydrated.
Below-the-fold blocks use framer, where a hydration wait costs nothing because
nobody has scrolled to them.

**Nothing above the fold reveals.** Same reason. The case study head, its
title, deck, status and meta rail are static, and the lead cover keeps
`priority` so it stays the LCP candidate rather than becoming a reveal.

**The plate gallery needs no JS.** Native `overflow-x` plus `scroll-snap-type:
x proximity`. Trackpad, touch and the keyboard all work unhydrated. It carries
`tabindex="0"`, a `role="group"` and a label so the keyboard can reach it, and
`data-lenis-prevent` so the smooth-scroll wrapper does not swallow a
horizontal gesture that belongs to the track.

`proximity` and not `mandatory`: mandatory snapping refuses to rest between
plates, which fights a visitor scanning rather than stepping, and on a narrow
window it can trap a plate wider than the viewport.

### Reduced motion

**Lenis is never constructed.** Not slowed, not shortened. Smooth scroll
affects every interaction rather than one block and cannot be avoided by not
scrolling, so under the preference the page keeps the browser's native
scrolling with nothing intercepting the wheel. The media query is watched
live, so flipping the OS setting does not need a reload.

**`Reveal` renders a plain element** with no variants, no initial state and no
observer, rather than a 0ms animation, which would still ship an invisible
starting state.

**The global reset is not sufficient and this is the subtle one.**
`reset.css` forces `animation-duration: 0.01ms` but does not touch
`animation-delay`. The statement's words are staggered BY delay, so under the
global rule alone the last word would sit invisible for 360ms and then snap
in: a flash of missing heading caused by the accessibility rule itself.
`page.module.css` cancels the animation outright. The looping cue is removed
rather than run fast.

### Load

Nothing blocks perceived load. Every page is complete server-rendered HTML and
the motion layer only re-animates what is already there. `@media (scripting:
none)` in `global.css` forces every `[data-reveal]` block visible when there
is no JS at all, since framer's `initial` would otherwise leave them hidden
with no runtime to reveal them.

**Measured cost, this build:** framer-motion 25.1 KB gz, Lenis 14.3 KB gz,
**39.4 KB gz added** on top of a ~170 KB gz React 19 + Next 16 baseline that
was already shipping. framer is imported as `m` + `LazyMotion` with
`domAnimation` rather than the full `motion` component, which is 25.1 KB gz
instead of 38.0: `domAnimation` carries `InViewFeature`, the thing that
actually implements `whileInView`, and leaves out drag, layout projection and
pan, none of which this site uses. `strict` on the provider makes that
permanent by throwing if anyone imports the full `motion` later.

### The scroll cue has no words

A "scroll to explore" label would be copy that is not in
`portfolio-copy.md`. The cue is a hairline travelling down its own track,
`aria-hidden`, and it is the only looping animation on the site: its job is to
still be saying "there is more below" thirty seconds after the page settled.

---

## Hover: one idiom, everywhere

Every clickable card and tile on the site does the same things on hover and on
`:focus-visible`: the picture scales to 1.04 **inside a crop that does not
move**, an accent arrow badge is revealed in the crop's corner, the crop's
hairline goes to full ink, and the title takes the accent. `--duration-base`,
180ms.

**The affordance is a badge, not a scrim.** A translucent panel washed over the
crop with the title repeated on it is the reflex, and it is wrong here twice
over: the title and the deck are already set below the crop in full ink, so the
overlay would restate them, and a scrim would be the only place on the site
where ink sits at partial opacity, which the type system bans outright.

**It is not a custom cursor.** Replacing the pointer reimplements the one piece
of UI the visitor's OS owns, does nothing on touch, and cannot be driven by
focus, so keyboard users would get none of it. The badge is `aria-hidden`: the
title inside the same link is already the accessible name.

Still no radius, no shadow, and no lift of the card itself. The scale is on the
image inside `overflow: hidden`, so nothing reflows and no neighbour moves; the
card's box is identical hovered or not.

Declared in `Card.module.css` (Applications, Design, and the groups inside a
category, since all three use the one card) and matched by the home feature and
the four tiles in `app/page.module.css`.

**Under `prefers-reduced-motion` the transform is dropped, not sped up.** The
global reset in `reset.css` collapses `transition-duration` to 0.01ms, which
would make a scale snap instantly rather than not happen. The colour signals
stay: they are not motion.

---

## Navigation: five tabs

Applications, Design, Agentic AI, About, Contact.

This departs from `portfolio-copy.md`, which specifies three (Work, About,
Contact) and argues for keeping it to three. The three-label version named only
the software half of a claim about being both, which argued against the site on
every page.

"Work" became **Applications**, and the home section it lands on was renamed to
match: a tab that says Applications should not scroll to a heading that says
Selected work.

**Agentic AI is a new route with no copy.** `content/agentic-ai.ts` has an empty
`body`, so the page renders its heading and a pointer to the "How I worked"
passage inside the DrawEvolve case study, which is already published, verbatim,
and about exactly this. Nothing was written for it.

---

## Space and composition

**The spacing scale jumps at the top**, `--space-9` is 120px, `--space-10` is
176px, `--space-11` is 256px, because uniform vertical rhythm was half of why
the old build read as templated. Components pick a NAMED rhythm rather than a
number, so the variation survives editing:

```
--rhythm-crowd  24px          two blocks that should read as one thought
--rhythm-tight  36 →  56px    the archive, which crowds itself
--rhythm-normal 56 → 120px    ordinary section separation
--rhythm-loose 120 → 256px    the masthead, the footer approach
```

Applied unequally on purpose: the home masthead gets `loose` beneath it, the
Selected Work block crowds up against it with a heavy rule and 16px of padding,
the archive sections sit at `tight`, and the third case study crowds the second
so it reads as a footnote rather than a third equal item.

**Everything is centred. This reversed.** `Container` sets `margin-inline:
auto` at every viewport. What this section used to say, in full, was "Nothing
is centred: `Container` sets `margin-inline: 0` and only takes the slack on
both sides past 118rem", with the left-hang treated as the site's signature.

**Why it reversed.** It did not read as an asymmetry, it read as a broken
wrapper. Between the 90rem cap and the 118rem breakpoint every page on the
site pinned itself to the left gutter and collected 100% of the leftover
viewport as one dead band on the right: about 160px at 1600, about 450px at
1920, on every page, at the window sizes most people actually use. The
metadata rail was supposed to make that margin feel occupied and instead
became the thing stranded in it, a 3-column panel with nothing on either side
of it. An asymmetry a viewer reads as a bug is not doing the job it was
chosen for.

Everything drawn to depend on it came out with it, because centred, each one
was an unexplained indent or an overflow rather than a composition:

- the 16.6667% indents on the case study deck and status, the category prose
  and its "demonstrates" block, and the contact lead
- the column-3 and column-4 starts on case study prose, the category intro,
  the About prose column and the /design landing copy
- the negative-gutter pulls: `grid.bleedRight` / `bleedLeft` and the case
  study's `plateWide`, which now stop at the container's edge
- the case study lead media's **full bleed**. It was the one element allowed
  to touch the viewport; on a centred page it was simply the only thing wider
  than the content it belonged to, so it is contained and framed like every
  other picture on the site.

**Content and rail are 8 + 4 of 12, everywhere.** Declared in
`grid.module.css` as `.main` / `.rail` and matched by the case study head,
About, Contact and the 404. The rail was 3 columns, too narrow to set a term
over its value without wrapping every line, which is most of why it read as
orphaned. The case study head also runs `align-items: stretch`, so the rule
down the shared edge spans the full height of the head and the two columns
read as one object.

**Body copy is bounded by a measure, not by an indent.** `max-width:
var(--measure)` (62ch) on a column that starts at the content's own left
edge, rather than a 7-column span pushed in from column 3.

**Images are framed.** `--rule` hairline plus `--color-bg-sunk` on the picture
itself in `Frame`, `DesignGrid` and `Video`, matching the hairline the preview
card already had on its crop. The border is on the image and not on the figure
deliberately: the figure is the full content column and the picture inside it
is usually narrower, so a border on the figure would matte a portrait
screenshot with 600px of ground beside it. Much of the design archive is print
and social work exported on white, which without an edge sat on the page
ground as an unbounded pale shape.

**One page was left out on request:** `/agentic-ai`, which is being overhauled
separately. It still carries `.lead { grid-column: 3 / 11 }` and a
`grid-column: 4 / 7` in its related block, so it is the only route still
holding the old left-hang and should get the same treatment when it is
rebuilt.

---

## What was torn out, and why

The build had accumulated a lot of machinery that protected nobody. All of it
is gone:

| Removed | Why |
| --- | --- |
| The `[[NEEDS]]` / `TODO` guards, all three modes | A portfolio build failing because a content field is empty fails at 2am for a reason no visitor would ever have noticed. Empty now renders nothing. |
| `ALLOW_PLACEHOLDERS` | An escape hatch for a guard that no longer exists. |
| `MANIFEST.md` + `scripts/manifest.mjs` | A generated shopping list of images that did not exist. The folder is the list now. |
| `<Placeholder />` | It printed a note from the author to the author onto live pages. |
| The content schema (`zod`) | It threw on a misspelled key, a banned key, a missing tradeoff cost. Editorial discipline enforced by a validator is a build that breaks when you are trying to ship. |
| `content/order.ts`, `content/sections.ts` | Drift-detection between an order file and the folders on disk. Three case studies do not need a consistency checker. |
| The gallery content type, `GallerySet`, `Empty` | Superseded by `public/design/<category>/`. |
| `Argument`, `Diagram`, `Tables` | The five-field "spine" and the AI-shaped structure. No case study used them, the copy is prose. |
| Nine of ten redirects | They were guesses at which Adobe Portfolio slug mapped to which medium, pointing at an `/archive` route that no longer exists. A redirect maintained on speculation is worse than a 404: it sends someone confidently to the wrong page. |
| `playwright-core`, `check:viewports` | A test harness installed on every deploy for a script that never ran there. |
| `zod` | No longer imported anywhere. |

**What survived: `scripts/check-links.mjs`.** It earns its place because the
failure it catches is invisible from the rendered page, a relative external
href resolves against this domain and 404s while looking exactly like a working
link. That is the bug the old site shipped on every case study.

The content loader is now ~200 lines of coercion that cannot throw. Every field
has a fallback, every missing image renders nothing, and `next build` is the
only thing that can fail a build.

---

## Design work: three real pages

The single `/archive` page was wrong, it buried the design work in one scroll
and framed it as an appendix. Each body of work now has its own page at
`/design/<category>`, and `/design` is a landing that presents all three.

Order is American Scientific, Taranto's, Personal Works, manual, in
`content/design.ts`, never sorted by the year label.

### Sorted by client, not by medium

This section was five categories by MEDIUM: Print, Marketing, 3D, Motion,
Personal. That axis sorts the work by the tool used to make it, which answers
"can he use After Effects". Sorting by who it was for answers "what did he own,
and for how long", which is the question the work is evidence for. The print,
marketing, 3D and motion pieces made at American Scientific were one sustained
body of work and now sit in one place instead of being split four ways by
software.

`/design/print`, `/design/marketing`, `/design/3d` and `/design/motion` are
retired. Their image folders held no files, only the generated README, so
nothing moved and nothing was lost. **No redirects were added**, on the same
reasoning as the retired Adobe Portfolio map in `next.config.ts`: three of the
four old paths map cleanly onto American Scientific, but `/design/personal` is
unchanged and a redirect map that is right three times out of four is worse
than a 404 that hands over the section index. Add them if those URLs were ever
published.

American Scientific and Taranto's carry **no copy at all** — `intro`, `body`
and `demonstrates` are empty, and every one of those fields renders nothing
rather than a placeholder. Their pages are a heading and, once files land, a
grid. Personal Works keeps the intro already written for it.

**The "What it demonstrates" line is rendered as its own labelled block**, with
the accent rule, above the images and separate from the intro. It is doing a
specific job: telling a technical reader who cannot evaluate design on its own
terms what this work is evidence *of*. Folding it into the prose would waste it.

### A folder is the config

`public/design/<category>/`. Drop files in; they appear on that category's
page, sorted by filename. No manifest, no registry, no per-image frontmatter,
no import.

**It covers motion now too.** A video is `<name>.mp4` plus a poster at the same
stem, `<name>.jpg`. The poster renders before playback, is what any caller uses
when it needs a still, and is never listed as a work of its own: it is claimed
by its video, so a pair is ONE grid item, not two. Clips lay out on their true
proportion and take the same span a still of that shape would, and render
through `<AutoVideo>`, which is muted, looping, control-free, paused until the
clip is on screen, and does not autoplay at all for a visitor who has asked for
reduced motion or is on a metered connection. Those visitors see the poster,
which is a real picture of the work.

### GIFs stay GIFs, and the format on disk is the format that ships

**Reversed.** The animated pieces in the American Scientific archive, web
banners, animated social posts, a logo build, were once transcoded by hand to
h264 MP4 (112.5 MB of GIF down to 8.0 MB) and shipped as video. They are now
imported as the GIFs they are, from a source drop that was downsized at the
source, and the transcode is no longer part of the pipeline.

The rule, in one line: **a `.gif` ships as a `.gif`, a `.mp4` ships as a
`.mp4`, and nothing converts either one.** There is no sharp, no ffmpeg, no
build hook that rewrites a file under `public/`.

Enforcement is one derived flag, not a convention anybody has to remember.
`passthrough` in `lib/design-images.ts` and `unoptimized` on `ImageRef` in
`content/index.ts` are set from the extension, `.gif` and `.svg`, and land on
`next/image`'s `unoptimized` at every call site: the design grid, the design
landing lead, the home tiles and `<Frame>`. Those files are served from their
own URL under `/design/` or `/media/` and never through `/_next/image`, so the
optimiser is never handed an animated file and cannot hand back a still.

`next/image` would have left an animated source in its original format anyway.
The flag is there because "would have" is not a guarantee worth a silently
de-animated banner, and because it also skips a pointless round trip.

Dimensions are read from the file header at build time (`image-size`, one small
dev dependency). That is what buys two things with zero configuration:
`next/image` gets real width/height so nothing shifts as images load, and the
grid lays out on **true aspect ratios** instead of forcing a uniform tile.

Spans come from the real proportion, 3 columns for a tall screenshot, 4 for a
square, 6 for a landscape, 8 for a wide spread, 12 for a panorama, and height
follows from the ratio. Nothing is cropped or letterboxed, which matters when
the content is genuinely mixed: catalog spreads, square social posts, phone
screenshots and 3D renders on one page. `grid-auto-flow: dense` lets a narrow
image backfill the gap a wide one left.

Alt text is derived from the filename, `03-catalog-spread.jpg` becomes
"Catalog spread", and falls back to the category name when the filename
carries nothing (`05.png` → "Print"). It never blocks: a badly-named file still
renders.

**An empty folder renders the copy and no grid.** No placeholder boxes, no
broken image icons, no "coming soon".

---

## The home page is four doors

It used to be two halves on one scroll: Applications (the three case studies)
and then Design (the categories), under the hero, with the nav's Applications
tab pointing at the `#applications` fragment. **The home page was the
Applications page**, which is why that tab scrolled you down it.

It is now a 2x2 grid of four tiles, and nothing else: Applications, Design,
Agentic AI, About. Each is one link wrapping its thumbnail and its title, so
the whole cell is the target. Contact is not a tile; it is a utility, in the
nav and the footer, not somewhere anyone browses into.

Applications moved to its own route at `/applications` and every nav label now
resolves to a real page. Two links that pointed at the old fragment came with
it: the case study breadcrumb and the 404's "Back to the work". The `/work`
redirect in `next.config.ts` was aimed at `/`, which was correct only while
home *was* the list of applications; it now points at `/applications`, the page
`/work` actually was.

### The tiles carry no invented copy

Each tile is a title plus a **derived count**: "3 applications" from the length
of `SELECTED`, "3 bodies of work" from the length of `designCategories`.
Neither is a sentence anyone has to keep true by hand. Agentic AI and About
have nothing to count and carry nothing; no blurb was written to fill the gap.

### Thumbnails are drop-in, and there is no placeholder box

`public/home/<slug>.<ext>`, the same "a folder is the config" rule `/design`
runs on. Drop `design.jpg` in and the Design tile grows an image; dimensions
are read from the file header at build time so nothing shifts as tiles load.

**No image files exist yet.** A tile without one renders its title and count on
the flat ground, and the grid's own hairlines carry the composition. It does
not render a grey rectangle at the image's aspect ratio: this site has a
standing rule against placeholder boxes, and a 2x2 of empty rectangles would be
the largest possible violation of it. `.tile` holds a `min-height` so the grid
still reads as a composition while the cells are text only.

`Design` is also a fourth nav label. The copy specifies three and says to keep
it to three; a nav that names only the software half argues against the site's
own claim on every page, so this is a deliberate departure. Noted here rather
than quietly.

---

## Wiring in portfolio-copy.md

`portfolio-copy.md` is the copy. It was routed, not edited: nothing in it was
rewritten, paraphrased, expanded or condensed, no new prose was written to fill
a gap, and the file itself is untouched on disk.

A build-time proof of that is worth having, so here is how to re-run it, it
lifts each case study body out of `content/`, restores the heading levels, and
asserts the result is a substring of the copy file:

```bash
python3 - <<'EOF'
import re
copy = open("portfolio-copy.md").read()
norm = lambda t: re.sub(r"\s+", " ", t).strip()
for slug in ("drawevolve", "thoosie", "lynk"):
    lines = open(f"content/work/{slug}/index.mdx").read().split("\n")
    end = next(i for i in range(1, len(lines)) if lines[i] == "---")
    body = re.sub(r"^## ", "### ", "\n".join(lines[end+1:]), flags=re.M)
    print(("VERBATIM " if norm(body) in norm(copy) else "DRIFT    ") + slug)
EOF
```

### Where each piece landed

| Copy | Now lives in |
| --- | --- |
| Home opening statement | `app/page.tsx`, headline + subhead |
| Nav labels | `lib/site.ts` → `nav` (already matched) |
| Meta description | `lib/site.ts` → `description`; used on every page and both OG cards |
| 404 | `app/not-found.tsx` |
| Contact page | `app/contact/page.tsx`, address in `lib/site.ts` |
| About body | `app/about/page.tsx`, four paragraphs |
| Section intros ×6 | `content/sections.ts` → `standfirst` |
| Case studies ×3 | `content/work/<slug>/index.mdx` |
| **Subtitle:** / **Role:** / **Status:** / **Timeline:** / **Live:** | frontmatter `deck` / `role` / `state` / `timeline` / `links` |

### The four edits I made to the structure, and why

**1. The case-study spine is now optional.** `constraint`, `attempts`,
`tradeoff`, `outcome` and `revisit` were required, capped at ~220 characters
each, and were the mechanism that forced a decision log to exist when this repo
had no copy. The copy is written as prose under its own headings, "The
premise", "The constraint", "What I built", "The tradeoff I made", "How I
worked", "Outcome". Restating a three-paragraph section in 220 characters is
writing new copy, and inventing an `attempts[].failed` for thoosie and Lynk,
which name no failed attempts, is inventing facts. So the fields are optional
and unused; the argument is the prose. Their shapes are unchanged, `<Argument>`
renders whichever are present and numbers them over what survives, and the
banned keys (`roadmap`, `features`, `problem`, `solution`, `challenge`) still
fail the build by name.

**2. Six DrawEvolve/Lynk stubs became three case studies.** The repo had
`drawevolve-metal-renderer`, `-critique-memory`, `-coaching-system`,
`-cost-abuse-hardening`, `parallel-agent-worktrees` and `lynk-llm-routing`,
all pure TODO. The copy has three case studies, and you specified the AI
Systems section as DrawEvolve → thoosie → Lynk. The renderer, critique system,
infrastructure and worktree material are all sections *within* DrawEvolve's
copy now. Slugs are `drawevolve`, `thoosie`, `lynk`.

**3. Full Stack Development is gone.** Your section order lists six sections
and that is not one of them. `ai-systems` is retitled "AI Systems &
Development".

**4. Heading levels were demoted `###` → `##`.** In the copy file the case
study sections sit under a `# CASE STUDY N` title; on the page the entry title
is the `h1`, so its own sections are `h2`. Document structure, not copy, no
word, no punctuation and no ordering changed.

### Things the copy does not cover, that a component wanted

None of these render a placeholder. Every one of them is a component that
correctly renders *nothing* when the value is absent, so the gap is invisible
to a visitor and one edit away from filled. **One exception, and it is
visible**, the first row.

| Gap | Where | What renders now |
| --- | --- | --- |
| Home eyebrow label | `app/page.tsx` | The slot is deleted. The copy has no label line above the headline. |
| Home / About / Contact rail: "Based", "Focus", "Looking for" | `lib/site.ts` → `location`, `availability` | Rows omitted. Fill either constant and every row reappears. |
| Footer one-liner | `components/ui/Footer.tsx` | Deleted. The footer is the sign-off, "Trevor Riggle, Columbus Ohio", and nothing else. The domain and the "Set in Archivo & DM Sans" colophon were removed on 2026-09-14: a colophon is a note from the designer to other designers, and the domain printed the address the reader is already at. |
| Footer "Elsewhere" | `lib/site.ts` → `social` | Whole block omitted rather than showing an empty heading. |
| /work index standfirst | `app/work/page.tsx` | Omitted. The six section intros do that job. |
| About rail chips | `app/about/page.tsx` | Deleted. Filling "Building with" / "Designing with" / "Shipped on" would mean mining tool names out of your prose and re-setting them as tags you did not write. |
| Lynk's year | `content/work/lynk/index.mdx` | Absent, `year` is now optional. The copy gives Lynk no date. |
| Gallery entries, all six sections | `content/gallery/` | Each section renders its heading and its intro, then stops. The scaffolding note is dev-only. |

**Derived, so I did build it:** per-page titles and OG images from frontmatter;
`year` on DrawEvolve (`2025–26`, from its **Timeline:** line) and thoosie
(`2026`, from "Launched August 2026" in its own Outcome copy); `stack` chips on
DrawEvolve (Swift, Metal, Cloudflare Workers, Supabase, each named in that
case study's copy; thoosie and Lynk name none, so theirs are empty).

### Nothing is unfilled any more

Every field above was supplied by the author and filled. `social` is the one
that stayed empty, and deliberately: no real profile URL was supplied, and a
guessed GitHub or LinkedIn handle is a link that 404s in front of a hiring
manager, the exact failure the link check exists to prevent. The footer
"Elsewhere" block and the contact rail render nothing at all while it is empty,
so there is no placeholder anywhere on the site.

The placeholder guard now reports `Placeholders: none` on a production build.

### One design rule that came out of this

**The home page does not render spec placeholders.** Everywhere else, a
declared image with no file renders as a `<Placeholder />` carrying its
filename, ratio and content spec, that is what makes the site reviewable with
zero assets, and it stays. But when thoosie joined Selected Work, its poster
plate landed on the front door, printing *"what must this image show? /
01-gameplay-poster.png / ≥2400×1350"* to whoever opened the site.

`SelectedWork` now shows a media slot only when a real file exists and collapses
to type when it does not. The layout already handled that case, the lead has no
cover today. The spec plate is still on the case study page, where it is a note
from the author to the author and belongs.

## Applications: one treatment, three times

Selected Work used to render three ranks at three sizes: DrawEvolve at
`--type-title` with full-bleed media, thoosie at `--type-entry` with media at
two-thirds, Lynk as a bare ruled line with no media at all. The descending
rhythm carried most of the hierarchy, and the argument for it was that Lynk
being lightest was editorially correct because it is shelved.

That argument is retired. Three shipped applications are three shipped
applications, and setting one of them a third the size of another argues they
are not comparable pieces of work. Every entry now uses one template — media
above at full width, title at `--type-entry`, deck at `--text-md`, metadata —
ruled top and bottom with symmetrical `padding-block`, so no entry crowds its
neighbour.

Order is the only remaining signal, which is why `SELECTED` in
`content/index.ts` is manual and the page states "Manual running order".
DrawEvolve, thoosie, Lynk.

The one thing that still varies by position is `priority` on the first entry's
image. That is a largest-contentful-paint loading hint, not a visual weight,
and it is invisible in the layout.

Lynk still reads as shelved — see below — but it does so through its `state`
word and its copy, not by being small.

---

## Lynk is shelved, structurally

Not a content convention, there is no code path that can render Lynk as
active:

- `links: []`. There is no live Lynk URL, and `scripts/check-links.mjs` asserts
  by name that the only two live links on this site are `drawevolve.com` and
  `thoosie.net`.
- `context: shelved` and `state: Shelved`. `state` is the **Status:** line from
  the copy, printed verbatim or not at all, the template has no vocabulary of
  its own to fall back on, so it cannot say "paused", "on hold", "in progress"
  or "upcoming".
- The old template hard-coded the string `Shelved, capability artifact` for
  any `context: shelved` entry. That is invented copy and it is gone.
- Nothing is date-sorted anywhere, so Lynk cannot drift to the top of a list
  and read as current.
- `text-transform: uppercase` was removed from the status chip. It would have
  set DrawEvolve's "Shipped to TestFlight; approved for external testing" in
  caps, which is the template editorialising a sentence it was handed.

---

## Video

`content/schema.ts` → `videoSchema`, rendered by `components/ui/Video.tsx`
(server) and `components/ui/AutoVideo.tsx` (client). Self-hosted mp4 only, no
embed, no third-party player, no tracking iframe on a site whose argument is
that you own the stack.

**Three states, one box.** The box is measured from the poster's declared
aspect ratio, so the page composes identically whether the clip is there or
not:

| State | Renders |
| --- | --- |
| mp4 present | `<AutoVideo>`, poster, muted, looped, `playsInline`, controls |
| mp4 missing | the poster frame as a still, through `<Frame>` |
| poster missing too | the same spec `<Placeholder>` as any other image, **this is the current state** |

`poster` is a required full image declaration, not an optional filename. That
requirement *is* the degradation contract.

**Autoplay is opt-in and fails closed.** The element never carries an
`autoplay` attribute; playback is started from script only when the connection
is known-good, the viewer has not asked for reduced motion, and the clip is on
screen. `navigator.connection` is the only "mobile data" signal a browser
gives and it is Chromium-only, so a missing API, `saveData`, `type:
"cellular"`, or an effective type of 3g or worse all mean *no autoplay*. On an
unknown connection nothing starts either. Controls are always present, so "did
not autoplay" is never "cannot play". No client JavaScript ships at all while
the mp4 is absent.

---

## Assumptions I made, confirm these

1. **Domain: `trevorriggle.design`.** Used for `metadataBase`, canonical URLs,
   the sitemap and OG image URLs. One edit in `lib/site.ts` if it is wrong.
   The last unconfirmed value in the repo.
2. **OG cards render in the fallback sans, not Instrument Serif.** `next/og`
   rasterises with satori, which needs a raw `ttf`/`otf` buffer and cannot read
   the `woff2` files `next/font` produces. To upgrade: drop a `.ttf` into
   `lib/fonts/` and pass it to the `fonts` option in `lib/og.tsx`.
3. **`REQUIRED_LIVE` in `scripts/check-links.mjs` is hard-coded** to
   `https://drawevolve.com` and `https://thoosie.net`. If a project goes away,
   delete its line there in the same commit, it should take a decision, not a
   drift.
4. **ESLint still cannot lint the `.tsx` files.** `typescript-eslint` throws on
   TypeScript 7, which this repo pins. `pnpm typecheck` and `next build` both
   type-check the whole project.
5. **`playwright-core` is deliberately NOT a dependency.** It would be
   installed on every deploy for `scripts/check-viewports.mjs`, which never runs
   there. The script tells you how to install it when you want to run it, and
   exits 2 rather than throwing when it is absent.

## Verified, not assumed

Run on a clean `.next`:

- `pnpm typecheck` clean. `pnpm build` exit **0**, 20 prerendered routes, no
  warnings, and **no build-time content validation left to fail.**
- `node scripts/check-links.mjs --probe`: both live links **200**, absolute.
- **Zero** occurrences of `TODO`, `lorem`, `[[NEEDS`, "coming soon" or any
  placeholder text in the built HTML of any page.
- **All three design category pages render with an empty folder**, and no grid
  element at all. American Scientific and Taranto's have no copy either, so
  those two render a heading and the pager and nothing between them — no empty
  `<p>` in the built HTML, checked.
- The folder convention was tested end to end when this section was five
  categories by medium: five PNGs of ratios 3.08 / 0.77 / 1.00 / 2.10 / 1.50
  dropped into what was then `public/design/print/` produced five grid items in
  filename order at spans 12 / 4 / 4 / 8 / 6, with alt text derived from each
  filename and `05.png` correctly falling back to the category title. Files
  removed afterwards. That folder is retired, but the convention it exercised
  is unchanged and still reads `public/design/<category>/`.
- 375px: no horizontal overflow on `/`, `/design`, `/work/drawevolve`,
  `/about` or `/contact`. **Not re-checked** against the retired category
  routes, which no longer exist, or against the three that replaced them.
- Case study bodies still verbatim against `portfolio-copy.md`.
- Lynk carries no external link and no status word but "Shelved".

### Known gap

`design-work-copy.md` **is not in the repository.** `content/design.ts` has
`body: []` and `demonstrates: ""` on all three categories, `intro: ""` on
American Scientific and Taranto's, and `designLanding.body` is empty. Nothing was invented to fill them and nothing renders in their place.
Paste the copy into those fields and the elements appear with no other edit.
