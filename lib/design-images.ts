import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

/* ============================================================================
   DESIGN IMAGES, a folder is the config.
   ============================================================================
   Drop a file into public/design/<category>/ and it appears on that category's
   page, sorted by filename. There is no manifest, no registry, no per-image
   frontmatter and no import to add. That is the entire system.

   Dimensions are read from the file header at build time, which is what makes
   two things possible without any configuration: next/image gets real
   width/height so nothing shifts as images load, and the grid can lay out on
   true aspect ratios instead of forcing everything into a uniform tile.

   Alt text is derived from the filename, "03-catalog-spread.jpg" becomes
   "catalog spread", and falls back to the category name. It never blocks:
   a file with an unhelpful name still renders, it just gets a plainer
   description.

   An empty or absent folder returns an empty array. Callers render their copy
   and no grid.
   ========================================================================= */

const EXTENSIONS = /\.(png|jpe?g|webp|avif|gif|svg)$/i;

export type DesignImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  ratio: number;
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
    .replace(EXTENSIONS, "")
    .replace(/^[\d._-]+/, "")
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!base) return "";
  // A name that is only digits or a stray token carries no information.
  if (/^\d+$/.test(base)) return "";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export function getDesignImages(category: string, categoryTitle: string): DesignImage[] {
  const dir = path.join(process.cwd(), "public", "design", category);
  if (!fs.existsSync(dir)) return [];

  let files: string[];
  try {
    files = fs.readdirSync(dir).filter((f) => EXTENSIONS.test(f));
  } catch {
    return [];
  }

  files.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

  const images: DesignImage[] = [];

  for (const file of files) {
    let width = 1600;
    let height = 1067;

    try {
      const dims = imageSize(fs.readFileSync(path.join(dir, file)));
      if (dims.width && dims.height) {
        width = dims.width;
        height = dims.height;
      }
    } catch {
      /* Unreadable header (an odd SVG, a truncated file). It still renders, it just lays out on the 3:2 default. Never a build failure. */
    }

    images.push({
      src: `/design/${category}/${file}`,
      alt: altFromFilename(file) || categoryTitle,
      width,
      height,
      ratio: width / height,
    });
  }

  return images;
}

/** How many images a category has, for the landing page. */
export function countDesignImages(category: string): number {
  const dir = path.join(process.cwd(), "public", "design", category);
  if (!fs.existsSync(dir)) return 0;
  try {
    return fs.readdirSync(dir).filter((f) => EXTENSIONS.test(f)).length;
  } catch {
    return 0;
  }
}
