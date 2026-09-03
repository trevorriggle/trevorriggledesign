#!/usr/bin/env node
/* ============================================================================
   [[NEEDS]] CHECK — runs before every production build, fails the build.
   ============================================================================
   A `[[NEEDS: ...]]` marker in portfolio-copy.md is a fact only the author can
   supply. While one is outstanding it renders on the page as a hazard-striped
   <Needs> block, so it is impossible to miss in dev — and this script is the
   guarantee that a visitor never sees one, because the deploy breaks first.

   Scans EVERY file under content/, not just MDX bodies and not just
   frontmatter: a marker pasted into a section standfirst, an alt string or a
   YAML comment is the same broken promise wherever it lands.

   There is deliberately NO environment-variable escape hatch. A flag that
   turns this off is a flag that will be set once in a hurry, on the day it
   matters, and never unset. Breaking the deploy is the feature.

   Exit 0 = clean. Exit 1 = build stops, with file and line for each marker.

   Usage: node scripts/check-needs.mjs
   ========================================================================= */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const NEEDLE = "[[NEEDS";

/** Every file under content/, recursively. Templates included, on purpose. */
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, dirent.name);
    if (dirent.isDirectory()) walk(full, out);
    else if (dirent.isFile()) out.push(full);
  }
  return out;
}

const hits = [];

for (const file of walk(CONTENT)) {
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    continue; // unreadable or binary — nothing to match
  }
  if (!text.includes(NEEDLE)) continue;

  const lines = text.split("\n");
  lines.forEach((line, i) => {
    let from = 0;
    for (;;) {
      const at = line.indexOf(NEEDLE, from);
      if (at === -1) break;
      hits.push({
        file: path.relative(ROOT, file),
        line: i + 1,
        /* The marker's first line, trimmed for the report. A marker usually
           wraps, so the rest is in the file at the line named. */
        excerpt: line.slice(at).trim().slice(0, 96),
      });
      from = at + NEEDLE.length;
    }
  });
}

if (hits.length === 0) {
  console.log("  [[NEEDS]]: none in content/ — clean.");
  process.exit(0);
}

console.error(
  `\n  ── Unfilled [[NEEDS]] markers (${hits.length}) ───────────────\n`,
);
for (const hit of hits) {
  console.error(`  ✗ ${hit.file}:${hit.line}`);
  console.error(`      ${hit.excerpt}${hit.excerpt.length >= 96 ? "…" : ""}`);
}
console.error(
  `\n  Build stopped. A [[NEEDS: ...]] marker is a fact only you can supply,\n` +
    `  and shipping one puts a visible placeholder on a live page.\n\n` +
    `  Fill it in, or cut the sentence containing it. Either is fine.\n` +
    `  There is no flag to skip this check.\n`,
);
process.exit(1);
