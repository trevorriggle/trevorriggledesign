#!/usr/bin/env node
/* ============================================================================
   MANIFEST — the asset shopping list.
   ============================================================================
   Walks every content entry and writes MANIFEST.md: one row per image the site
   expects, with the filename, the exact path to drop it at, the aspect ratio
   and the minimum export width. Missing files are listed first, because that
   is the actionable half.

   Video slots are listed too, in their own table. A video is two files — the
   mp4 and its poster frame — and they are tracked separately because they
   arrive separately and the page is designed to work with only the poster.
   The poster appears in the image tables like any other image; the mp4 gets
   the video table, with the encode settings it has to satisfy.

   The same frontmatter drives <Placeholder />, so the list and the page can
   never disagree: what the placeholder prints on screen is what this file
   prints in the table.

   Regenerated on every build. Run standalone: node scripts/manifest.mjs
   ========================================================================= */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();

/* Read the running order straight out of the TS sources with a narrow regex,
   so this script needs no TypeScript toolchain and the manifest is ordered the
   same way the site is. */
function readOrder() {
  const src = fs.readFileSync(path.join(ROOT, "content/order.ts"), "utf8");
  const order = {};
  for (const block of src.matchAll(/["']?([a-z0-9-]+)["']?\s*:\s*\[([^\]]*)\]/g)) {
    order[block[1]] = [...block[2].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
  }
  return order;
}

function readSections() {
  const src = fs.readFileSync(path.join(ROOT, "content/sections.ts"), "utf8");
  const sections = [];
  /* Reads id/title/years/kind/tier out of the TS source with a narrow regex,
     so this script needs no TypeScript toolchain and the manifest is ordered
     exactly the way the site is. */
  for (const block of src.matchAll(
    /id:\s*["']([^"']+)["'],\s*\n\s*title:\s*["']([^"']+)["'],\s*\n\s*years:\s*["']([^"']+)["'],\s*\n\s*kind:\s*["']([^"']+)["'],\s*\n\s*tier:\s*["']([^"']+)["']/g,
  )) {
    sections.push({
      id: block[1],
      title: block[2],
      years: block[3],
      kind: block[4],
      tier: block[5],
    });
  }
  return sections;
}

function entryFile(slug) {
  for (const kind of ["work", "gallery"]) {
    const file = path.join(ROOT, "content", kind, slug, "index.mdx");
    if (fs.existsSync(file)) return { file, kind };
  }
  return null;
}

/** Collect the declared images from one entry's frontmatter, in page order. */
function imagesOf(data) {
  const rows = [];
  const push = (img, role) => {
    if (img && typeof img === "object" && img.src) rows.push({ ...img, role });
  };

  push(data.video?.poster, "video poster");
  push(data.cover, "cover");
  push(data.architecture?.diagram, "architecture diagram");
  if (Array.isArray(data.images)) {
    data.images.forEach((img, i) => push(img, `plate ${String(i + 1).padStart(2, "0")}`));
  }
  return rows;
}

function dims(img) {
  const [w, h] = String(img.aspect ?? "3:2").split(":").map(Number);
  const width = Number(img.minWidth ?? 1600);
  return { width, height: Math.round(width / (w / h)), ratio: (w / h).toFixed(2) };
}

/* -------------------------------------------------------------------------- */

const sections = readSections();
const order = readOrder();

const rows = [];
const videos = [];

for (const section of sections) {
  for (const slug of order[section.id] ?? []) {
    const found = entryFile(slug);
    if (!found) continue;

    const { data } = matter(fs.readFileSync(found.file, "utf8"));

    if (data.video?.src) {
      const dest = path.join("public", "media", slug, data.video.src);
      const poster = data.video.poster ?? {};
      videos.push({
        section: section.title,
        tier: section.tier,
        slug,
        title: String(data.title ?? slug),
        src: data.video.src,
        dest,
        aspect: poster.aspect ?? "16:9",
        posterDest: poster.src
          ? path.join("public", "media", slug, poster.src)
          : "(no poster declared)",
        exists: fs.existsSync(path.join(ROOT, dest)),
      });
    }

    for (const img of imagesOf(data)) {
      const { width, height, ratio } = dims(img);
      const dest = path.join("public", "media", slug, img.src);
      rows.push({
        section: section.title,
        sectionId: section.id,
        tier: section.tier,
        slug,
        title: String(data.title ?? slug),
        role: img.role,
        src: img.src,
        dest,
        aspect: img.aspect ?? "3:2",
        ratio,
        width,
        height,
        label: img.label ?? "",
        exists: fs.existsSync(path.join(ROOT, dest)),
      });
    }
  }
}

const missing = rows.filter((r) => !r.exists);
const present = rows.filter((r) => r.exists);
const missingVideos = videos.filter((v) => !v.exists);

const videoTable = (list) =>
  [
    "| Save as | Aspect | Encode | Falls back to |",
    "| --- | --- | --- | --- |",
    ...list.map(
      (v) =>
        `| \`${v.dest}\` | ${v.aspect} | H.264 mp4, faststart, no audio track | \`${v.posterDest}\` |`,
    ),
  ].join("\n");

const table = (list) =>
  [
    "| Save as | Aspect | Minimum size | Slot | Must show |",
    "| --- | --- | --- | --- | --- |",
    ...list.map(
      (r) =>
        `| \`${r.dest}\` | ${r.aspect} | ${r.width}×${r.height} | ${r.role} | ${r.label.replace(/\|/g, "\\|")} |`,
    ),
  ].join("\n");

const bySlug = new Map();
for (const row of rows) {
  if (!bySlug.has(row.slug)) bySlug.set(row.slug, []);
  bySlug.get(row.slug).push(row);
}

const out = `<!-- GENERATED by scripts/manifest.mjs — do not edit by hand. -->
# Asset manifest

Every image this site expects, generated from content frontmatter. The site
builds and lays out correctly with none of these present: a declared image with
no file renders as a spec placeholder carrying the same four facts listed here.

**To add an asset:** save the file at the exact path in the *Save as* column.
Nothing else changes — no code edit, no frontmatter edit, no import.

- Declared: **${rows.length}** (${rows.filter((r) => r.tier === "selected").length} selected work, ${rows.filter((r) => r.tier === "archive").length} archive)
- Present: **${present.length}**
- Still needed: **${missing.length}**

Minimum sizes are the smallest acceptable export. Larger is fine —
\`next/image\` downscales and serves AVIF/WebP at the sizes each layout slot
actually needs. Smaller means visible softness on a 2× display.

---

## Still needed (${missing.length})

${missing.length === 0 ? "_Nothing outstanding._" : table(missing)}

---

## Video (${videos.length})

${
  videos.length === 0
    ? "_No video slots declared._"
    : `${videoTable(videos)}

A video slot is **two files and degrades to one.** While the mp4 is absent the
page renders the poster frame as a still, in the same box, in the same place —
so the layout is already correct and nothing is broken. Dropping the mp4 in at
the path above is the entire operation.

Encode notes, because the player relies on them: the clip plays **muted,
looped, inline, with controls**, and is started from script rather than by an
\`autoplay\` attribute — it will not start on its own on a metered or slow
connection, or for a viewer who has asked for reduced motion. So there is no
point carrying an audio track, and \`-movflags +faststart\` matters because
playback begins before the file finishes arriving.

${missingVideos.length === 0 ? "All declared clips are present." : `Still needed: **${missingVideos.length}**.`}`
}

---

## Archive, by section (${rows.filter((r) => r.tier === "archive").length})

The archive is Tier 2 — one page at \`/archive\`, five anchored sections, no
per-project routes. Images are grouped here the way they are grouped on the
page, in the same manual order.

${
  sections.filter((s) => s.tier === "archive").map((section) => {
    const list = rows.filter((r) => r.sectionId === section.id);
    return `### ${section.title} · ${section.years}\n\n\`/archive#${section.id}\`\n\n${
      list.length === 0
        ? "_No sets in the repository yet._"
        : table(list)
    }`;
  }).join("\n\n")
}

---

## Per entry

${[...bySlug.entries()]
  .map(([slug, list]) => {
    const first = list[0];
    return `### ${first.title}

\`${slug}\` · ${first.section} · folder \`public/media/${slug}/\`

${table(list)}`;
  })
  .join("\n\n")}

---

## Already in place (${present.length})

${present.length === 0 ? "_None yet._" : table(present)}
`;

fs.writeFileSync(path.join(ROOT, "MANIFEST.md"), out);
console.log(
  `  MANIFEST.md: ${rows.length} image(s) declared, ${present.length} present, ${missing.length} needed;` +
    ` ${videos.length} video(s) declared, ${missingVideos.length} needed.`,
);
