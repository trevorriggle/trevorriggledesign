import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

/* ============================================================================
   DESIGN MEDIA, a folder is still the config.
   ============================================================================
   Drop a file into public/design/<category>/ and it appears on that category's
   page, sorted by filename. No manifest, no registry, no per-image frontmatter
   and no import to add. That is the entire system, and it now covers motion as
   well as stills.

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
   that rewrites a file in public/. The earlier archive shipped MP4s that were
   converted by hand, outside the build, from GIF masters. That conversion is
   no longer the rule. See DECISIONS.md.

   THE PAIRING RULE. A video is `<name>.mp4` plus a poster image at the SAME
   STEM, `<name>.jpg`. The poster is what renders before playback and what any
   caller uses when it needs a still. A poster is never listed as a work of its
   own: it is claimed by its video and drops out of the still list, so
   `10-banner.mp4` + `10-banner.jpg` is ONE item in the grid, not two.

   Dimensions come from the file header at build time, the poster's header in
   the video case, so next/image and the <video> box both get real width and
   height and nothing shifts as the page loads.

   Alt text is derived from the filename, "03-catalog-spread.jpg" becomes
   "Catalog spread", and falls back to the category name. It never blocks.

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
/** Extensions tried, in order, when looking for a video's poster. */
const POSTER_EXT = ["jpg", "jpeg", "png", "webp", "avif"];

export type DesignItem = {
  kind: "image" | "video";
  /** The image URL, or the video URL. */
  src: string;
  /** Videos only: the poster frame. */
  poster?: string;
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

/**
 * Filename → alt text.
 *
 * Strips the extension, a leading sort prefix ("03-", "02_"), then turns
 * separators into spaces. Returns "" when nothing meaningful survives, so the
 * caller can fall back to the category name.
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

export function getDesignImages(
  category: string,
  categoryTitle: string,
): DesignItem[] {
  const dir = path.join(process.cwd(), "public", "design", category);
  if (!fs.existsSync(dir)) return [];

  let files: string[];
  try {
    files = fs.readdirSync(dir);
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
    const url = `/design/${category}/${file}`;
    const alt = altFromFilename(file) || categoryTitle;

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
      const poster = `/design/${category}/${posterFile}`;
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

  items.sort((a, b) =>
    a.src.localeCompare(b.src, "en", { numeric: true }),
  );

  return items;
}

/** How many pieces a category has, for the landing page. Pairs count once. */
export function countDesignImages(category: string): number {
  return getDesignImages(category, category).length;
}
