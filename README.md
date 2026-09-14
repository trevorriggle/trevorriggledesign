# trevorriggle.design

Portfolio. Next.js App Router, TypeScript, MDX content in-repo, no CMS,
deployed on Vercel.

Home opens on the statement, the clip, and then the work itself: three
applications and three bodies of design work, as pictures. Three case studies
live under `/work/`, three bodies of design work under `/design/`.
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
public/media/<slug>/        case study images
public/resume/*.pdf         drop a PDF in, the /about download button appears
styles/tokens.css           every colour, type size, space and grid value
lib/site.ts                 name, domain, email, nav
lib/design-images.ts        reads the design folders at build time
lib/resume.ts               finds the resume PDF, or renders no button
lib/cards.ts                the rows both the home grid and /applications read
app/api/contact/route.ts    the contact form's send, through Resend
scripts/check-links.mjs     the one build-time check
```

## Routes

```
/                          home, the statement, the clip, and six pieces of work
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
/api/contact               POST, the contact form's send

/work redirects to /applications, permanent.
/design/<category>/<group> 308 to the matching anchor on the category page.
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

## The home grid needs no thumbnails

There is no `public/home/` any more. The home grid reads the same rows
`/applications` and `/design` do, out of `lib/cards.ts`, so a new entry shows
up in both places from one edit and the two can never disagree about which
picture belongs to DrawEvolve. The tiles crop to a single proportion, which is
the one place on this site that happens: six mixed proportions are not a grid.

## Adding the resume

Drop a PDF anywhere in `public/resume/`. The download button on `/about`
appears, labelled with the file's real size, and the browser saves it as
"Trevor Riggle, resume.pdf" whatever it is called on disk. No manifest, no
import, no other edit.

**No placeholder PDF ships, deliberately.** With no file in that folder the
button does not render at all. A missing resume is a gap a reader asks about;
a blank one is a thing they remember. See the header of `lib/resume.ts`.

## The contact form

`/contact` posts JSON to `/api/contact`, which validates again server-side and
sends one email through Resend over plain `fetch`, no SDK. Anti-spam is a
honeypot field and a two-second minimum on the form, not a rate limiter.

Three environment variables, all optional at build time:

```
RESEND_API_KEY   the API key
CONTACT_FROM     an address on a domain verified in Resend. NOT the gmail
                 address: the sender's own address rides in Reply-To, and
                 From must be the verified domain or the mail gets filtered
CONTACT_TO       where it lands. Defaults to site.email
```

With `RESEND_API_KEY` or `CONTACT_FROM` unset the route answers 503 and the
form tells the visitor to email the address directly, naming it. It never
reports success without sending.

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
