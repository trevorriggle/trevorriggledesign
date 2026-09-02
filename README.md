# trevorriggle.design

Portfolio. Next.js App Router, TypeScript, MDX content in-repo, no CMS,
deployed on Vercel.

Two documents carry the reasoning: **[DECISIONS.md](DECISIONS.md)** for the
type, palette, grid and content-model choices (and the assumptions to confirm),
and **[MANIFEST.md](MANIFEST.md)** for the asset shopping list, regenerated on
every build.

```bash
pnpm install
pnpm dev            # http://localhost:3000 — drafts visible
pnpm build          # prebuild runs the link check + regenerates MANIFEST.md
pnpm verify         # link check + typecheck + build
pnpm check:links    # probe external links over the network (reports only)
```

## Where things are

```
content/
  sections.ts      the seven sections, in order. Move a line to reorder the site.
  order.ts         entry order within each section. Same rule.
  schema.ts        typed frontmatter, validated at build time
  index.ts         the loader: validation, ordering, image resolution
  work/<slug>/     case studies      (start from _template/)
  gallery/<slug>/  gallery sets      (start from _template/)
public/media/<slug>/   images for that entry — one folder per project
styles/tokens.css      every colour, type size, space and grid value
lib/site.ts            name, domain, email, social links
scripts/               link check + manifest generation
```

## Adding a case study

1. `cp -r content/work/_template content/work/my-slug`
2. Fill the frontmatter. Every field is validated; the comments say what belongs
   in each one and what does not.
3. Add `"my-slug"` to its section's array in `content/order.ts`. Position in
   that array is its position on the site — **nothing is date-sorted.**
4. `pnpm dev`. It renders immediately, with spec placeholders where the images
   will go.
5. Set `status: published` when the prose is written. Until then it shows in dev
   and on preview deploys only.

## Adding images

There are none yet, and the site is designed to be fully reviewable that way.

Every image is declared in frontmatter with a filename, alt text, aspect ratio,
minimum width and a note on what it must show. A declared image with no file
renders as a spec placeholder carrying exactly those facts.

**To add one:** save the file at the path `MANIFEST.md` lists in its *Save as*
column. That is the entire operation — no code edit, no frontmatter edit, no
import. `next/image` picks it up and serves AVIF/WebP at the sizes each layout
slot needs.

## Things that fail the build, on purpose

- A relative, `http://`, protocol-relative or `TODO` external link — the bug
  that turned every "Live demo" on the old site into a 404. Checked in three
  places; see DECISIONS.md.
- A `roadmap`, `features`, `problem`, `solution` or `challenge` field, rejected
  by name with an explanation of what to write instead.
- A misspelled frontmatter key, rather than silently dropping it.
- A missing `tradeoff.cost`, `revisit`, or any `alt` text.
- A published entry that is not in `content/order.ts`, or an ordered slug with
  no folder.

## Deploying

Push to the branch Vercel watches. Framework preset is Next.js and needs no
configuration. Confirm the four assumptions at the top of
[DECISIONS.md](DECISIONS.md#assumptions-i-made-confirm-these) first — the domain
in `lib/site.ts` especially, since canonical URLs, the sitemap and OG image URLs
are all built from it.

Production hides `status: draft` entries. To review the whole structure as a
production build: `SHOW_DRAFTS=1 pnpm build && pnpm start`.
