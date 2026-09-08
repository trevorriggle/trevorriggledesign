import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { SELECTED } from "@/content";
import { designCategories } from "@/content/design";

/* ============================================================================
   HOME TILES, the 2x2.
   ============================================================================
   Four doors, and the home page is nothing else. Applications, Design,
   Agentic AI, About. Contact is not here: it is a utility, reachable from the
   nav and the footer, and not something anyone browses into.

   THUMBNAILS ARE DROP-IN, the same rule /design already runs on. Put a file at
   public/home/<slug>.<ext> and that tile grows an image. There is no manifest
   and no import to add:

     public/home/applications.jpg
     public/home/design.jpg
     public/home/agentic-ai.jpg
     public/home/about.jpg

   Dimensions are read from the file header at build time so next/image gets
   real width and height and nothing shifts as the tiles load.

   UNTIL A FILE LANDS the tile renders its title and its count on the flat
   ground, with the grid's own hairlines defining the cell. It does NOT render
   a grey box at the image's aspect ratio. This site has a standing rule
   against placeholder boxes, and a 2x2 of empty rectangles is the largest
   possible violation of it.

   THE COUNTS ARE DERIVED, NEVER WRITTEN. Applications counts the entries in
   SELECTED, Design counts the categories. Neither is a sentence somebody has
   to keep true by hand. Agentic AI and About carry no count, and no invented
   blurb stands in for one.
   ========================================================================= */

const EXTENSIONS = ["png", "jpg", "jpeg", "webp", "avif", "gif", "svg"];

export type TileImage = {
  url: string;
  width: number;
  height: number;
  /** GIF or SVG: served as the file itself, no optimiser. */
  unoptimized: boolean;
};

export type HomeTile = {
  slug: string;
  title: string;
  href: string;
  /** A derived count, or "" when the section has nothing to count. */
  meta: string;
  image: TileImage | null;
};

/** public/home/<slug>.<ext>, first extension that exists. */
function findImage(slug: string): TileImage | null {
  const dir = path.join(process.cwd(), "public", "home");

  for (const ext of EXTENSIONS) {
    const file = path.join(dir, `${slug}.${ext}`);
    if (!fs.existsSync(file)) continue;

    let width = 1600;
    let height = 1200;
    try {
      const dims = imageSize(fs.readFileSync(file));
      if (dims.width && dims.height) {
        width = dims.width;
        height = dims.height;
      }
    } catch {
      /* Unreadable header. It still renders, on the 4:3 default. Never a
         build failure, same contract as lib/design-images.ts. */
    }

    return {
      url: `/home/${slug}.${ext}`,
      width,
      height,
      unoptimized: ext === "gif" || ext === "svg",
    };
  }

  return null;
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

export function getHomeTiles(): HomeTile[] {
  const tiles: Omit<HomeTile, "image">[] = [
    {
      slug: "applications",
      title: "Applications",
      href: "/applications",
      meta: plural(SELECTED.length, "application", "applications"),
    },
    {
      slug: "design",
      title: "Design",
      href: "/design",
      meta: plural(designCategories.length, "body of work", "bodies of work"),
    },
    {
      slug: "agentic-ai",
      title: "Agentic AI",
      href: "/agentic-ai",
      meta: "",
    },
    {
      slug: "about",
      title: "About",
      href: "/about",
      meta: "",
    },
  ];

  return tiles.map((tile) => ({ ...tile, image: findImage(tile.slug) }));
}
