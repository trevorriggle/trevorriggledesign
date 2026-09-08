import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { getHomeTiles } from "@/lib/home-tiles";
import styles from "./page.module.css";

/* ============================================================================
   HOME
   ============================================================================
   Four tiles in a 2x2, and nothing else on the page.

   WHAT THIS REPLACED. The home page used to BE the Applications page: a 129px
   hero statement, then the three case studies, then the design categories, all
   on one scroll. Applications now has its own route at /applications, which is
   where the nav points, and the hero statement is gone.

   No hero, no statement, no rail. The page is a set of doors. Every tile is
   one link wrapping its image and its title, so the whole cell is the target
   rather than a small hit area on the text.

   Tiles and their thumbnails come from lib/home-tiles.ts. A tile with no image
   file renders its title on the flat ground and the grid hairlines carry the
   composition, because a 2x2 of grey placeholder rectangles is the one thing
   this page must not be.
   ========================================================================= */

export default function HomePage() {
  const tiles = getHomeTiles();

  return (
    <Container as="section" className={styles.home}>
      <h1 className="visually-hidden">Trevor Riggle, design and software</h1>

      <ul className={styles.grid}>
        {tiles.map((tile, i) => (
          <li key={tile.slug} className={styles.cell}>
            <Link href={tile.href} className={styles.tile}>
              {tile.image && (
                <span className={styles.media}>
                  <Image
                    src={tile.image.url}
                    alt=""
                    width={tile.image.width}
                    height={tile.image.height}
                    sizes="(max-width: 48rem) 100vw, 50vw"
                    priority={i < 2}
                    className={styles.image}
                  />
                </span>
              )}

              <span className={styles.label}>
                <span className={styles.title}>{tile.title}</span>
                {tile.meta && <span className={styles.meta}>{tile.meta}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
