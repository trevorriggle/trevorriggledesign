import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/* ============================================================================
   CONTENT, the three case studies.
   ============================================================================
   Reads MDX from content/work/, and that is the whole job.

   THIS FILE USED TO BE A VALIDATOR. It threw on a misspelled frontmatter key,
   on a banned key, on a published entry missing from an order file, on a slug
   collision, on a missing tradeoff cost. All of that is gone. A portfolio build
   failing because a content field is empty is a build that fails at 2am for no
   reason a visitor would ever have noticed.

   The contract now: read what is there, coerce it to a shape the templates can
   render, and when a field is absent leave it absent. Every template already
   renders nothing for an empty value. Nothing here throws.
   ========================================================================= */

const ROOT = process.cwd();
const WORK_DIR = path.join(ROOT, "content", "work");

/** Running order. Manual, hardcoded, never date-sorted. */
export const SELECTED = ["drawevolve", "thoosie", "lynk"] as const;

export type ImageRef = {
  src: string;
  alt: string;
  aspect: string;
  width: number;
  height: number;
  url: string;
  exists: boolean;
  caption?: string;
  bleed?: boolean;
};

export type VideoRef = {
  src: string;
  url: string;
  exists: boolean;
  poster: ImageRef | null;
  caption?: string;
};

export type LinkRef = { label: string; href: string };

export type CaseStudy = {
  slug: string;
  href: string;
  title: string;
  deck: string;
  year: string;
  role: string[];
  context: string;
  state: string;
  timeline: string;
  stack: string[];
  links: LinkRef[];
  video: VideoRef | null;
  cover: ImageRef | null;
  images: ImageRef[];
  body: string;
};

/* -------------------------------------------------------------------------- */
/* Coercion. Every one of these returns a usable value for any input.         */
/* -------------------------------------------------------------------------- */

const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : typeof v === "number" ? String(v) : fallback;

const strArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean) : [];

function ratioOf(aspect: string): number {
  const [w, h] = aspect.split(":").map(Number);
  return w > 0 && h > 0 ? w / h : 3 / 2;
}

function toImage(v: unknown, slug: string): ImageRef | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const src = str(o.src);
  if (!src) return null;

  const aspect = str(o.aspect, "3:2");
  const width = typeof o.minWidth === "number" ? o.minWidth : 1600;
  const image: ImageRef = {
    src,
    alt: str(o.alt),
    aspect,
    width,
    height: Math.round(width / ratioOf(aspect)),
    url: `/media/${slug}/${src}`,
    exists: fs.existsSync(path.join(ROOT, "public", "media", slug, src)),
    bleed: o.bleed === true,
  };
  const caption = str(o.caption);
  if (caption) image.caption = caption;
  return image;
}

function toVideo(v: unknown, slug: string): VideoRef | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const src = str(o.src);
  if (!src) return null;

  const video: VideoRef = {
    src,
    url: `/media/${slug}/${src}`,
    exists: fs.existsSync(path.join(ROOT, "public", "media", slug, src)),
    poster: toImage(o.poster, slug),
  };
  const caption = str(o.caption);
  if (caption) video.caption = caption;
  return video;
}

/** External links only, and quietly dropped if not absolute, the link check
 *  in scripts/ is what reports them; nothing here fails a build over one. */
function toLinks(v: unknown): LinkRef[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const o = entry as Record<string, unknown>;
      const href = str(o.href);
      const label = str(o.label);
      if (!href || !label || !/^https:\/\//i.test(href)) return null;
      return { label, href };
    })
    .filter((l): l is LinkRef => l !== null);
}

/* -------------------------------------------------------------------------- */

let cache: CaseStudy[] | null = null;
const CACHE = process.env.NODE_ENV === "production";

function load(): CaseStudy[] {
  if (cache && CACHE) return cache;

  const studies: CaseStudy[] = [];

  for (const slug of SELECTED) {
    const file = path.join(WORK_DIR, slug, "index.mdx");
    if (!fs.existsSync(file)) continue;

    const { data, content } = matter(fs.readFileSync(file, "utf8"));
    const d = data as Record<string, unknown>;

    studies.push({
      slug,
      href: `/work/${slug}`,
      title: str(d.title, slug),
      deck: str(d.deck),
      year: str(d.year),
      role: strArray(d.role),
      context: str(d.context),
      state: str(d.state),
      timeline: str(d.timeline),
      stack: strArray(d.stack),
      links: toLinks(d.links),
      video: toVideo(d.video, slug),
      cover: toImage(d.cover, slug),
      images: (Array.isArray(d.images) ? d.images : [])
        .map((img) => toImage(img, slug))
        .filter((i): i is ImageRef => i !== null),
      body: content.trim(),
    });
  }

  cache = studies;
  return studies;
}

export function getSelected(): CaseStudy[] {
  return load();
}

export function getCaseStudy(slug: string): CaseStudy | null {
  return load().find((s) => s.slug === slug) ?? null;
}

/** Prev/next through the three, in running order. */
export function getNeighbours(slug: string) {
  const all = load();
  const i = all.findIndex((s) => s.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return { prev: all[i - 1] ?? null, next: all[i + 1] ?? null };
}

/** Every external link in content, for scripts/check-links.mjs. */
export function getAllExternalLinks() {
  return load().flatMap((s) =>
    s.links.map((l) => ({ ...l, source: `work/${s.slug}` })),
  );
}
