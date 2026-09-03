# trevorriggle.design

Portfolio. Next.js App Router, TypeScript, MDX content in-repo, no CMS,
deployed on Vercel.

Two halves: three case studies under `/work/`, five bodies of design work
under `/design/`. **[DECISIONS.md](DECISIONS.md)** carries the reasoning — type
scale, palette, grid, and what was deliberately torn out.

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build          # prebuild runs the external link check
pnpm verify         # link check + typecheck + build
pnpm check:links    # probe external links over the network
```

## Where things are

```
content/
  index.ts         reads the three case studies. Tolerant — never throws.
  design.ts        the five design categories, their order and their copy
  work/<slug>/     drawevolve, thoosie, lynk
public/design/<category>/   design images — drop files in, that is the config
public/media/<slug>/        case study images
styles/tokens.css           every colour, type size, space and grid value
lib/site.ts                 name, domain, email, nav
lib/design-images.ts        reads the design folders at build time
scripts/check-links.mjs     the one build-time check
```

## Routes

```
/                  home — hero, three case studies, five design categories
/work/drawevolve   ┐
/work/thoosie      ├ selected work
/work/lynk         ┘
/design            the five categories
/design/print      ┐
/design/marketing  │
/design/3d         ├ a page per body of work
/design/motion     │
/design/personal   ┘
/about  /contact   404
```

## Adding design work

Drop image files into `public/design/<category>/`. That is the whole
operation — no manifest, no registry, no per-image config, no code edit.

- They appear on that category's page, sorted by filename.
- Dimensions are read from the file at build time, so the grid lays out on
  true aspect ratios and nothing shifts as images load.
- Alt text is derived from the filename: `03-catalog-spread.jpg` becomes
  "Catalog spread". A file with no meaningful name falls back to the category
  name. Missing alt text never blocks anything.
- An empty folder renders the category's copy and no grid. No placeholder
  boxes, no "coming soon".

## Adding design copy

`content/design.ts`. Each category has `intro` (already filled, from
`portfolio-copy.md`), `body` and `demonstrates`. An empty `body` or
`demonstrates` renders nothing at all — fill either and the element appears.

## What fails the build

One thing: an external link that is not an absolute `https://` URL, or a
missing live project link. `scripts/check-links.mjs`, run as `prebuild`.

Nothing else does. **A production build never fails on content.** Empty
fields render nothing and the build carries on — the placeholder guards, the
content schema, the asset manifest and the ordering validators were all
removed, because none of them protected a visitor from anything.

## Deploying

Push to the branch Vercel watches. Framework preset is Next.js and needs no
configuration. Confirm the assumptions at the bottom of
[DECISIONS.md](DECISIONS.md) first — the domain in `lib/site.ts` especially,
since canonical URLs, the sitemap and OG image URLs are all built from it.

There is no draft system and no placeholder guard. What is in `content/` and
`public/design/` is what ships.
