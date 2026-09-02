import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

import {
  assertNoBannedKeys,
  caseStudySchema,
  gallerySchema,
  intrinsicSize,
  type CaseStudyFrontmatter,
  type GalleryFrontmatter,
  type ImageRef,
} from "./schema";
import { sections, getSection, type Section, type SectionKind } from "./sections";
import { entryOrder } from "./order";

/* ============================================================================
   CONTENT LOADER
   ============================================================================
   Reads MDX from content/, validates frontmatter, and resolves declared images
   against public/media/. Everything that can be wrong fails here with an error
   naming the file and the field.

   The one thing that is deliberately NOT an error: a declared image whose file
   does not exist yet. Those resolve to `exists: false` and render as a
   <Placeholder />. That is the load-bearing decision behind this file — the
   site has to be buildable and composition-reviewable with zero assets, so a
   missing asset is a known state, not a failure. Everything else about it is
   still validated: the filename, the aspect, the alt text and the content
   label are all required whether the file is there or not.

   Images are referenced by public path rather than statically imported for the
   same reason. A static import of a nonexistent file is an unrecoverable
   module-resolution error; a public path is just a string until the file
   arrives, at which point next/image serves and optimises it with no edit
   anywhere. The cost is that intrinsic dimensions come from frontmatter
   instead of the file — which is why `aspect` and `minWidth` are required.
   ========================================================================= */

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content");
const CASE_DIR = path.join(CONTENT_ROOT, "work");
const GALLERY_DIR = path.join(CONTENT_ROOT, "gallery");

/** Where every content image lives: public/media/<slug>/<filename>. */
export const MEDIA_ROOT = path.join(ROOT, "public", "media");
export const mediaDir = (slug: string) => path.join(MEDIA_ROOT, slug);
export const mediaUrl = (slug: string, src: string) => `/media/${slug}/${src}`;

/**
 * Drafts render in dev and on preview deploys, never on production by default.
 *
 * This matters more than usual here: the seeded AI stubs are `status: draft`
 * precisely because their prose is still TODO, so the default protects the
 * production domain from publishing placeholder text the moment it deploys.
 * Flip a stub to `status: published` when its prose is written.
 *
 * SHOW_DRAFTS=1 forces them on in a production build — for reviewing the whole
 * structure as it will look when filled, without publishing it.
 */
const SHOW_DRAFTS =
  process.env.SHOW_DRAFTS === "1" ||
  process.env.NODE_ENV !== "production" ||
  process.env.VERCEL_ENV === "preview";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ResolvedImage = ImageRef & {
  /** Public URL. Valid whether or not the file is on disk yet. */
  url: string;
  /** Intrinsic dimensions from the declared aspect + minWidth. */
  width: number;
  height: number;
  ratio: number;
  /** False -> renders as <Placeholder />. */
  exists: boolean;
  /** Repo-relative path, printed on the placeholder and in MANIFEST.md. */
  expectedAt: string;
};

type Base = { slug: string; href: string; body: string; sectionMeta: Section };

export type CaseStudy = Omit<CaseStudyFrontmatter, "cover" | "images" | "architecture"> &
  Base & {
    kind: "case";
    cover: ResolvedImage | null;
    images: ResolvedImage[];
    architecture:
      | (Omit<NonNullable<CaseStudyFrontmatter["architecture"]>, "diagram"> & {
          diagram: ResolvedImage | null;
        })
      | null;
  };

export type GalleryEntry = Omit<GalleryFrontmatter, "images"> &
  Base & {
    kind: "gallery";
    images: ResolvedImage[];
  };

export type Entry = CaseStudy | GalleryEntry;

export type PopulatedSection = Section & {
  ordinal: string;
  entries: Entry[];
};

/* -------------------------------------------------------------------------- */
/* Errors                                                                     */
/* -------------------------------------------------------------------------- */

class ContentError extends Error {
  constructor(message: string) {
    super(`\n\n  ── Content error ──────────────────────────────\n  ${message}\n`);
    this.name = "ContentError";
  }
}

function formatZodError(file: string, error: z.ZodError): string {
  const lines = error.issues.map((issue) => {
    const where = issue.path.length ? issue.path.join(".") : "(root)";
    return `    · ${where}: ${issue.message}`;
  });
  return `${file}\n  Frontmatter failed validation:\n${lines.join("\n")}`;
}

/* -------------------------------------------------------------------------- */
/* Filesystem                                                                 */
/* -------------------------------------------------------------------------- */

/** Entry folders, skipping `_`-prefixed ones (templates, scratch). */
function entrySlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .map((d) => d.name)
    .sort();
}

function readEntry(dir: string, slug: string, kind: string) {
  const file = path.join(dir, slug, "index.mdx");
  if (!fs.existsSync(file)) {
    throw new ContentError(`content/${kind}/${slug}/ has no index.mdx`);
  }
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { data, body: content.trim() };
}

/* -------------------------------------------------------------------------- */
/* Images                                                                     */
/* -------------------------------------------------------------------------- */

function resolveImage(slug: string, ref: ImageRef): ResolvedImage {
  const { width, height } = intrinsicSize(ref);
  const abs = path.join(mediaDir(slug), ref.src);

  return {
    ...ref,
    url: mediaUrl(slug, ref.src),
    width,
    height,
    ratio: width / height,
    exists: fs.existsSync(abs),
    expectedAt: `public/media/${slug}/${ref.src}`,
  };
}

/* -------------------------------------------------------------------------- */
/* Validation of the section/order contract                                   */
/* -------------------------------------------------------------------------- */

function assertSection(slug: string, kind: SectionKind, sectionId: string) {
  const section = getSection(sectionId);
  if (!section) {
    throw new ContentError(
      `content/${kind === "case" ? "work" : "gallery"}/${slug}/index.mdx\n` +
        `  section: "${sectionId}" is not a section id.\n` +
        `  Valid ids: ${sections.map((s) => s.id).join(", ")}`,
    );
  }
  if (section.kind !== kind) {
    throw new ContentError(
      `content/${kind === "case" ? "work" : "gallery"}/${slug}/index.mdx\n` +
        `  section "${sectionId}" is a ${section.kind} section, but this entry is a ${kind}.\n` +
        `  Either move the folder to content/${section.kind === "case" ? "work" : "gallery"}/ ` +
        `or point it at a ${kind} section.`,
    );
  }
  return section;
}

/**
 * Apply the manual running order, and assert it has not drifted from the
 * folders on disk in either direction.
 */
function orderEntries(all: Entry[]): PopulatedSection[] {
  const bySlug = new Map(all.map((e) => [e.slug, e]));
  const claimed = new Set<string>();

  const populated = sections.map((section, i) => {
    const order = entryOrder[section.id] ?? [];

    const missing = order.filter((s) => !bySlug.has(s));
    if (missing.length) {
      throw new ContentError(
        `content/order.ts — section "${section.id}" lists ${missing.length} slug(s) with no folder:\n` +
          missing.map((s) => `    · "${s}"`).join("\n") +
          `\n  Create the folder or remove the line.`,
      );
    }

    const ordered = order.map((s) => {
      claimed.add(s);
      const entry = bySlug.get(s)!;
      if (entry.section !== section.id) {
        throw new ContentError(
          `content/order.ts lists "${s}" under section "${section.id}", ` +
            `but its frontmatter says section: "${entry.section}".`,
        );
      }
      return entry;
    });

    return {
      ...section,
      ordinal: String(i + 1).padStart(2, "0"),
      entries: ordered.filter((e) => SHOW_DRAFTS || e.status === "published"),
    };
  });

  const unlisted = all.filter(
    (e) => e.status === "published" && !claimed.has(e.slug),
  );
  if (unlisted.length) {
    throw new ContentError(
      `${unlisted.length} published entry(s) missing from content/order.ts:\n` +
        unlisted
          .map((e) => `    · "${e.slug}" (section: ${e.section})`)
          .join("\n") +
        `\n  Add each slug to its section's array — position decides where it ranks.\n` +
        `  Nothing is date-sorted, so an unlisted entry has no position and would vanish.`,
    );
  }

  return populated;
}

/* -------------------------------------------------------------------------- */
/* Load                                                                       */
/* -------------------------------------------------------------------------- */

let cache: PopulatedSection[] | null = null;

function loadAll(): PopulatedSection[] {
  if (cache) return cache;

  const entries: Entry[] = [];

  // ---- case studies ----
  for (const slug of entrySlugs(CASE_DIR)) {
    const { data, body } = readEntry(CASE_DIR, slug, "work");
    assertNoBannedKeys(data, `content/work/${slug}/index.mdx`);
    const parsed = caseStudySchema.safeParse(data);
    if (!parsed.success) {
      throw new ContentError(
        formatZodError(`content/work/${slug}/index.mdx`, parsed.error),
      );
    }
    const fm = parsed.data;
    const sectionMeta = assertSection(slug, "case", fm.section);

    entries.push({
      ...fm,
      kind: "case",
      slug,
      href: `/work/${slug}`,
      body,
      sectionMeta,
      cover: fm.cover ? resolveImage(slug, fm.cover) : null,
      images: fm.images.map((img) => resolveImage(slug, img)),
      architecture: fm.architecture
        ? {
            ...fm.architecture,
            diagram: fm.architecture.diagram
              ? resolveImage(slug, fm.architecture.diagram)
              : null,
          }
        : null,
    });
  }

  // ---- gallery ----
  for (const slug of entrySlugs(GALLERY_DIR)) {
    const { data, body } = readEntry(GALLERY_DIR, slug, "gallery");
    assertNoBannedKeys(data, `content/gallery/${slug}/index.mdx`);
    const parsed = gallerySchema.safeParse(data);
    if (!parsed.success) {
      throw new ContentError(
        formatZodError(`content/gallery/${slug}/index.mdx`, parsed.error),
      );
    }
    const fm = parsed.data;
    const sectionMeta = assertSection(slug, "gallery", fm.section);

    entries.push({
      ...fm,
      kind: "gallery",
      slug,
      href: `/work/${slug}`,
      body,
      sectionMeta,
      images: fm.images.map((img) => resolveImage(slug, img)),
    });
  }

  // Case studies and gallery entries share one /work/[slug] namespace, so a
  // collision between the two folders would make one of them unreachable.
  const seen = new Map<string, string>();
  for (const e of entries) {
    const prev = seen.get(e.slug);
    if (prev) {
      throw new ContentError(
        `slug collision: "${e.slug}" exists in both content/work/ and content/gallery/.\n` +
          `  Both would resolve to /work/${e.slug}. Rename one.`,
      );
    }
    seen.set(e.slug, e.kind);
  }

  cache = orderEntries(entries);
  return cache;
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

export function getSections(): PopulatedSection[] {
  return loadAll();
}

/** Sections that have at least one visible entry. */
export function getNonEmptySections(): PopulatedSection[] {
  return loadAll().filter((s) => s.entries.length > 0);
}

export function getAllEntries(): Entry[] {
  return loadAll().flatMap((s) => s.entries);
}

export function getEntry(slug: string): Entry | null {
  return getAllEntries().find((e) => e.slug === slug) ?? null;
}

/** Running-order neighbours, for the prev/next pager. Walks across section
 *  boundaries because the running order is one continuous sequence. */
export function getNeighbours(slug: string): {
  prev: Entry | null;
  next: Entry | null;
} {
  const all = getAllEntries();
  const i = all.findIndex((e) => e.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return { prev: all[i - 1] ?? null, next: all[i + 1] ?? null };
}

/** The top of the running order, for the home page. */
export function getFeatured(count: number): Entry[] {
  return getAllEntries().slice(0, count);
}

/** Every image the site expects, whether or not it exists. Drives MANIFEST.md
 *  and the asset-coverage report. */
export function getAllImages(): (ResolvedImage & {
  slug: string;
  entryTitle: string;
  role: string;
})[] {
  return getAllEntries().flatMap((e) => {
    const rows: (ResolvedImage & { slug: string; entryTitle: string; role: string })[] = [];
    const add = (img: ResolvedImage | null, role: string) => {
      if (img) rows.push({ ...img, slug: e.slug, entryTitle: e.title, role });
    };

    if (e.kind === "case") {
      add(e.cover, "cover");
      add(e.architecture?.diagram ?? null, "architecture diagram");
      e.images.forEach((img, i) => add(img, `images[${i}]`));
    } else {
      e.images.forEach((img, i) => add(img, i === 0 ? "images[0] (lead)" : `images[${i}]`));
    }
    return rows;
  });
}

/** Every external link in content, for scripts/check-links.mjs. */
export function getAllExternalLinks() {
  return getAllEntries().flatMap((e) =>
    e.links.map((l) => ({ ...l, source: `${e.kind}/${e.slug}` })),
  );
}

export { sections, getSection };
export type { Section };
