# Decisions

What I chose, and why. Anything I resolved without you is in
[Assumptions](#assumptions-i-made-confirm-these) at the bottom, those are the
lines to read first.

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

## The masthead is gone

There is no masthead. The home page is a 2x2 of four tiles and nothing else,
so the accent bar, the headline, the subhead and the vitals rail are all out of
the build. What this section used to record, the three elements sharing a left
axis at 79 / 73 / 79px and the optical pull on the headline, describes a page
that no longer exists.

The accent has not lost its loudest appearance to nothing in particular: it now
carries the tile titles on hover and the focus ring, and the solid bar is
simply not on the page any more.

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
because anything was wrong with it. It was written as the site's opening
statement, not as an introduction to three case studies, so it did not travel
to `/applications` with the set it used to sit above. It is not parked anywhere
in the build. Put it back by adding it above the grid in `app/page.tsx`.

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

**Nothing is centred.** `Container` sets `margin-inline: 0` and only takes the
slack on both sides past 118rem. Concretely, on the page:

- the home hero hangs at the left edge and **overhangs** its own subhead, which
  is pushed to column 4
- case study prose starts at **column 3**, so the left margin carries the
  structure rather than being dead padding
- the lead media on a case study is **full bleed**, edge to edge, the only
  element on the site allowed to touch the viewport
- Selected Work rank 1 mirrors rank 0 (media right, text left) so the three do
  not read as a repeating template
- plates alternate between an indented measure and a right bleed

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

### 112 MB of GIFs became 8 MB of MP4

The American Scientific archive is partly animated: web banners, animated
social posts, a logo build. They arrived as GIFs totalling **112.5 MB**, one of
them **47.8 MB by itself**. `next/image` does not optimise animated GIFs, it
passes them through untouched, so every one of those bytes would have shipped
to every visitor, on a page a recruiter might open on a phone.

Transcoded to h264 MP4 at CRF 26: **8.0 MB for the set, a 93% reduction**, with
the animation intact and a poster frame extracted from frame one. No GIF ships.
The masters are untouched in the ignored source folder.

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
| Footer one-liner | `components/ui/Footer.tsx` | Deleted. The footer is name, domain, year, colophon. |
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
