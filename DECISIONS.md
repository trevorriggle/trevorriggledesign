# Decisions

What I chose, and why. Anything I resolved without you is in
[Assumptions](#assumptions-i-made-confirm-these) at the bottom — those are the
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
was designed — and that is what you were looking at.

There is now zero `prefers-color-scheme` anywhere in the project (verified
against the built CSS, not just the source), `color-scheme: light` is declared
on `:root`, and `app/layout.tsx` sends one unconditional `themeColor`. The page
is one colour on every device.

---

## Type

| Role | Face | Foundry | Licence |
| --- | --- | --- | --- |
| Display | **Instrument Serif** | Instrument | OFL 1.1 |
| Text | **Geist** | Vercel | OFL 1.1 |
| Data | **Geist Mono** | Vercel | OFL 1.1 |

Two families. Geist Mono is a cut of Geist, drawn on the same skeleton, so
tabular data costs no second family — the same argument the previous build made
for IBM Plex, and still the right one.

**Loading.** `next/font/google` fetches the woff2 files at BUILD time and serves
them from this domain. No font-CDN request in the runtime waterfall, no
third-party origin in the privacy story. Instrument Serif is loaded at weight
400 only (it ships one weight); Geist and Geist Mono are variable, so the whole
range arrives in one file each. Display and text preload; mono does not, because
it appears below the fold on the pages that use it at all.
`adjustFontFallback` is on for the serif — it is 129px in places, and an
unadjusted fallback would shift the layout visibly on a slow connection.

**One weight on the display face is a feature.** Instrument Serif has no bold.
Every display decision on this site is therefore a SCALE decision, which is what
stops the hierarchy leaning on weight — the reflex that produced the flat page
you were looking at.

### The scale: ratio 1.5, and where the 6x came from

Two tiers, and the split is deliberate.

**Display tier — ratio 1.5**, compounding off the 17px body:

| Step | Size | Used for |
| --- | --- | --- |
| `--display-1` | 25.5px | h3, entry titles, prose subheads |
| `--display-2` | 38.3px | section titles at their small end |
| `--display-3` | 57.4px | page titles at their small end |
| `--display-4` | 86.1px | page titles, case study titles |
| `--display-5` | **129.1px** | the home hero, and nothing else |

`--display-5 ÷ 17px = 7.59x`. The brief asked for at least 6x.

**Text tier — ratio ~1.14**, 11px to 21px. A 1.5 step between a 12px label and
the next size is 18px, and there is no 18px UI on this site. The steep ratio is
for display, where it does work; using it for labels would produce a scale with
holes in it.

**Every fluid role is clamped between two real steps**, so the scale still holds
at any viewport — the type gets smaller on a phone, it does not fall out of the
system:

```
--type-hero:    clamp(display-3, 11.2vw, display-5)    57 → 129px
--type-title:   clamp(display-2, 7.6vw,  display-4)    38 →  86px
--type-section: clamp(display-1, 4.4vw,  display-3)    26 →  57px
--type-entry:   clamp(display-1, 3.4vw,  display-2)    26 →  38px
```

**Leading is set per size, never globally**: `0.9` on the hero, `0.94`–`1.02` on
display, `1.18` snug, `1.62` on body prose. One global line-height applied from
an 11px label to a 129px headline is the tell that a type system was never
designed — at 129px, 1.45 leading opens a hole you could park a car in.

Verified at three viewports with `pnpm check:viewports`: hero renders 57px at
375, 86px at 768, 129px at 1440, and no page scrolls horizontally at any of
them.

---

## Colour

Three values. That is the whole palette:

```
--ground: #faf8f5   warm off-white
--ink:    #111111   near-black
--accent: #c42b12   vermilion
```

Contrast, measured: ink on ground **17.8:1**; accent on ground **5.35:1**; the
single muted tone (`#686766`) **5.32:1**. All pass AA for normal text.

**There is no grey ramp.** The previous build declared seven tints of ink mixed
into paper and used them for hierarchy — `--color-text-quiet`,
`--color-text-meta`, `--color-text-faint` — which is how a layout ends up
looking like fog. There is now ONE muted tone, used only for genuine metadata.
`--color-text-quiet` still exists as an alias so components did not all need
rewriting, and it deliberately resolves to **full ink**: long copy set in grey
is the most common way a portfolio reads as unfinished.

**The accent is rationed.** It appears on: the rule above the home hero, the
rule above the lead case study, the closing line of /about, focus rings, hover
states, the `[[NEEDS]]` hazard block, and the word "Shelved". That is the
complete list. An accent that shows up in every component is decoration; one
that shows up rarely is a mark.

No gradients, no shadows, no glassmorphism, and `--radius-*` is `0` throughout.

---

## Space and composition

**The spacing scale jumps at the top** — `--space-9` is 120px, `--space-10` is
176px, `--space-11` is 256px — because uniform vertical rhythm was half of why
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
- the lead media on a case study is **full bleed**, edge to edge — the only
  element on the site allowed to touch the viewport
- Selected Work rank 1 mirrors rank 0 (media right, text left) so the three do
  not read as a repeating template
- plates alternate between an indented measure and a right bleed

---

## Content model

### The case-study schema is an editorial instrument

Five required fields, in the order they must be read: **constraint → what failed
→ tradeoff → outcome → revisit**. Rendered as a numbered argument (`01`–`05`),
which reads as a line of reasoning rather than a set of headings.

Three mechanisms make it hard to write a product landing page:

1. **The tradeoff is three separate strings** — `chose`, `instead_of`, `cost`.
   One string lets you write the flattering half and stop. `cost` is required
   and gets the accent.
2. **`attempts` pairs each dead end with why it failed.** One without the other
   does not validate.
3. **Every narrative field is capped** (200–300 characters). A feature list does
   not fit in 220 characters; a claim does. The long version goes in the MDX
   body.

**`revisit` is the field you asked for** — *what I'd do differently* — and it is
required. It cannot be filled without conceding something did not go well.

**`outcome.evidence` is optional on purpose.** An absent metric is defensible in
an interview; an invented one is not.

### Fields that are rejected by name

`roadmap`, `features`, `problem`, `solution`, `challenge` and `highlights` fail
the build with a sentence explaining what to write instead. There is no roadmap
field and I will not add one.

This runs on the **raw frontmatter**, before Zod — Zod strips unknown keys
during parsing, so a check attached to the schema is handed an object with
`roadmap` already removed and reports nothing. (I found that by testing it: the
first version silently passed.) The schemas are also `strictObject`, so a
misspelled field — `tradeof:`, `reviist:` — fails rather than being dropped and
rendering as missing.

### AI-shaped optional structure

- **`architecture`** — renders as a typographic system diagram: a flow chain of
  mono nodes plus a stage table, with node weight encoding kind (`client`,
  `edge`, `service`, `model`, `store`, `job`). It is *content*, not ornament —
  the ids, labels and flow are frontmatter — so the architecture is legible with
  **zero images**. `architecture.diagram` is an optional slot for a drawn
  version; when both exist the drawing leads and the stage table captions it.
- **`models`** — the provider row, with a `why` column. A model choice without a
  reason is trivia.
- **`budget`** — `latency` / `cost` / `throughput` / `memory` / `frame-time`,
  with `target`, optional `measured`, and `method`. An unqualified number is not
  evidence, so there is a field for how it was measured.
- **`failureModes`** — *what the system does when the model is wrong*, as
  `when` / `then` / `surfaced` triples. Given its own block with the accent rule
  because it is the question that separates someone who has shipped an AI
  feature from someone who has demoed one. `surfaced` exists because silent
  recovery is a design decision too.

### The gallery schema is deliberately thin

Title, section, year, medium, optional caption, images. No constraint, no
tradeoff, no required narrative. A 2021 print piece does not need a decision
log, and giving it one would flatten the difference between it and the systems
work — which is the whole point of the section order.

`medium` is free text rather than an enum, because the vocabulary across 3D,
motion, print, marketing and personal work is open-ended and an enum there would
mean editing code to add a technique.

---

## Ordering

`content/sections.ts` holds the seven sections as an array. `content/order.ts`
holds the entry order within each. **Position in an array is the only thing that
decides position on the site.** Nothing anywhere sorts by date — you can verify
that: there is no `sort`, no date comparison and no `Date` parsing in the
content layer at all. `years` on a section is a display label and is documented
as never being parsed.

To reorder the site, move a line.

The loader fails the build in both directions: a slug in `order.ts` with no
folder, and a **published** entry missing from `order.ts`. Without the second
check, a new case study has no position and silently vanishes.

---

## Images with no images

This is the load-bearing decision in the codebase.

**Images are referenced by public path, not statically imported.** A static
import of a nonexistent file is an unrecoverable module-resolution error, which
would make "buildable with zero assets" impossible. A public path is just a
string until the file arrives.

So every image is *declared* in frontmatter with `src`, `alt`, `aspect`,
`minWidth` and `label`, and the loader marks it `exists: true/false` by checking
`public/media/<slug>/<src>`. One component — `components/ui/Frame.tsx` — is the
only place the site decides between a real image and a placeholder, which makes
"drop the file in and change nothing else" true by construction rather than by
discipline.

**What this costs, stated honestly:** intrinsic dimensions come from frontmatter
rather than from the file, which is why `aspect` and `minWidth` are required
fields. And there is no automatic blur placeholder, since that needs the file at
build time. In exchange there is no layout shift either before or after a real
file lands, and a typo'd filename is a visible placeholder rather than a silent
404.

**`<Placeholder />` is a spec plate, not an error state.** Ruled box at the
declared ratio, registration ticks at two corners, a very low-contrast 45° hatch
that reads as "reserved area" on a technical drawing, and the four facts needed
to produce the asset: the filename to save as, the ratio, the minimum export
size, and what the image must show. It carries the real `alt` text as its
accessible name, so a screen reader gets the same description it will get once
the file exists. Small plates in a dense grid drop the label via container
queries rather than overflowing.

`MANIFEST.md` is generated from the same frontmatter on every build, so the
shopping list and the page can never disagree. **15 images currently declared,
0 present.**

**Mixed aspect ratios are preserved, never letterboxed.** The gallery grid is
six columns and each image claims a span computed from its declared ratio —
portraits and squares take 2, landscapes 3, panoramas all 6 — with dense
auto-flow closing the gaps. Images keep their true proportions while the page
still reads as a composed grid. The span is computed server-side from
frontmatter, so it is identical before and after the files land.

---

## Structure: two tiers, five routes

The old organisation was inherited from Adobe Portfolio — six categories by
MEDIUM, sorted by year. That organises work by which tool made it, which is the
one axis a hiring team does not care about, and it left the reader to assemble
the argument.

**Tier 1 — Selected Work.** Three case studies with full pages, full visual
weight, presented on the home page at descending weight. Manual order, hardcoded
in `content/order.ts`: DrawEvolve, thoosie, Lynk.

**Tier 2 — Archive.** One page. The five former categories are anchored sections
inside it, in manual order. One line of copy per section — the section intro from
`portfolio-copy.md`, verbatim — then a grid. No per-project routes.

### Routes, exactly

```
/                  home — hero, three case studies, one archive line
/work/drawevolve   ┐
/work/thoosie      ├ Tier 1
/work/lynk         ┘
/archive           Tier 2, five anchored sections
/about
/contact
404
```

`/work` as an index is **deleted**, along with `app/work/page.tsx`, its OG route,
and the now-dead `EntryRow`, `SectionIndex` and `SectionHead` components.

**Nav.** Three labels, exactly as the copy specifies. "Work" points at
`/#selected-work` rather than a `/work` route that no longer exists. The archive
is reachable from the home page and the footer — adding a fourth nav label would
mean inventing one, and the copy gives three.

**Two clicks, maximum.** Home → any case study is one click. Home → archive →
any set is two.

### Redirects — every one verified returning 308

| Old | New |
| --- | --- |
| `/work` | `/` |
| `/full-stack-development` | `/work/drawevolve` |
| `/social-media` | `/archive#marketing` |
| `/spreads` | `/archive#print` |
| `/illlustrations`, `/illustrations` | `/archive#personal-works` |
| `/animations`, `/motion` | `/archive#motion-graphics` |
| `/3d` | `/archive#3d-graphics` |
| `/abbott` | `/archive` |

Anchors survive a 308 because the fragment is never sent to the server — the
browser reapplies it to the destination. Every anchor target was verified
present in the built HTML.

**`/abbott` is the one I could not resolve.** It is a client name, not a medium,
so which archive section it belongs to is not derivable from anything in the
repo. It lands at the top of `/archive` rather than guessing an anchor and
sending someone to the wrong section. One line in `next.config.ts` when you
confirm it.

### The archive grid

Built for mixed aspect ratios, because the real content is wide print spreads,
square social posts, tall phone screenshots and 3D renders. The wrong answer is
a uniform 16:9 tile grid, which letterboxes all four.

Each item's column SPAN is chosen from its declared ratio on a 12-column grid —
3 columns for a tall portrait, 4 for a square, 6 for a landscape, 8 for a wide
spread, 12 for a panorama — and its height is whatever the ratio produces.
Nothing is cropped. `grid-auto-flow: dense` lets a narrow item backfill the gap
a wide one left, so the page stays tight without anything being resized to fit.

**Lazy loading** is explicit in `Frame`: `loading="lazy"` unless a slot is
marked as its page's LCP candidate. On `/archive` only the first set is eager.

**No lightbox.** A broken one is worse than none, and a good one is a
keyboard-trap surface, a focus-restore problem and a scroll-lock problem for a
page whose job is to be skimmed. Images render at their real proportions
instead.

---

## The link bug

Routes are `/`, `/work/[slug]`, `/archive`, `/about`, `/contact` and a real 404.

**Four layers now prevent the broken-external-link bug**, because a relative
path in a "Live demo" href fails silently and looks like a working link:

1. `content/schema.ts` rejects any content href that is not an absolute
   `https://` URL with a real hostname — bare domain, protocol-relative `//`,
   plain `http://`, and a literal `TODO` all fail.
2. `components/ui/ExternalLink.tsx` throws on a non-absolute href, covering
   hand-written links in page code that the schema never sees.
3. `scripts/check-links.mjs` runs in `prebuild` and **fails the build**. It
   scans content frontmatter, every `href="…"` in `app/`, `components/` and
   `lib/`, **and the MDX prose bodies** — which the schema never sees, because
   they are not frontmatter.
4. `REQUIRED_LIVE` in that script asserts by name that `https://drawevolve.com`
   and `https://thoosie.net` are present and absolute. Validating the links that
   happen to exist cannot catch a live link that has gone *missing*.

Dead-but-well-formed URLs are reported, not fatal: `pnpm check:links` probes
them over the network. A third-party host being down at 3am should not fail a
deploy.

---

## Wiring in portfolio-copy.md

`portfolio-copy.md` is the copy. It was routed, not edited: nothing in it was
rewritten, paraphrased, expanded or condensed, no new prose was written to fill
a gap, and the file itself is untouched on disk.

A build-time proof of that is worth having, so here is how to re-run it — it
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
| Home opening statement | `app/page.tsx` — headline + subhead |
| Nav labels | `lib/site.ts` → `nav` (already matched) |
| Meta description | `lib/site.ts` → `description`; used on every page and both OG cards |
| 404 | `app/not-found.tsx` |
| Contact page | `app/contact/page.tsx`, address in `lib/site.ts` |
| About body | `app/about/page.tsx` — four paragraphs |
| Section intros ×6 | `content/sections.ts` → `standfirst` |
| Case studies ×3 | `content/work/<slug>/index.mdx` |
| **Subtitle:** / **Role:** / **Status:** / **Timeline:** / **Live:** | frontmatter `deck` / `role` / `state` / `timeline` / `links` |

### The four edits I made to the structure, and why

**1. The case-study spine is now optional.** `constraint`, `attempts`,
`tradeoff`, `outcome` and `revisit` were required, capped at ~220 characters
each, and were the mechanism that forced a decision log to exist when this repo
had no copy. The copy is written as prose under its own headings — "The
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
is the `h1`, so its own sections are `h2`. Document structure, not copy — no
word, no punctuation and no ordering changed.

### Things the copy does not cover, that a component wanted

None of these render a placeholder. Every one of them is a component that
correctly renders *nothing* when the value is absent, so the gap is invisible
to a visitor and one edit away from filled. **One exception, and it is
visible** — the first row.

| Gap | Where | What renders now |
| --- | --- | --- |
| Home eyebrow label | `app/page.tsx` | The slot is deleted. The copy has no label line above the headline. |
| Home / About / Contact rail: "Based", "Focus", "Looking for" | `lib/site.ts` → `location`, `availability` | Rows omitted. Fill either constant and every row reappears. |
| Footer one-liner | `components/ui/Footer.tsx` | Deleted. The footer is name, domain, year, colophon. |
| Footer "Elsewhere" | `lib/site.ts` → `social` | Whole block omitted rather than showing an empty heading. |
| /work index standfirst | `app/work/page.tsx` | Omitted. The six section intros do that job. |
| About rail chips | `app/about/page.tsx` | Deleted. Filling "Building with" / "Designing with" / "Shipped on" would mean mining tool names out of your prose and re-setting them as tags you did not write. |
| Lynk's year | `content/work/lynk/index.mdx` | Absent — `year` is now optional. The copy gives Lynk no date. |
| Gallery entries, all six sections | `content/gallery/` | Each section renders its heading and its intro, then stops. The scaffolding note is dev-only. |

**Derived, so I did build it:** per-page titles and OG images from frontmatter;
`year` on DrawEvolve (`2025–26`, from its **Timeline:** line) and thoosie
(`2026`, from "Launched August 2026" in its own Outcome copy); `stack` chips on
DrawEvolve (Swift, Metal, Cloudflare Workers, Supabase — each named in that
case study's copy; thoosie and Lynk name none, so theirs are empty).

### Nothing is unfilled any more

Every field above was supplied by the author and filled. `social` is the one
that stayed empty, and deliberately: no real profile URL was supplied, and a
guessed GitHub or LinkedIn handle is a link that 404s in front of a hiring
manager — the exact failure the link check exists to prevent. The footer
"Elsewhere" block and the contact rail render nothing at all while it is empty,
so there is no placeholder anywhere on the site.

The placeholder guard now reports `Placeholders: none` on a production build.

### One design rule that came out of this

**The home page does not render spec placeholders.** Everywhere else, a
declared image with no file renders as a `<Placeholder />` carrying its
filename, ratio and content spec — that is what makes the site reviewable with
zero assets, and it stays. But when thoosie joined Selected Work, its poster
plate landed on the front door, printing *"what must this image show? /
01-gameplay-poster.png / ≥2400×1350"* to whoever opened the site.

`SelectedWork` now shows a media slot only when a real file exists and collapses
to type when it does not. The layout already handled that case — the lead has no
cover today. The spec plate is still on the case study page, where it is a note
from the author to the author and belongs.

## Lynk is shelved, structurally

Not a content convention — there is no code path that can render Lynk as
active:

- `links: []`. There is no live Lynk URL, and `scripts/check-links.mjs` asserts
  by name that the only two live links on this site are `drawevolve.com` and
  `thoosie.net`.
- `context: shelved` and `state: Shelved`. `state` is the **Status:** line from
  the copy, printed verbatim or not at all — the template has no vocabulary of
  its own to fall back on, so it cannot say "paused", "on hold", "in progress"
  or "upcoming".
- The old template hard-coded the string `Shelved — capability artifact` for
  any `context: shelved` entry. That is invented copy and it is gone.
- Nothing is date-sorted anywhere, so Lynk cannot drift to the top of a list
  and read as current.
- `text-transform: uppercase` was removed from the status chip. It would have
  set DrawEvolve's "Shipped to TestFlight; approved for external testing" in
  caps, which is the template editorialising a sentence it was handed.

---

## The placeholder guard

Two strings must never reach a visitor:

- `[[NEEDS: …]]` — a fact only you can supply.
- `TODO` — an unfilled content field. In frontmatter it becomes alt text or a
  `<Placeholder>` spec line, and **both ship**.

### Environment-aware

| Environment | Behaviour |
| --- | --- |
| production | **fail**, exit 1, every occurrence with file and line |
| preview | warn, exit 0 |
| development | warn, exit 0 |

Resolution order: `ALLOW_PLACEHOLDERS=1` never fails and prints a loud warning
listing everything it let through; otherwise `VERCEL_ENV` decides; otherwise —
**no `VERCEL_ENV` is treated as production and fails.**

That last default is deliberate. A local `pnpm build` *is* a production build,
it is what gets deployed from a laptop in a hurry, and a checker that silently
degrades to "warn" when it cannot identify its environment is a checker that
never fires. `pnpm dev` never runs it, so iteration is unaffected either way.

### What is scanned, and why not simply everything

- **`[[NEEDS`** — every file under `content/`, including `.ts` files and YAML
  comments. A marker pasted anywhere in that tree is the same broken promise.
- **`TODO`** — content `.mdx` files, `content/sections.ts` and `lib/site.ts`
  only. Those are the strings that render. A `// TODO:` in a schema doc comment
  is a note to a developer, and failing a deploy for one would train everybody
  to reach for the escape hatch. `_template` folders are skipped for `TODO`
  — being a sheet of TODOs to copy from is their entire purpose.

The guard caught two of its own false positives during this build (an
explanatory comment in `content/index.ts`, another in thoosie's frontmatter).
Both were reworded rather than exempted, which is the right direction: the
scanner stayed strict.

### In dev, a marker is loud

`components/ui/Needs.tsx` renders one as a hazard-striped block in the accent
colour with its own text. The text reaches the component as a **plain
entity-escaped attribute**, which looks over-careful and is not:
`<Needs>{"…"}</Needs>` and `<Needs text={"…"} />` were both tried first, and
compiled through next-mdx-remote's RSC entry both arrive with nothing — a
correctly-styled block with no text in it, which is worse than no marker. Only a
quoted attribute survives.

---

## Video

`content/schema.ts` → `videoSchema`, rendered by `components/ui/Video.tsx`
(server) and `components/ui/AutoVideo.tsx` (client). Self-hosted mp4 only — no
embed, no third-party player, no tracking iframe on a site whose argument is
that you own the stack.

**Three states, one box.** The box is measured from the poster's declared
aspect ratio, so the page composes identically whether the clip is there or
not:

| State | Renders |
| --- | --- |
| mp4 present | `<AutoVideo>` — poster, muted, looped, `playsInline`, controls |
| mp4 missing | the poster frame as a still, through `<Frame>` |
| poster missing too | the same spec `<Placeholder>` as any other image — **this is the current state** |

`poster` is a required full image declaration, not an optional filename. That
requirement *is* the degradation contract.

**Autoplay is opt-in and fails closed.** The element never carries an
`autoplay` attribute; playback is started from script only when the connection
is known-good, the viewer has not asked for reduced motion, and the clip is on
screen. `navigator.connection` is the only "mobile data" signal a browser
gives and it is Chromium-only — so a missing API, `saveData`, `type:
"cellular"`, or an effective type of 3g or worse all mean *no autoplay*. On an
unknown connection nothing starts either. Controls are always present, so "did
not autoplay" is never "cannot play". No client JavaScript ships at all while
the mp4 is absent.

---

## Assumptions I made — confirm these

1. **Domain: `trevorriggle.design`.** Used for `metadataBase`, canonical URLs,
   the sitemap and OG image URLs. One edit in `lib/site.ts` if it is wrong.
   The last unconfirmed value in the repo.
2. **OG cards render in the fallback sans, not Instrument Serif.** `next/og`
   rasterises with satori, which needs a raw `ttf`/`otf` buffer and cannot read
   the `woff2` files `next/font` produces. To upgrade: drop a `.ttf` into
   `lib/fonts/` and pass it to the `fonts` option in `lib/og.tsx`.
3. **`REQUIRED_LIVE` in `scripts/check-links.mjs` is hard-coded** to
   `https://drawevolve.com` and `https://thoosie.net`. If a project goes away,
   delete its line there in the same commit — it should take a decision, not a
   drift.
4. **ESLint still cannot lint the `.tsx` files.** `typescript-eslint` throws on
   TypeScript 7, which this repo pins. `pnpm typecheck` and `next build` both
   type-check the whole project.
5. **`playwright-core` is deliberately NOT a dependency.** It would be
   installed on every deploy for `scripts/check-viewports.mjs`, which never runs
   there. The script tells you how to install it when you want to run it, and
   exits 2 rather than throwing when it is absent.

## Verified, not assumed

Run against the current tree, `.next` removed first:

- `pnpm typecheck` clean.
- **`pnpm build` passes with NO escape hatch and NO environment variable.**
  `Placeholders: none. (env: production)`. 15 routes, no warnings.
- `node scripts/check-links.mjs --probe`: `https://drawevolve.com` **200**,
  `https://thoosie.net` **200**, both absolute, both `rel="noopener noreferrer"`.
- **All ten redirects verified 308** to the right destination against a real
  server, anchors included — `/abbott` now lands on `/archive#3d-graphics`.
  Every anchor target confirmed present in the built HTML.
- All seven routes return 200; an unknown path returns 404.
- **Zero occurrences of `TODO`, `lorem`, `[[NEEDS` or any placeholder spec text
  in the built HTML of any page.**
- `pnpm check:viewports` at 375 / 768 / 1440: no horizontal overflow on any
  route at any width; hero measures 57 / 86 / 129px, holding its clamp floor on
  a phone rather than collapsing to body size.
- Zero `prefers-color-scheme` rules in the built CSS.
- `pnpm install --frozen-lockfile` clean after removing `playwright-core`.
- Case study bodies verified verbatim against `portfolio-copy.md`.
- Lynk carries no external link and no status word but "Shelved".
- thoosie ships no `<video>` element and no client JS for one — it degrades to
  the poster slot as designed.

### Fixed after looking at the rendered pages

Five things only a screenshot or a real build catches:

1. The footer colophon still read "Set in Fraunces & IBM Plex" after the font
   swap.
2. The case study rail printed a **Status** row carrying the same sentence as
   the status chip two inches above it.
3. `MetaLinks` stacked three labels on one link — a "Links" heading, a "LIVE"
   eyebrow, and a link labelled "Live".
4. **The Selected Work hierarchy read backwards.** DrawEvolve has no cover file
   and thoosie has a declared poster, so rank 1's placeholder was the largest
   object on the page — 736×414 against a 465px lead block. Rank 1's media slot
   is capped at five columns and the lead took the accent rule and a
   display-face deck. Lead title is now 86px against thoosie's 38px.
5. **The home page was printing an image spec plate on the front door.** See
   "One design rule that came out of this" above.
