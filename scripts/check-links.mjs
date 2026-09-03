#!/usr/bin/env node
/* ============================================================================
   EXTERNAL LINK CHECK — runs before every build, fails the build.
   ============================================================================
   The old site turned every "Live demo" into a 404 on its own domain: the
   hrefs were relative paths, so they resolved against the portfolio instead of
   the target.

   This is now the ONLY build-time content check on the project — every other
   guard, validator and manifest was removed, because none of them protected a
   visitor from anything. This one does: a relative external href fails
   silently and looks like a working link, and there is no way to notice it
   from the rendered page.

   Two layers:

     1. components/ui/ExternalLink  throws on a non-absolute href at render
     2. this script                 scans content frontmatter, the MDX prose
                                    bodies, and every href in app/, components/
                                    and lib/

   It also asserts, by name, that the site's live project links are present and
   absolute. See REQUIRED_LIVE below.

   Malformed URL  -> exit 1, build fails.
   Dead URL       -> reported only, with --probe. A third-party host being down
                     at 3am should not fail a deploy.

   Usage: node scripts/check-links.mjs [--probe]
   ========================================================================= */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const PROBE = process.argv.includes("--probe");
const TIMEOUT_MS = 10_000;

const problems = [];
const links = [];

/* ---------------------------------------------------------------------------
   The two live external links on this site.

   A tripwire, deliberately hard-coded. The failure this whole file exists to
   prevent is not "a URL was typed wrong" — it is a Live link that silently
   stops being a live link, which is what the old site shipped on every case
   study. Validating the links that happen to be present cannot catch a link
   that has gone missing, so these two are asserted by name: present somewhere
   in content/, absolute, and exactly this spelling.

   If a project genuinely goes away, delete its line here in the same commit
   that removes it. That is the point — it should take a decision, not a
   silent drift.
   ------------------------------------------------------------------------ */
const REQUIRED_LIVE = ["https://drawevolve.com", "https://thoosie.net"];

/* -------------------------------------------------------------------------- */
/* 1. Content frontmatter                                                     */
/* -------------------------------------------------------------------------- */

function walkContent(kind) {
  const dir = path.join(ROOT, "content", kind);
  if (!fs.existsSync(dir)) return;

  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!dirent.isDirectory() || dirent.name.startsWith("_")) continue;

    const file = path.join(dir, dirent.name, "index.mdx");
    if (!fs.existsSync(file)) continue;

    const { data } = matter(fs.readFileSync(file, "utf8"));
    const declared = [
      ...(Array.isArray(data.links) ? data.links : []),
      ...(data.link ? [data.link] : []),
    ];

    for (const link of declared) {
      if (!link || typeof link !== "object") continue;
      links.push({
        href: String(link.href ?? ""),
        label: link.label ?? "(no label)",
        source: `content/${kind}/${dirent.name}/index.mdx`,
        /* Declared content links are always external by definition — there is
           no reason to put an internal route in a case study's links[]. So a
           relative path here is the old site's bug verbatim, not a valid
           in-app link, and it must fail. */
        origin: "content",
      });
    }
  }
}

/* -------------------------------------------------------------------------- */
/* 1b. Prose bodies in content MDX                                            */
/* -------------------------------------------------------------------------- */

/**
 * The half of a content file the frontmatter schema cannot see.
 *
 * A markdown link written in a case study body — `[Live demo](drawevolve.com)`
 * — is the old site's bug verbatim, and nothing else in the pipeline would
 * catch it: gray-matter hands the body through as an opaque string, and the
 * schema only ever parses the YAML above it.
 *
 * Every markdown link target and every raw href in a body is collected here.
 * An in-app route (`/work`) or a fragment (`#print`) is legitimate in prose,
 * so bodies are held to the `source` rule rather than the stricter `content`
 * one; anything that merely LOOKS external still has to be absolute https.
 */
function walkContentBodies(kind) {
  const dir = path.join(ROOT, "content", kind);
  if (!fs.existsSync(dir)) return;

  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!dirent.isDirectory() || dirent.name.startsWith("_")) continue;

    const rel = `content/${kind}/${dirent.name}/index.mdx`;
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) continue;

    const { content } = matter(fs.readFileSync(file, "utf8"));

    // [label](target) — but not ![alt](image), which is not a link.
    for (const match of content.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)/g)) {
      links.push({
        href: match[1],
        label: "(mdx body)",
        source: rel,
        origin: "source",
      });
    }
    // Raw <a href="…"> written as JSX inside a body.
    for (const match of content.matchAll(/href=["']([^"'{}]+)["']/g)) {
      links.push({
        href: match[1],
        label: "(mdx body href)",
        source: rel,
        origin: "source",
      });
    }
  }
}

/* -------------------------------------------------------------------------- */
/* 2. Hand-written links in source                                            */
/* -------------------------------------------------------------------------- */

/** Every href="…" in a .tsx/.ts/.mdx file under app/, components/ and lib/. */
function walkSource(dir) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return;

  for (const dirent of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      walkSource(rel);
      continue;
    }
    if (!/\.(tsx?|mdx)$/.test(dirent.name)) continue;

    const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
    for (const match of text.matchAll(/href=["']([^"'{}]+)["']/g)) {
      links.push({ href: match[1], label: "(source)", source: rel, origin: "source" });
    }
    // Markdown-style links in MDX bodies.
    for (const match of text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
      links.push({ href: match[1], label: "(markdown)", source: rel, origin: "source" });
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

/** Things that look like an external link but are not one, in the exact ways
 *  that produce a 404 on your own domain rather than a visible error. */
function validate({ href, label, source, origin }) {
  const where = `${source} — "${label}"`;

  if (!href) {
    problems.push([where, "empty href"]);
    return false;
  }
  if (href === "TODO" || href.includes("TODO")) {
    problems.push([where, `placeholder href never replaced: "${href}"`]);
    return false;
  }
  // In page code, an internal route or a fragment is a legitimate link.
  // In content frontmatter it never is — see the `origin` note above.
  if (/^(\/|#|mailto:|tel:)/.test(href)) {
    if (origin === "content" && !/^(mailto:|tel:)/.test(href)) {
      problems.push([
        where,
        `relative path in a content link: "${href}" — links[] is for external ` +
          `URLs, and this one resolves against this site and 404s`,
      ]);
    }
    return false;
  }

  if (href.startsWith("//")) {
    problems.push([where, `protocol-relative URL: "${href}" — use https://`]);
    return false;
  }
  if (/^http:\/\//i.test(href)) {
    problems.push([where, `insecure http:// URL: "${href}" — use https://`]);
    return false;
  }
  // A bare domain or a relative path masquerading as external. This is the
  // exact old-site bug: href="www.example.com" resolves to /www.example.com.
  if (!/^https:\/\//i.test(href)) {
    problems.push([
      where,
      `not an absolute URL: "${href}" — this resolves against this site and 404s`,
    ]);
    return false;
  }

  try {
    const url = new URL(href);
    if (!url.hostname.includes(".") || url.hostname.endsWith(".")) {
      problems.push([where, `malformed hostname: "${url.hostname}"`]);
      return false;
    }
  } catch {
    problems.push([where, `unparseable URL: "${href}"`]);
    return false;
  }

  return true;
}

/* -------------------------------------------------------------------------- */
/* Reachability (opt-in)                                                      */
/* -------------------------------------------------------------------------- */

async function probe(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: {
          "user-agent": "portfolio link checker",
          ...(method === "GET" ? { range: "bytes=0-0" } : {}),
        },
      });
      if (res.ok || method === "GET") return { ok: res.ok, status: res.status };
    } catch (err) {
      if (method === "GET") return { ok: false, status: err.name ?? "error" };
    }
  }
  return { ok: false, status: "unreachable" };
}

/* -------------------------------------------------------------------------- */

walkContent("work");
walkContentBodies("work");
walkSource("app");
walkSource("components");
walkSource("lib");

const external = links.filter(validate);

/* The tripwire. Checked against content only — a live project link belongs in
   an entry's links[], not hand-written into a template. */
const contentHrefs = new Set(
  links.filter((l) => l.origin === "content").map((l) => l.href),
);
for (const required of REQUIRED_LIVE) {
  if (!contentHrefs.has(required)) {
    problems.push([
      "content/work/*/index.mdx",
      `required live link missing: "${required}" is not declared in any ` +
        `content entry's links[]. If the project is gone, remove it from ` +
        `REQUIRED_LIVE in this script in the same commit.`,
    ]);
  }
}

if (problems.length) {
  console.error(`\n  ── Malformed links (${problems.length}) ─────────────────\n`);
  for (const [where, why] of problems) {
    console.error(`  ✗ ${why}\n      ${where}`);
  }
  console.error(
    `\n  Build stopped. Every external link must be an absolute https:// URL.\n`,
  );
  process.exit(1);
}

console.log(
  `  Links: ${external.length} external, ${links.length} total checked — all well-formed.`,
);
for (const required of REQUIRED_LIVE) {
  console.log(`         live link present and absolute: ${required}`);
}

if (PROBE && external.length) {
  console.log(`\n  Probing ${external.length} external link(s)…\n`);
  const results = await Promise.all(
    external.map(async (l) => ({ ...l, ...(await probe(l.href)) })),
  );
  let dead = 0;
  for (const r of results) {
    if (!r.ok) dead++;
    console.log(`  ${r.ok ? "ok  " : "DEAD"} ${String(r.status).padEnd(12)} ${r.href}`);
    if (!r.ok) console.log(`       ${r.source} — "${r.label}"`);
  }
  console.log(
    dead === 0
      ? `\n  All ${results.length} reachable.`
      : `\n  ${dead} unreachable. Not blocking the build — verify by hand.`,
  );
}
