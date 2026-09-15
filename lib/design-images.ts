import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { designThumbs } from "@/content/design";

/* ============================================================================
   DESIGN MEDIA, a folder is still the config, and now a folder is a GROUP.
   ============================================================================
   Two levels, both read straight off disk:

     public/design/<category>/NN.<ext>              an ungrouped piece
     public/design/<category>/NN-<group>/NN.<ext>    a piece inside a group

   THE NUMERIC PREFIX IS THE ORDER, at both levels. "02-print" is the second
   group and its slug is `print`; the prefix never reaches a title or a URL.
   A category with no group directories is a flat gallery and its own page is
   the detail view, which is the right shape for a body of work small enough
   that splitting it would be pretend structure.

   TITLES ARE DERIVED FROM THE DIRECTORY NAME, "03-social-media" -> "Social
   Media". Nothing is written here. The drop's own folder names are the source,
   which is why they survive the import unaltered apart from casing.

   MOTION IS TWO FORMATS, AND THE FORMAT ON DISK IS THE FORMAT THAT SHIPS.

   A .gif is an IMAGE here, and it is served byte-for-byte: `passthrough` is
   set on it and the caller puts that on next/image's `unoptimized`, so the
   file goes out at its own URL, not through /_next/image, and no optimiser,
   resize or format negotiation ever touches it. An animated GIF that went
   through the optimiser could come back as a still first frame; nothing in
   this pipeline gives it the chance. Same flag for SVG, which next/image
   already exempts by extension, made explicit here so both live in one place.

   A .mp4 is a VIDEO, and only a file that is already an .mp4 is one. Nothing
   in this repo transcodes: there is no sharp, no ffmpeg step, no build hook
   that rewrites a file in public/. See DECISIONS.md.

   THE PAIRING RULE. A video is `<name>.mp4` plus a poster image at the SAME
   STEM, `<name>.jpg`. The poster is what renders before playback and what any
   caller uses when it needs a still. A poster is never listed as a work of its
   own: it is claimed by its video and drops out of the still list.

   Dimensions come from the file header at build time, the poster's header in
   the video case, so next/image and the <video> box both get real width and
   height and nothing shifts as the page loads.

   THUMBNAILS. Every card needs one representative still, and the default is
   the first item, which is the first file of the first group. That default is
   frequently wrong: the first file is whatever sorted first, not the strongest
   piece. `designThumbs` in content/design.ts overrides it by path, and that
   map is the only place a thumbnail choice is recorded.

   An empty or absent folder returns an empty array. Callers render their copy
   and no grid.
   ========================================================================= */

const IMAGE_EXT = /\.(png|jpe?g|webp|avif|gif|svg)$/i;
/**
 * Formats served byte-for-byte, never through the image optimiser.
 *
 * GIF because an animated one must stay animated, and SVG because it is
 * vector and resizing is meaningless. Both are a `unoptimized` on the
 * <Image> at the other end.
 */
const PASSTHROUGH_EXT = /\.(gif|svg)$/i;
const VIDEO_EXT = /\.(mp4|webm)$/i;
/**
 * `card.jpg` at a category root: the browsing card, and never a gallery item.
 *
 * WHY THIS EXISTS. A category's card image was always one of the pieces in its
 * folders, picked by `designThumbs`. That works when one of the pieces happens
 * to survive a 4:3 crop at 380px, and it fails when the right card is a shot
 * that does not belong in the archive at all: Personal Works is illustration
 * and comics, and the picture that sells it is one of those drawings ON an
 * iPad on a desk. Dropping that into 03-drawings would print the same portrait
 * twice, once as the work and once as a photograph of the work.
 *
 * So a card is addressed by filename rather than by position. It is measured
 * and available to the thumbnail picker like anything else, and it is filtered
 * out of every gallery. Same idea as the poster-claiming rule below: a file
 * with a job other than being looked at in the grid does not appear in it.
 */
const CARD_FILE = /^card\.(png|jpe?g|webp|avif)$/i;
/** Extensions tried, in order, when looking for a video's poster. */
const POSTER_EXT = ["jpg", "jpeg", "png", "webp", "avif"];

/** "02-print" -> { order: 2, slug: "print" }. An unprefixed name sorts last. */
const GROUP_DIR = /^(\d{1,3})-(.+)$/;

export type DesignItem = {
  kind: "image" | "video";
  /** The image URL, or the video URL. */
  src: string;
  /** Videos only: the poster frame. */
  poster?: string;
  /** `card.jpg` at a category root. The browsing card, never a gallery item. */
  card?: boolean;
  /**
   * A still URL that is always safe to put in an <Image>. Equals `src` for an
   * image and `poster` for a video, so a caller that needs one picture (a lead,
   * a thumbnail, an OG card) never has to branch on `kind`.
   */
  still: string;
  alt: string;
  width: number;
  height: number;
  ratio: number;
  /**
   * Serve `still` exactly as it sits on disk, no optimiser. True for GIF and
   * SVG. Videos carry `false`: their poster is a still JPG/PNG and optimising
   * it is both safe and worth doing.
   */
  passthrough: boolean;
};

export type DesignGroup = {
  /** URL segment: /design/<category>/<slug>. Prefix stripped. */
  slug: string;
  /** Derived from the directory name. "03-social-media" -> "Social Media". */
  title: string;
  order: number;
  href: string;
  items: DesignItem[];
  /** The card image. `designThumbs` first, else the first item. */
  thumb: DesignItem | null;
};

/**
 * Filename → alt text.
 *
 * Strips the extension, a leading sort prefix ("03-", "02_"), then turns
 * separators into spaces. Returns "" when nothing meaningful survives, so the
 * caller can fall back to the group or category name.
 */
function altFromFilename(file: string): string {
  const base = file
    .replace(IMAGE_EXT, "")
    .replace(VIDEO_EXT, "")
    .replace(/^[\d._-]+/, "")
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!base) return "";
  if (/^\d+$/.test(base)) return "";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/** "social-media" -> "Social Media". Derivation, never authored copy. */
function titleFromSlug(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function measure(file: string): { width: number; height: number } {
  try {
    const dims = imageSize(fs.readFileSync(file));
    if (dims.width && dims.height) {
      return { width: dims.width, height: dims.height };
    }
  } catch {
    /* Unreadable header (an odd SVG, a truncated file). It still renders, it
       just lays out on the 3:2 default. Never a build failure. */
  }
  return { width: 1600, height: 1067 };
}

/** The comparator every level sorts with, so import order == page order. */
const byName = (a: string, b: string) =>
  a.localeCompare(b, "en", { numeric: true });

/**
 * Every item in one directory, non-recursive.
 *
 * `urlBase` is what the filenames hang off, and `altFallback` is the name used
 * when a filename carries no words, which is every file the importer wrote.
 */
function itemsIn(
  dir: string,
  urlBase: string,
  altFallback: string,
): DesignItem[] {
  let files: string[];
  try {
    files = fs.readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isFile())
      .map((e) => e.name);
  } catch {
    return [];
  }

  const videos = files.filter((f) => VIDEO_EXT.test(f));

  /* Every image that is some video's poster. Claimed here so the still pass
     below skips them and a clip does not render twice. */
  const claimed = new Set<string>();
  for (const video of videos) {
    const stem = video.replace(VIDEO_EXT, "");
    for (const ext of POSTER_EXT) {
      const candidate = `${stem}.${ext}`;
      if (files.includes(candidate)) {
        claimed.add(candidate);
        break;
      }
    }
  }

  const items: DesignItem[] = [];

  for (const file of files) {
    const url = `${urlBase}/${file}`;
    const alt = altFromFilename(file) || altFallback;

    if (VIDEO_EXT.test(file)) {
      const stem = file.replace(VIDEO_EXT, "");
      const posterFile = POSTER_EXT.map((e) => `${stem}.${e}`).find((c) =>
        files.includes(c),
      );

      /* A clip with no poster is skipped rather than rendered as a black box:
         there is nothing to show before playback, nothing for a caller that
         needs a still, and no header to read dimensions from. */
      if (!posterFile) continue;

      const { width, height } = measure(path.join(dir, posterFile));
      const poster = `${urlBase}/${posterFile}`;
      items.push({
        kind: "video",
        src: url,
        poster,
        still: poster,
        alt,
        width,
        height,
        ratio: width / height,
        /* A poster is one of POSTER_EXT, never a GIF or an SVG. */
        passthrough: false,
      });
      continue;
    }

    if (!IMAGE_EXT.test(file)) continue;
    if (claimed.has(file)) continue;

    const { width, height } = measure(path.join(dir, file));
    items.push({
      card: CARD_FILE.test(file),
      kind: "image",
      src: url,
      still: url,
      alt,
      width,
      height,
      ratio: width / height,
      passthrough: PASSTHROUGH_EXT.test(file),
    });
  }

  items.sort((a, b) => byName(a.src, b.src));
  return items;
}

function categoryDir(category: string): string {
  return path.join(process.cwd(), "public", "design", category);
}

/**
 * The group directories of a category, in prefix order.
 *
 * Returns [] for a flat category, which is how every caller tells the two
 * shapes apart.
 */
export function getDesignGroups(
  category: string,
  categoryTitle: string,
): DesignGroup[] {
  const dir = categoryDir(category);
  if (!fs.existsSync(dir)) return [];

  let dirs: string[];
  try {
    dirs = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  } catch {
    return [];
  }

  const groups = dirs.map((name) => {
    const m = GROUP_DIR.exec(name);
    const slug = m ? m[2] : name;
    const order = m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
    const title = titleFromSlug(slug);
    const items = itemsIn(
      path.join(dir, name),
      `/design/${category}/${name}`,
      title || categoryTitle,
    );

    return {
      slug,
      title,
      order,
      href: `/design/${category}/${slug}`,
      items,
      thumb: pickThumb(items, designThumbs[`${category}/${slug}`]),
    };
  });

  /* A group with no readable media is not a group. It would card up as an
     empty box linking to an empty page. */
  return groups
    .filter((g) => g.items.length > 0)
    .sort((a, b) => a.order - b.order || byName(a.slug, b.slug));
}

/** One group by slug, prefix-insensitive, or null. */
export function getDesignGroup(
  category: string,
  categoryTitle: string,
  slug: string,
): DesignGroup | null {
  return (
    getDesignGroups(category, categoryTitle).find((g) => g.slug === slug) ??
    null
  );
}

/** Items sitting directly in the category folder, ungrouped. */
export function getUngroupedImages(
  category: string,
  categoryTitle: string,
): DesignItem[] {
  /* The card is measured and pickable, and it is not a piece of work. */
  return rootItems(category, categoryTitle).filter((item) => !item.card);
}

/** Loose files at a category root, INCLUDING the card. Internal. */
function rootItems(category: string, categoryTitle: string): DesignItem[] {
  const dir = categoryDir(category);
  if (!fs.existsSync(dir)) return [];
  return itemsIn(dir, `/design/${category}`, categoryTitle);
}

/**
 * Every image in a category, groups flattened in order, for counts and for the
 * flat gallery a grouped category never renders.
 */
export function getDesignImages(
  category: string,
  categoryTitle: string,
): DesignItem[] {
  return [
    ...rootItems(category, categoryTitle),
    ...getDesignGroups(category, categoryTitle).flatMap((g) => g.items),
  ];
}

/**
 * `designThumbs` wins, then the first item.
 *
 * An override that matches nothing on disk falls through to the default
 * rather than blanking the card: a stale path in that map is a typo, not a
 * reason for a page to lose its thumbnail.
 */
function pickThumb(
  items: DesignItem[],
  override: string | undefined,
): DesignItem | null {
  if (override) {
    const found = items.find((i) => i.still.endsWith(`/${override}`));
    if (found) return found;
  }
  return items[0] ?? null;
}

/** The card image for a whole category. Looks through its groups. */
export function getCategoryThumb(
  category: string,
  categoryTitle: string,
): DesignItem | null {
  const all = getDesignImages(category, categoryTitle);
  return pickThumb(all, designThumbs[category]);
}

/** How many pieces a category has. Pairs count once, a card counts never. */
export function countDesignImages(category: string): number {
  return getDesignImages(category, category).filter((i) => !i.card).length;
}
