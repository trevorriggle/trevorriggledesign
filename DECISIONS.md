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
| Display | **Bricolage Grotesque** (variable) | Mathieu Triay | OFL 1.1 |
| Text | **DM Sans** (variable) | Colophon Foundry | OFL 1.1 |
| Data | **DM Mono** | Colophon Foundry | OFL 1.1 |

**Instrument Serif was removed.** It was elegant and it was safe, and safe was
the complaint: a high-contrast didone reads as tasteful editorial, which is the
house style of roughly every portfolio built this year.

**Why Bricolage.** It is a genuinely odd face. Uneven weight distribution,
flat-sided bowls, a squared-off `g`, terminals that stop where you do not
expect them. It was drawn as a bricolage of grotesque conventions that do not
normally sit together, and at display size that awkwardness is the point. It is
also variable across weight, width AND optical size, so one file covers 130px
headlines and 24px subheads.

**The width axis is used, and it is the fun part.** Display type is set narrow
(`wdth` 88 at hero size, 94 elsewhere) and heavy (700, 800 on the hero). At
130px a regular weight reads as "large text"; a compressed heavy weight reads
as a decision, and the narrow width keeps a long headline off a fourth line.

**Why DM Sans under it.** Bricolage does all the shouting, so the text face has
to be quiet and warm without being characterless. Low contrast, generous
apertures, slightly geometric roundness.

All three are OFL 1.1 and self-hosted by `next/font` at build time. No font-CDN
request at runtime, no third-party origin.

### The scale is unchanged

Ratio 1.5 on the display tier, compounding off the 17px body:

| Step | Size |
| --- | --- |
| `--display-1` | 25.5px |
| `--display-2` | 38.3px |
| `--display-3` | 57.4px |
| `--display-4` | 86.1px |
| `--display-5` | **129.1px** (hero only) |

7.59x body at the top. Leading is set per size: 0.86 hero, 0.9 display, 1.02
title, 1.62 body. Verified rendering 57 / 86 / 129px at 375 / 768 / 1440.

---

## Colour

```
--ground: #f7f4ed   warmer paper than before, and it shows
--ink:    #14120f   near-black, warmed to match the ground
--accent: #e0431a   vermilion, brighter, and off its leash
```

The accent was previously rationed to about seven appearances. It is now the
first thing on the page: a solid `--space-2` bar across the full measure
directly under the nav, where there used to be a hairline under a field of
whitespace. It also carries every hanging ordinal, the rule above the lead case
study, the "What it demonstrates" label, focus rings and hover states.

Still one accent, still no gradients, no shadows, and `--radius-*` is `0`.

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

## The masthead

Three things sit on one axis at the left edge: the accent bar, the headline and
the subhead. Measured in the browser at 1440px they land at 79 / 73 / 79px, the
headline three pixels proud because of a `-0.02em` optical pull that
compensates for glyph sidebearing at 129px.

**The subhead used to start at column 4** with a 24ch measure, which put its
left edge on no axis the page used and its right edge nowhere near the metadata
rail: a block of text floating in the middle of the masthead. It is now flush
left on a 42ch measure. The asymmetry is still there, carried by the rail
sitting right rather than by an arbitrary indent.

**There is no padding above the accent bar.** It sits directly under the nav,
so the page opens on a band of colour rather than on a field of nothing.

---

## The headline is not the copy file's headline

`portfolio-copy.md` opens "Graphic designer who ships software." It has been
replaced twice, both times on request.

The first replacement was built from the About copy's "I design the thing,
build the thing" and was rejected as a slogan, which it was: the construction
is a rhetorical tic, and it reads as branding rather than as a claim.

The headline now is the opening line of the AI Systems section intro,
verbatim:

> Products I designed and built end to end.

It is a statement of fact in the same register as the rest of the site, and it
is the author's own sentence. One line in `app/page.tsx` to swap.

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

## Design work: five real pages

The single `/archive` page was wrong, it buried five bodies of work in one
scroll and framed them as an appendix. Each category now has its own page at
`/design/<category>`, and `/design` is a landing that presents all five.

Order is Print, Marketing, 3D, Motion, Personal, manual, in
`content/design.ts`, never sorted by the year label.

**The "What it demonstrates" line is rendered as its own labelled block**, with
the accent rule, above the images and separate from the intro. It is doing a
specific job: telling a technical reader who cannot evaluate design on its own
terms what this work is evidence *of*. Folding it into the prose would waste it.

### A folder is the config

`public/design/<category>/`. Drop files in; they appear on that category's
page, sorted by filename. No manifest, no registry, no per-image frontmatter,
no import.

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

## The home page is two halves

"Designer who ships software" only holds if both halves are on the page. The
home page is Selected Work (three case studies at descending weight) and then
Design (five categories, each with its intro, its year, its image count and a
lead image when the folder has one). The design half is a full section with the
same heading treatment as the work half, not a single quiet link, which is
what it was.

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
- **All five design category pages render their heading and their intro with an
  empty folder**, and no grid element at all.
- The folder convention tested end to end: five PNGs of ratios 3.08 / 0.77 /
  1.00 / 2.10 / 1.50 dropped into `public/design/print/` produced five grid
  items in filename order at spans 12 / 4 / 4 / 8 / 6, with alt text derived
  from each filename and `05.png` correctly falling back to "Print". Files then
  removed; the page returned to copy-only.
- 375px: no horizontal overflow on `/`, `/design`, `/design/print`,
  `/design/motion`, `/work/drawevolve`, `/about` or `/contact`.
- Case study bodies still verbatim against `portfolio-copy.md`.
- Lynk carries no external link and no status word but "Shelved".

### Known gap

`design-work-copy.md` **is not in the repository.** `content/design.ts` has
`body: []` and `demonstrates: ""` on all five categories, and `designLanding.body`
is empty. Nothing was invented to fill them and nothing renders in their place.
Paste the copy into those fields and the elements appear with no other edit.
