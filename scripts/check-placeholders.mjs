#!/usr/bin/env node
/* ============================================================================
   PLACEHOLDER CHECK — environment-aware, runs before every build.
   ============================================================================
   Two strings must never reach a visitor:

     [[NEEDS: …]]   a fact only the author can supply. Renders in dev as a
                    hazard-striped block; see components/ui/Needs.tsx.
     TODO           an unfilled content field. Renders as literal placeholder
                    text on the page — in frontmatter it becomes alt text or a
                    <Placeholder> spec line, both of which ship.

   BEHAVIOUR BY ENVIRONMENT

     production   fail hard, exit 1, listing every occurrence with file+line
     preview      warn, exit 0
     development  warn, exit 0

   Resolution order for "which environment is this":

     1. ALLOW_PLACEHOLDERS=1     -> never fail; print a loud warning listing
                                    everything it let through
     2. VERCEL_ENV               -> "production" fails; "preview" and
                                    "development" warn
     3. no VERCEL_ENV            -> treated as PRODUCTION and fails

   Point 3 is deliberate. A local `pnpm build` IS a production build — it is
   `next build`, it is what gets deployed from a laptop in a hurry, and a
   checker that silently degrades to "warn" when it cannot identify its
   environment is a checker that never fires. `pnpm dev` never runs this at
   all, so day-to-day iteration is unaffected either way.

   WHAT IS SCANNED, and why it is not simply "everything":

     [[NEEDS  every file under content/, including .ts and YAML comments — a
              marker pasted anywhere in that tree is the same broken promise.
     TODO     content .mdx files and lib/site.ts only. Those are the strings
              that render. A `// TODO:` in a schema doc comment is a note to a
              developer, not a placeholder on a page, and failing a deploy for
              one would train everybody to reach for the escape hatch.

   Template folders (_template) are skipped for TODO: their whole purpose is
   to be a sheet of TODOs to copy from. They are still scanned for [[NEEDS.

   Usage: node scripts/check-placeholders.mjs [--verbose]
   ========================================================================= */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");

const NEEDS = "[[NEEDS";
const TODO = "TODO";

const ALLOW = process.env.ALLOW_PLACEHOLDERS === "1";
const VERCEL_ENV = process.env.VERCEL_ENV ?? "";

/** production | preview | development */
const ENVIRONMENT = VERCEL_ENV === "" ? "production" : VERCEL_ENV;
const IS_PRODUCTION = ENVIRONMENT === "production";

/* -------------------------------------------------------------------------- */

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, dirent.name);
    if (dirent.isDirectory()) walk(full, out);
    else if (dirent.isFile()) out.push(full);
  }
  return out;
}

function read(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }
}

/** Every occurrence of `needle` in `text`, as {line, excerpt}. */
function occurrences(text, needle) {
  const hits = [];
  text.split("\n").forEach((line, i) => {
    let from = 0;
    for (;;) {
      const at = line.indexOf(needle, from);
      if (at === -1) break;
      hits.push({ line: i + 1, excerpt: line.trim().slice(0, 100) });
      from = at + needle.length;
    }
  });
  return hits;
}

const findings = [];

/* ---- [[NEEDS: every file under content/ ---------------------------------- */

for (const file of walk(CONTENT)) {
  const text = read(file);
  if (!text || !text.includes(NEEDS)) continue;
  for (const hit of occurrences(text, NEEDS)) {
    findings.push({
      kind: "[[NEEDS]]",
      file: path.relative(ROOT, file),
      ...hit,
    });
  }
}

/* ---- TODO: rendering content only ---------------------------------------- */

const todoTargets = [
  ...walk(CONTENT).filter(
    (f) => f.endsWith(".mdx") && !f.split(path.sep).some((p) => p.startsWith("_")),
  ),
  path.join(ROOT, "content", "sections.ts"),
  path.join(ROOT, "lib", "site.ts"),
];

for (const file of todoTargets) {
  const text = read(file);
  if (!text || !text.includes(TODO)) continue;
  for (const hit of occurrences(text, TODO)) {
    findings.push({
      kind: "TODO",
      file: path.relative(ROOT, file),
      ...hit,
    });
  }
}

findings.sort(
  (a, b) => a.file.localeCompare(b.file) || a.line - b.line,
);

/* -------------------------------------------------------------------------- */

const rule = (label) =>
  `\n  ── ${label} ${"─".repeat(Math.max(0, 52 - label.length))}\n`;

function list(stream) {
  for (const f of findings) {
    stream(`  ${f.kind === "TODO" ? "TODO     " : "[[NEEDS]]"} ${f.file}:${f.line}`);
    stream(`            ${f.excerpt}`);
  }
}

if (findings.length === 0) {
  console.log(
    `  Placeholders: none. (env: ${ENVIRONMENT}${ALLOW ? ", ALLOW_PLACEHOLDERS=1" : ""})`,
  );
  process.exit(0);
}

const counts = {
  needs: findings.filter((f) => f.kind === "[[NEEDS]]").length,
  todo: findings.filter((f) => f.kind === "TODO").length,
};
const summary = `${findings.length} placeholder(s): ${counts.needs} [[NEEDS]], ${counts.todo} TODO`;

if (ALLOW) {
  console.warn(rule("ALLOW_PLACEHOLDERS=1 — SHIPPING WITH PLACEHOLDERS"));
  console.warn(`  ${summary}\n`);
  list((l) => console.warn(l));
  console.warn(
    `\n  These WILL be visible to anyone who opens the deployed site.\n` +
      `  The escape hatch was used deliberately; unset ALLOW_PLACEHOLDERS to\n` +
      `  restore the hard failure.\n`,
  );
  process.exit(0);
}

if (!IS_PRODUCTION) {
  console.warn(rule(`${ENVIRONMENT} build — warning only`));
  console.warn(`  ${summary}\n`);
  list((l) => console.warn(l));
  console.warn(
    `\n  Not blocking a ${ENVIRONMENT} build. A production build fails on these.\n`,
  );
  process.exit(0);
}

console.error(rule("PRODUCTION BUILD STOPPED — unfilled placeholders"));
console.error(`  ${summary}\n`);
list((l) => console.error(l));
console.error(
  `\n  A [[NEEDS: …]] marker is a fact only you can supply. A TODO in content\n` +
    `  renders as literal placeholder text on the page — in frontmatter it\n` +
    `  becomes alt text or a placeholder spec line, and both ship.\n\n` +
    `  Fill it in, or cut the field. To deploy anyway, deliberately:\n\n` +
    `      ALLOW_PLACEHOLDERS=1 pnpm build\n\n` +
    `  which prints a loud warning listing everything it let through.\n`,
);
process.exit(1);
