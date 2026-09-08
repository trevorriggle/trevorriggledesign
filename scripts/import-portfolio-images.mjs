/* ============================================================================
   IMPORT THE PORTFOLIO SOURCE DROP INTO public/
   ============================================================================
   node scripts/import-portfolio-images.mjs [--dry-run] ["Portfolio Images"]

   The source drop is an ignored folder of masters and downsized exports whose
   FOLDER NAMES are the configuration:

     Applications/<Entry> - <position>          -> public/media/<slug>/
     Design/<Client> - <position>/              -> public/design/<slug>/
     Design/<Client> - <position>/<Sub> - <n>/     flattened into the above

   ORDERING SUFFIXES. "- top", "- middle", "- bottom" and the ordinal words
   "- First" .. "- Twelfth" (and bare numbers) are POSITION, never part of the
   name. They are stripped for anything user-facing and survive only as the
   order they imply. A folder with no suffix sorts after every ranked sibling,
   by name.

   DESTINATIONS ARE NEVER INVENTED. A source folder maps only onto a directory
   that already exists under public/design or public/media, matched on its slug
   or on the title that content/design.ts gives that slug ("Taranto's" ->
   tarantos, "Personal Works" -> personal). Anything that does not match is
   reported as unmapped and copied nowhere.

   TWO DESTINATIONS, TWO NAMING RULES, because the two halves of the site read
   a folder differently:

     public/design/<slug>/   THE FILENAME IS THE ORDER. lib/design-images.ts
                             sorts the folder by filename and derives alt text
                             from it. Subsection order therefore has to become
                             a numeric prefix, so files land as NN.<ext> on one
                             counter that runs through the subsections in rank
                             order. Numbers only: alt text then falls back to
                             the category name, which is the documented
                             behaviour, instead of a UUID being read out to a
                             screen reader. The copy pass renames them.

     public/media/<slug>/    THE FRONTMATTER IS THE ORDER. Filenames are only
                             referenced by content/work/<slug>/index.mdx, so
                             they land as NN.<ext> in filename order and are
                             declared later. The exception is DECLARED below.

   DECLARED. A source file that is verifiably the file an entry's frontmatter
   already declares is copied to that exact declared name, so the entry renders
   immediately. Verified means the image IS that picture, on its dimensions and
   its content, not on a guess from its position in the folder.

   NOTHING IS TRANSCODED. Bytes are copied. A .gif stays a .gif, a .mp4 stays a
   .mp4, and this script owns no encoder. See DECISIONS.md.

   Re-runnable. It overwrites what it wrote and never deletes, so a source file
   that disappears leaves its old copy behind; empty the destination folder
   first if the drop has been reorganised.
   ========================================================================= */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const argv = process.argv.slice(2);
const DRY = argv.includes("--dry-run");
const SRC_ROOT = path.resolve(
  ROOT,
  argv.find((a) => !a.startsWith("--")) ?? "Portfolio Images",
);

/** The untouched backup. Ignored entirely, at any depth. */
const IGNORED_DIRS = [/^original size images$/i];

const IMAGE_EXT = /\.(png|jpe?g|webp|avif|gif|svg)$/i;
const VIDEO_EXT = /\.(mp4|webm)$/i;

/* -------------------------------------------------------------------------- */
/* Ordering suffixes                                                          */
/* -------------------------------------------------------------------------- */

const POSITION_WORDS = {
  top: 0,
  first: 0,
  second: 1,
  middle: 1,
  third: 2,
  fourth: 3,
  fifth: 4,
  sixth: 5,
  seventh: 6,
  eighth: 7,
  ninth: 8,
  tenth: 9,
  eleventh: 10,
  twelfth: 11,
  bottom: 900,
  last: 900,
};

/**
 * "American Scientific - top" -> { name: "American Scientific", rank: 0 }
 * "Comics"                    -> { name: "Comics", rank: null }
 *
 * `bottom` and `last` deliberately rank at 900, not at 2: "bottom" means the
 * end of the list however long it gets, and it must still sort after a
 * "- Fourth" sibling.
 */
function splitOrdering(dirName) {
  const m = /^(.*?)\s*[-–—]\s*([A-Za-z]+|\d{1,2})\s*$/.exec(dirName);
  if (!m) return { name: dirName, rank: null };

  const [, base, suffix] = m;
  const word = suffix.toLowerCase();
  if (word in POSITION_WORDS) return { name: base, rank: POSITION_WORDS[word] };
  if (/^\d{1,2}$/.test(word)) return { name: base, rank: Number(word) };

  /* A trailing word that is not a position is part of the name. */
  return { name: dirName, rank: null };
}

/** The comparator lib/design-images.ts sorts with, so import order == page order. */
const byName = (a, b) => a.localeCompare(b, "en", { numeric: true });

/** Ranked folders first in rank order, then unranked ones by name. */
function byRankThenName(a, b) {
  if (a.rank !== null && b.rank !== null) {
    return a.rank - b.rank || byName(a.name, b.name);
  }
  if (a.rank !== null) return -1;
  if (b.rank !== null) return 1;
  return byName(a.name, b.name);
}

/* -------------------------------------------------------------------------- */
/* Destination resolution                                                     */
/* -------------------------------------------------------------------------- */

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** slug -> title, straight out of content/design.ts. Read, not duplicated. */
function designTitles() {
  const src = fs.readFileSync(path.join(ROOT, "content", "design.ts"), "utf8");
  const out = new Map();
  const re = /slug:\s*"([^"]+)"\s*,\s*\n\s*title:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) out.set(m[1], m[2]);
  return out;
}

function existingDirs(kind) {
  const dir = path.join(ROOT, "public", kind);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

/**
 * A source folder name onto an EXISTING destination slug, or null.
 *
 * Matched on the slug itself, on the title content/design.ts gives the slug,
 * or on a title whose normalised form starts with the slug ("Personal Works"
 * -> personal). Never on anything looser, and never by creating a directory.
 */
function resolveSlug(name, kind, titles) {
  const want = norm(name);
  const dirs = existingDirs(kind);

  for (const slug of dirs) if (norm(slug) === want) return slug;
  for (const slug of dirs) {
    const title = titles.get(slug);
    if (title && norm(title) === want) return slug;
  }
  for (const slug of dirs) {
    const title = titles.get(slug);
    if (title && want.startsWith(norm(slug))) return slug;
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Declared files                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Source basename -> the filename its entry's frontmatter already declares.
 *
 * Each one is a verified content match, not a positional guess:
 *
 *   thoosiecoaster.mp4   named by hand as thoosie's hero clip, and now the
 *                        `video.src` in content/work/thoosie/index.mdx.
 *   3e5b5372…_rw_1920    1615x896, the exact aspect and minWidth lynk's cover
 *                        declares, and the picture its alt text describes:
 *                        guest mode, the model switcher open on Claude,
 *                        OpenAI, Gemini and Grok, Session Insights on the
 *                        right.
 *
 * DrawEvolve's cover is NOT here. It declares 874:629 and nothing in the drop
 * is that shape, so the slot stays empty rather than being filled by whatever
 * sorted first.
 */
const DECLARED = {
  "thoosiecoaster.mp4": "thoosiecoaster.mp4",
  "3e5b5372-5ea3-4fbd-9a24-ba37fd104573_rw_1920.jpg":
    "01-multi-model-workspace.jpg",
};

/* -------------------------------------------------------------------------- */

function listDirs(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .filter((e) => !IGNORED_DIRS.some((re) => re.test(e.name)))
    .map((e) => {
      const { name, rank } = splitOrdering(e.name);
      return { dirName: e.name, name, rank, path: path.join(dir, e.name) };
    })
    .sort(byRankThenName);
}

function listMedia(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((n) => IMAGE_EXT.test(n) || VIDEO_EXT.test(n))
    .sort(byName);
}

const plan = [];
const unmapped = [];
const skipped = [];

function planFile(srcPath, destDir, destName) {
  plan.push({ srcPath, destDir, destName });
}

function importSection(sectionDir, kind, titles) {
  const groups = listDirs(sectionDir);
  const order = [];

  for (const group of groups) {
    const slug = resolveSlug(group.name, kind, titles);
    if (!slug) {
      unmapped.push({
        source: path.relative(SRC_ROOT, group.path),
        reason: `no existing public/${kind}/ folder matches "${group.name}"`,
        files: listMedia(group.path).length,
      });
      continue;
    }
    order.push(slug);

    const destDir = path.join(ROOT, "public", kind, slug);
    const subs = listDirs(group.path);
    /* Files sitting directly in the group folder come before its subsections. */
    const buckets = [
      { label: "(root)", files: listMedia(group.path), dir: group.path },
      ...subs.map((s) => ({
        label: s.dirName,
        files: listMedia(s.path),
        dir: s.path,
      })),
    ];

    let n = 0;
    for (const bucket of buckets) {
      for (const file of bucket.files) {
        /* A declared file still consumes its number, so the files around it
           keep the positions filename order gave them. */
        n += 1;
        const declared = DECLARED[file];
        if (declared) {
          planFile(path.join(bucket.dir, file), destDir, declared);
          continue;
        }
        const ext = path.extname(file).toLowerCase();
        planFile(
          path.join(bucket.dir, file),
          destDir,
          `${String(n).padStart(2, "0")}${ext}`,
        );
      }
    }

    /* Any non-media file in the drop is named, not silently dropped. */
    for (const bucket of buckets) {
      for (const e of fs.readdirSync(bucket.dir, { withFileTypes: true })) {
        if (!e.isFile()) continue;
        if (IMAGE_EXT.test(e.name) || VIDEO_EXT.test(e.name)) continue;
        skipped.push(path.relative(SRC_ROOT, path.join(bucket.dir, e.name)));
      }
    }
  }

  return order;
}

/* -------------------------------------------------------------------------- */

if (!fs.existsSync(SRC_ROOT)) {
  console.error(`Source folder not found: ${SRC_ROOT}`);
  process.exit(1);
}

const titles = designTitles();
const sections = {};

for (const e of fs.readdirSync(SRC_ROOT, { withFileTypes: true })) {
  const full = path.join(SRC_ROOT, e.name);
  if (e.isFile()) {
    if (IMAGE_EXT.test(e.name) || VIDEO_EXT.test(e.name)) {
      unmapped.push({
        source: e.name,
        reason: "sits at the top level, in no section folder",
        files: 1,
      });
    } else {
      skipped.push(e.name);
    }
    continue;
  }
  if (IGNORED_DIRS.some((re) => re.test(e.name))) continue;

  const { name } = splitOrdering(e.name);
  const kind =
    norm(name) === "applications" ? "media"
    : norm(name) === "design" ? "design"
    : null;

  if (!kind) {
    unmapped.push({
      source: e.name,
      reason: "top-level folder is neither Applications nor Design",
      files: 0,
    });
    continue;
  }
  sections[kind] = importSection(full, kind, titles);
}

/* -------------------------------------------------------------------------- */
/* Execute                                                                    */
/* -------------------------------------------------------------------------- */

const counts = new Map();
for (const { srcPath, destDir, destName } of plan) {
  const rel = path.relative(ROOT, path.join(destDir, destName));
  if (!DRY) {
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(srcPath, path.join(destDir, destName));
  }
  const ext = path.extname(destName).toLowerCase().slice(1);
  const key = path.relative(path.join(ROOT, "public"), destDir);
  const c = counts.get(key) ?? { image: 0, gif: 0, video: 0, bytes: 0 };
  if (VIDEO_EXT.test(destName)) c.video += 1;
  else if (ext === "gif") c.gif += 1;
  else c.image += 1;
  c.bytes += fs.statSync(srcPath).size;
  counts.set(key, c);
  console.log(
    `${DRY ? "would copy" : "copied"}  ${path.relative(SRC_ROOT, srcPath)}\n` +
      `           -> ${rel}`,
  );
}

console.log("\n=== per destination ===");
for (const [key, c] of [...counts].sort(([a], [b]) => byName(a, b))) {
  console.log(
    `${key.padEnd(34)} ${String(c.image).padStart(3)} images  ` +
      `${String(c.gif).padStart(2)} gifs  ${String(c.video).padStart(2)} video  ` +
      `${(c.bytes / 1e6).toFixed(1)} MB`,
  );
}

console.log("\n=== section order implied by the drop ===");
for (const [kind, order] of Object.entries(sections)) {
  console.log(`${kind.padEnd(8)} ${order.join(", ")}`);
}

if (unmapped.length) {
  console.log("\n=== UNMAPPED, copied nowhere ===");
  for (const u of unmapped) {
    console.log(`${u.source}\n    ${u.reason}  (${u.files} file(s))`);
  }
}
if (skipped.length) {
  console.log("\n=== not media, skipped ===");
  for (const s of skipped) console.log(s);
}
console.log(
  `\n${DRY ? "would copy" : "copied"} ${plan.length} file(s). Transcodes: 0.`,
);
