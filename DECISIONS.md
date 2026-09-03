# Decisions

What I chose, and why. Anything I resolved without you is in
[Assumptions](#assumptions-i-made-confirm-these) at the bottom — those are the
lines to read first.

---

## Type

Two families, both SIL Open Font License 1.1, both self-hosted.

| Role | Face | Foundry | Licence |
| --- | --- | --- | --- |
| Display | **Fraunces** (variable) | Undercase Type | OFL 1.1 |
| Text | **IBM Plex Sans** | IBM with Bold Monday | OFL 1.1 |
| Metadata | **IBM Plex Mono** | IBM with Bold Monday | OFL 1.1 |

**That is two families, not three.** Plex Sans and Plex Mono are two cuts of one
superfamily, drawn together on shared skeletons. Using the mono companion of the
text face is what buys monospace metadata without spending the second family
slot — and it is why the mono sits next to the text face without the seam you
get from an unrelated mono.

**Licensing, plainly.** OFL 1.1 permits commercial use, web embedding and
self-hosting, with no fee, no attribution requirement in the interface, and no
per-domain licence. `next/font` downloads the `woff2` files at build time and
serves them from your own domain, so there is no request to a font CDN in the
waterfall and no third-party origin in the page's privacy story. Nothing here
needs a licence purchase before you deploy.

**Why Fraunces for display.** It has real idiosyncrasy — a wonky, high-contrast
old-style with a `WONK` axis that swaps in genuinely odd alternates, and a
`SOFT` axis for the terminals. That personality is doing a specific job: it
signals a person with type judgment without saying anything about technology,
which leaves the technical claims to be made by the work rather than by the
lettering. It is also a variable font, so the whole weight range plus both
optical axes arrive in one request.

The axes are driven from `--wonk-on` / `--soft-display` in `styles/tokens.css`,
not from components, so the face's personality has one knob and it is in the
token file.

**Why Plex for everything else.** Plex was drawn as IBM's corporate type
programme — engineered, slightly plain, with unusually good mono. On a site
whose argument is "I build systems," a text face from an engineering house is
honest rather than costume. It is also a face a technical reader has seen in
documentation and terminals, so it reads as neutral rather than styled.

**Where each face is allowed.** Set in `styles/typography.css`, and worth
keeping to:

- **Display** — `h1`–`h3` only, plus the entry-row titles and the contact
  address. Never a paragraph. Fraunces at paragraph length is a costume.
- **Text** — body, decks, UI, and every sentence including the ones inside data
  tables.
- **Mono** — metadata only. The rule that keeps it honest: if a string is a
  label, a year, a filename, a provider name or a measurement, it is mono. If it
  is a sentence, it is not. Mono means *this is data about the work*, never
  *this looks technical*.

`h4`–`h6` deliberately drop out of the display face into semibold text — at that
size Fraunces reads as noise rather than voice, and a third typographic voice on
one page is a ransom note.

None of the banned faces appear anywhere. There is no Inter, Poppins, Montserrat
or Roboto in the project, including in fallback stacks — the fallbacks are the
system UI stacks and Iowan/Palatino for display.

---

## Colour

Three values. That is the whole palette:

```
--paper:  #f4f1e9   warm bone
--ink:    #15140f   warm near-black
--signal: #bf3b11   vermilion
```

Every grey on the site is `color-mix(in oklab, var(--ink) N%, var(--paper))`.
There is no separate grey ramp, which means there is exactly one hue in the
system to get wrong, and the greys cannot drift out of tune with the ink as the
palette is adjusted. Change `--ink` and all seven neutrals follow.

Paper is bone, not white, and not the blue-grey `#f8fafc` that ships with every
utility-CSS starter. Ink is warm, so it reads black on screen without the
plasticky quality of `#000`.

**How the accent earns its place.** Vermilion appears in exactly eight places,
and each one is a state or a piece of meaning, never decoration:

1. Section ordinals `01`–`07` — the running order is the site's argument, so the
   numbers are the one element allowed to be loud.
2. The **cost** leg of every tradeoff — the part most portfolios delete.
3. The left rule on the *"what the system does"* column of the failure-mode
   table.
4. The **model** node in every architecture diagram — the model is the component
   that is wrong as a matter of routine, and the diagram says so at a glance.
5. The external-link mark.
6. The current-page state in the nav (paired with a rule, so it is never
   colour-only information).
7. The `404` code and the "Shelved" mark.
8. A single 56×8 bar on the OG cards.

**Dark mode** repoints the same three variables and nothing else; the derived
neutrals re-resolve for free. It follows the system preference only — there is
no theme toggle, because a toggle means client JS, a storage read on every load,
and a flash of the wrong theme before hydration, in exchange for a control
almost nobody uses.

**Absent by intent:** no gradient anywhere, no `backdrop-filter`, no
`box-shadow` used as depth, no translucency. The sticky nav is opaque paper with
one hairline. `--radius` maxes out at 2px, so nothing can become a rounded card
floating on grey.

---

## Grid

One twelve-column grid, declared once in `styles/tokens.css` and
`components/ui/grid.module.css`, used asymmetrically everywhere.

- **Content** runs columns 1–8 (1–9 on page heads). **Metadata rail** runs 9–12
  or 10–12. Text never occupies all twelve columns.
- **Nothing is centred.** `Container` sets `margin-inline: 0` — the page is
  left-weighted, and only above 100rem does the slack fall to the right, where
  the rail already lives. A centred measure and a full-bleed measure are the two
  fastest ways for a layout to look untouched.
- **The grid is visible**, by three devices used consistently:
  - a hairline on the left edge of the rail column (`.railRuled`), so the rule
    starts where the metadata starts rather than at an arbitrary page edge;
  - a **2px** rule for major section boundaries and a **1px** hairline for rows
    inside them — one visual device for separating things, at two weights;
  - mono ordinals hanging in a fixed 3.25rem left column, which is the grid made
    legible inside the reading column.
- **Density** is deliberate: 15px UI baseline, 13px mono metadata, 11px labels,
  and display leading of 0.92 at hero size so the headline locks into a block of
  texture. The space ramp jumps at the top end (36 → 56 → 88 → 136 → 208px) —
  dense up close, generous between movements. A smooth ramp blurs that contrast.
- **Phone**: every span collapses to full width and the rail becomes a ruled
  block beneath the content. The hierarchy survives; the columns do not.

### Layout choices worth naming

**The work index is a ruled list, not a card grid.** With zero images a card
grid is a grid of empty boxes. A list is a list — it reads correctly in exactly
the state the site is being designed in, scans faster for someone with eleven
portfolios open, and is the opposite of the rounded-cards-on-grey look.

**The home page has no hero image slot.** There is nothing worth putting above a
hiring team's first read, and with no assets it would be the largest placeholder
on the site. The masthead is type and metadata; then the top of the running
order; then the seven-section index. No three-column feature band, no CTA band.

**There is no scroll animation of any kind.** No fade-up, no reveal, no
observers. The only transitions are 110–180ms hover states on links and rows,
and a row acknowledges the pointer by shifting 2px *on the grid* rather than
lifting off the page.

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

## Routes and the link bug

Routes are exactly `/`, `/work`, `/work/[slug]`, `/about`, `/contact`, and a
real `404`.

**I removed the `/gallery` route** that the earlier scaffold had. You specified
five routes plus a 404, and a separate gallery route would have re-created the
split the section ordering exists to abolish. Galleries are now section groups
on `/work` and individual sets at `/work/[slug]`, sharing one slug namespace
with the case studies — so the loader asserts slug uniqueness across both
folders, since a collision would silently make one entry unreachable.

Slugs are clean and match their labels: `ai-systems`, `full-stack`,
`3d-graphics`, `marketing`, `motion-graphics`, `print`, `personal-works`.

**Three layers now prevent the broken-external-link bug**, because a relative
path in a "Live demo" href fails silently and looks like a working link:

1. `content/schema.ts` rejects any content href that is not an absolute `https://`
   URL with a real hostname — including a bare domain, a protocol-relative `//`
   URL, plain `http://`, and a literal `TODO` left in place.
2. `components/ui/ExternalLink.tsx` throws on a non-absolute href, covering
   hand-written links in page code that the schema never sees.
3. `scripts/check-links.mjs` runs as `prebuild` and **fails the build**. It
   scans content frontmatter *and* every `href="…"` in `app/`, `components/` and
   `lib/`. Content links are held to the stricter rule — a relative path in a
   content `links[]` array is always the bug, never a valid in-app link. (My
   first version of this script waved `/live-demo` through; that is fixed and
   tested.)

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
| **Poster alt text + spec** | `content/work/thoosie/index.mdx` → `video.poster` | **`TODO` is visible on the page.** See "Known visible placeholder" below. |
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

### Known visible placeholder

`content/work/thoosie/index.mdx` declares the gameplay clip's poster frame,
because the video slot requires one. Neither the file nor its `alt` and `label`
strings exist, so `/work/thoosie` renders one spec placeholder box printing
**"TODO — what must this image show?"**, with `alt="TODO"` behind it.

That is the only placeholder text reachable in the production build. Three ways
to clear it, in order of preference: save the poster at
`public/media/thoosie/01-gameplay-poster.png`; or write the two strings; or
delete the `video:` block, which removes the slot entirely. I did not write
them, because alt text is content.

---

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

## The [[NEEDS]] system

Two halves, and the second one is the point.

**In dev, a marker is loud.** `components/ui/Needs.tsx` renders it as a
hazard-striped block in the signal colour, with a `needs` tag and the marker's
own text. `withNeeds()` handles markers in frontmatter strings; `liftNeeds()`
in `components/mdx/MdxBody.tsx` handles them in prose bodies.

The marker text is passed to the component as a **plain entity-escaped
attribute**. This looks over-careful and is not: `<Needs>{"…"}</Needs>` and
`<Needs text={"…"} />` were both tried first, and compiled through
next-mdx-remote's RSC entry both arrive with nothing — a correctly-styled
hazard block with no text in it, which is worse than no marker at all. Only a
quoted attribute survives. Escaping `"`, `<`, `>`, `{` and `}` is what lets a
marker contain quotes and dashes without breaking the MDX parse.

**In production, a marker breaks the deploy.** `scripts/check-needs.mjs` runs
first in `prebuild` and exits 1 if the literal string appears anywhere under
`content/`, printing the file and line of each. It scans *every* file in that
tree — not just MDX bodies, not just frontmatter — so a marker pasted into a
section standfirst, an alt string or a YAML comment fails too. It caught a
comment in `content/index.ts` during this build, which is the check working.

**There is no escape hatch, deliberately.** No environment variable, no flag.
A switch that turns this off is a switch that gets set once, in a hurry, on the
day it matters, and never unset.

I also removed the module-level parse cache in dev (`content/index.ts`). It was
never invalidated, so editing an MDX file changed nothing on screen until the
dev server was restarted — which defeats the entire purpose of rendering
markers in dev. Production still parses once per process.

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
   Still the highest-consequence unconfirmed value in the repo.
2. **The three case studies are `status: published`.** They have real copy now,
   so they render in production. The gallery sections have no entries at all.
3. **Legacy redirects are partly guesses.** `/social-media` → Marketing,
   `/spreads` → Print and `/illlustrations` → Personal Works come from you.
   `/illustrations`, `/motion` and `/3d` were added on the assumption they
   exist. `/work#full-stack` no longer resolves to a section — nothing
   redirected there, so nothing broke, but the section id is gone.
4. **OG cards render in the fallback sans, not Fraunces.** `next/og`
   rasterises with satori, which needs a raw `ttf`/`otf` buffer and cannot read
   the `woff2` files `next/font` produces. To upgrade: drop a `.ttf` into
   `lib/fonts/` and pass it to the `fonts` option in `lib/og.tsx`.
5. **The home page features the top 3** entries of the running order
   (`HOME_FEATURED_COUNT` in `content/sections.ts`), which is now exactly the
   three case studies.
6. **`REQUIRED_LIVE` in `scripts/check-links.mjs` is hard-coded** to
   `https://drawevolve.com` and `https://thoosie.net`. Validating the links
   that happen to be present cannot catch a live link that has gone *missing*,
   which is the failure you described. If a project genuinely goes away, delete
   its line there in the same commit — it should take a decision, not a drift.
7. **ESLint still cannot lint the `.tsx` files.** `typescript-eslint` throws on
   TypeScript 7, which this repo pins. `pnpm typecheck` and `next build` both
   type-check the whole project. Unchanged from before; the fix is still one
   line in `package.json` plus the config in `eslint.config.mjs`.

## Verified, not assumed

Run on the current tree:

- `pnpm typecheck` clean. `pnpm build` clean — 16 routes, no warnings.
- **The `[[NEEDS]]` guard was demonstrated failing a production build** with
  all five markers in place, naming each file and line, before any were
  removed.
- The dev marker block was verified rendering its own text on a live page —
  and two earlier implementations that rendered an *empty* block were caught
  and fixed by that check rather than shipped.
- `node scripts/check-links.mjs --probe`: both live links `200`, both absolute.
- Every `href` in the built HTML is absolute-https, `mailto:`, rooted, or a
  fragment. No bare domain, no protocol-relative URL, no relative external.
- All six routes return the right status in dev, including `404`.
- Lynk's built page contains no external link and no status word other than
  "Shelved".
- thoosie's built page contains no `<video>` element and no client JS for one —
  it degrades to the poster slot as designed.
- Case study bodies verified verbatim against `portfolio-copy.md` by the script
  at the top of this section.

