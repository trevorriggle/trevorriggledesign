import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

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

   UNTIL A FILE LANDS the tile renders its title on the flat ground, with the
   grid's own hairlines defining the cell. It does NOT render
   a grey box at the image's aspect ratio. This site has a standing rule
   against placeholder boxes, and a 2x2 of empty rectangles is the largest
   possible violation of it.

   THE COUNTS ARE GONE. Each tile used to carry a derived string under its
   title: "3 applications", "3 bodies of work". They were honest and they were
   maintenance-free, and they were still the wrong thing to put on a door,
   because a count is a statement about how MUCH there is, and the number is
   small. "3 applications" answers a question nobody asked on the way in and
   answers it discouragingly. The tile is its name and its picture.

   Removed as part of the site-wide chip cull, which also took the status
   badges off the browse tier. See lib/cards.ts.
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

export function getHomeTiles(): HomeTile[] {
  const tiles: Omit<HomeTile, "image">[] = [
    { slug: "applications", title: "Applications", href: "/applications" },
    { slug: "design", title: "Design", href: "/design" },
    { slug: "agentic-ai", title: "Agentic AI", href: "/agentic-ai" },
    { slug: "about", title: "About", href: "/about" },
  ];

  return tiles.map((tile) => ({ ...tile, image: findImage(tile.slug) }));
}
