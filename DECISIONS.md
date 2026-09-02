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

## Assumptions I made — confirm these

Nine things I resolved on my own. Numbers 1–4 are the ones that could be wrong
in a way that matters.

1. **Domain: `trevorriggle.design`.** Used for `metadataBase`, canonical URLs,
   the sitemap and OG image URLs. One edit in `lib/site.ts` if it is wrong.
2. **Per-entry year: `2025` on all six AI stubs**, marked `# CONFIRM` in each
   file. You gave the section range as 2025–26 but not per-project years.
3. **The seeded stubs are `status: draft`**, so a production deploy will not
   publish TODO placeholder text to your domain. They render in dev and on
   Vercel preview deploys. To review the full structure in a production build:
   `SHOW_DRAFTS=1 pnpm build`. Flip a stub to `published` when its prose is
   written — and it will then be required to appear in `content/order.ts`.
4. **Legacy redirects are partly guesses.** `/social-media` → Marketing,
   `/spreads` → Print and `/illlustrations` → Personal Works come from you.
   I also added `/illustrations` (the correctly-spelled twin, which anyone
   retyping the URL by hand would hit), `/motion` and `/3d` on the assumption
   they exist. Delete any that do not, and add the real ones from analytics —
   one line each in `next.config.ts`.
5. **Your name is filled in; your email is not.** The name came from this
   repository's git config. The email address in the git config is a work
   address at another company, so I did not put it on a personal portfolio —
   `site.email` is `TODO`, and the contact page shows a visible prompt instead
   of an address until you set it.
6. **OG cards render in the fallback sans, not Fraunces.** `next/og` rasterises
   with satori, which needs a raw `ttf`/`otf` buffer and cannot read the `woff2`
   files `next/font` produces. Rather than fetch a font over the network mid-build,
   the cards carry the composition — ruled frame, hanging ordinal, left-weighted
   type, the vermilion bar. To upgrade: drop a `.ttf` into `lib/fonts/` and pass
   it to the `fonts` option in `lib/og.tsx`.
7. **The home page features the top 4** entries of the running order
   (`HOME_FEATURED_COUNT` in `content/sections.ts`).
8. **Full Stack Development and all five gallery sections are empty**, rendering
   a visible empty state that names the exact path to fill. You gave me real
   project names for AI Systems only, and inventing entries for the others would
   have put undefendable material on the site. The empty state is honest and
   actionable; a silently hidden section is neither.
9. **Architecture stages in the stubs use only nouns you supplied** — App
   Attest, Cloudflare Worker JWT verification, tiered rate limits, daily spend
   ceiling, git worktrees, multi-provider router, hierarchical compression. Every
   `detail` under them is `TODO`. I did not invent a stage, a provider, a model
   name, a metric or an outcome anywhere.

10. **ESLint cannot lint the `.tsx` files, and I left your TypeScript version
    alone.** The scaffold pins TypeScript `^7`, and `typescript-eslint` — which
    `eslint-config-next` depends on, and which owns the only usable TS parser
    for ESLint — throws on TS 7. So `pnpm lint` runs Next's rules, react-hooks
    and a strict jsx-a11y set over the JS it *can* parse, and skips `.ts`/`.tsx`
    entirely. The config file explains it and carries the exact replacement.

    Fixing it properly means pinning TypeScript to `^6`, which trades a compiler
    major for a linter — your call, not mine. It is one line in `package.json`
    plus the four-line config in the comment at the top of `eslint.config.mjs`.
    Meanwhile `pnpm typecheck` and `next build` both type-check the whole
    project, and required-and-validated `alt` text means the a11y defect ESLint
    would most likely catch cannot be introduced through content at all.

## What I deliberately did not write

No copy. Every prose field on the site is a literal `TODO`, including the
headline, the decks, all five spine fields on six case studies, the About
movements, the section standfirsts and the footer line. No invented project
names, metrics, client names, statistics or outcomes — you will be interviewed
on this material, and an empty field is defensible where a fabricated number is
not.

Where a `TODO` needed context to be actionable, the prompt sits next to it as a
visible hint (`/about`) or a frontmatter comment (`content/work/_template/`),
saying what belongs there and what does not. Delete the hints as you fill them.

## Verified, not assumed

- `pnpm typecheck` clean; `pnpm build` clean; 22 routes prerender with drafts on.
- Guardrails tested by deliberately breaking content, then confirming each
  failure message and removing the test entry: a `roadmap` key, a missing
  `tradeoff.cost`, a misspelled `revisit`, and a relative `/live-demo` href.
  All four fail the build. The first `roadmap` check did *not* work and was
  rewritten.
- Mixed-ratio gallery spans verified against a temporary four-image entry
  (2:3 → span 2, 1:1 → span 2, 3:2 → span 3, 32:9 → span 6), then removed.
- All six routes return the right status, including `404` for an unknown path.
- Audited: every `var(--token)` resolves to a declaration, every `styles.class`
  exists in its module, and no `.module.css` file contains a raw hex colour or a
  raw font size.
