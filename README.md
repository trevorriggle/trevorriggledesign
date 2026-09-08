# trevorriggle.design

Portfolio. Next.js App Router, TypeScript, MDX content in-repo, no CMS,
deployed on Vercel.

Home is a 2x2 of four doors: Applications, Design, Agentic AI, About. Three
case studies live under `/work/`, three bodies of design work under `/design/`.
**[DECISIONS.md](DECISIONS.md)** carries the reasoning, type scale, palette,
grid, and what was deliberately torn out.

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
  index.ts         reads the three case studies. Tolerant, never throws.
  design.ts        the three design categories, their order and their copy
  work/<slug>/     drawevolve, thoosie, lynk
public/design/<category>/   design images, drop files in, that is the config
public/home/<slug>.<ext>    the four home tile thumbnails, same rule
public/media/<slug>/        case study images
styles/tokens.css           every colour, type size, space and grid value
lib/site.ts                 name, domain, email, nav
lib/design-images.ts        reads the design folders at build time
lib/home-tiles.ts           the four home tiles and their thumbnails
scripts/check-links.mjs     the one build-time check
```

## Routes

```
/                          home, a 2x2 of four tiles and nothing else
/applications              the three shipped products, equal weight
/work/drawevolve           ┐
/work/thoosie              ├ a page per application
/work/lynk                 ┘
/design                    the three bodies of work
/design/american-scientific ┐
/design/tarantos            ├ a page per body of work
/design/personal            ┘
/agentic-ai                its own section
/about  /contact           404

/work redirects to /applications, permanent.
```

## Adding design work

Drop image files into `public/design/<category>/`. That is the whole
operation, no manifest, no registry, no per-image config, no code edit.

- They appear on that category's page, sorted by filename.
- **Animated GIFs**: drop the `.gif` in. It is an image here, it keeps its
  extension, and it is served byte-for-byte with `unoptimized` so it stays
  animated. Nothing transcodes it, on the way in or at build time.
- **Video**: drop `<name>.mp4` plus a poster at the same stem, `<name>.jpg`.
  The pair renders as one autoplaying, muted, looping item, and falls back to
  the poster for reduced-motion or metered connections. Only a file that is
  already an `.mp4` renders this way; a clip with no poster is skipped.
- Dimensions are read from the file at build time, so the grid lays out on
  true aspect ratios and nothing shifts as images load.
- Alt text is derived from the filename: `03-catalog-spread.jpg` becomes
  "Catalog spread". A file with no meaningful name falls back to the category
  name. Missing alt text never blocks anything.
- An empty folder renders the category's copy and no grid. No placeholder
  boxes, no "coming soon".

## Adding design copy

`content/design.ts`. Each category has `intro`, `body` and `demonstrates`, and
every one of them renders nothing at all when empty. Only Personal Works has
an `intro`; American Scientific and Taranto's have no copy yet. Fill a field
and its element appears, with no other edit.

## Adding home tile thumbnails

Drop a file at `public/home/<slug>.<ext>`, where slug is `applications`,
`design`, `agentic-ai` or `about`. Any of png/jpg/jpeg/webp/avif/gif/svg,
landscape, at least 1200px on the long edge. A tile with no file renders its
title and count only, with no placeholder box.

## What fails the build

One thing: an external link that is not an absolute `https://` URL, or a
missing live project link. `scripts/check-links.mjs`, run as `prebuild`.

Nothing else does. **A production build never fails on content.** Empty
fields render nothing and the build carries on, the placeholder guards, the
content schema, the asset manifest and the ordering validators were all
removed, because none of them protected a visitor from anything.

## Deploying

Push to the branch Vercel watches. Framework preset is Next.js and needs no
configuration. Confirm the assumptions at the bottom of
[DECISIONS.md](DECISIONS.md) first, the domain in `lib/site.ts` especially,
since canonical URLs, the sitemap and OG image URLs are all built from it.

There is no draft system and no placeholder guard. What is in `content/` and
`public/design/` is what ships.
