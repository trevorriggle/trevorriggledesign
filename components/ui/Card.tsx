import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { CardMedia } from "./CardMedia";
import styles from "./Card.module.css";

/* ============================================================================
   PREVIEW CARD, and the grid it lives in.
   ============================================================================
   ONE browsing unit, used at every level of the site: an application, a body
   of design work, a group inside one. Same shape every time.

   WHAT THIS REPLACED. Every level used to render its own thing. Applications
   stacked full-width media, so a 2064x2752 iPad screenshot came out roughly
   1200 wide and 1600 tall and one entry was a screenful. /design ran a lead
   image at its own proportion beside the copy. A category page was a wall of
   images at ratio-derived spans. Three treatments, none of them comparable,
   and browsing meant scrolling past assets at close to native size.

   THE FIXED RATIO IS THE WHOLE POINT. The thumbnail box is 4:3 for every card
   regardless of what is in it, and the image fills it with `object-fit:
   cover`. A tall phone screenshot and a wide print spread produce the SAME
   SHAPED CARD, which is what makes a grid of them scannable. Nothing is
   rendered at its own proportion at this tier; proportion is the detail
   view's job, and the detail view keeps it exactly.

   `object-position: center` on the crop, deliberately, not `top`: these are
   mostly mockups and single subjects that sit in the middle of their frame.

   NO PLACEHOLDER BOX. A card with no thumbnail renders its text and no media
   element, same standing rule as the rest of the site. The row closes up.

   THE WHOLE CARD IS THE TARGET. One <Link> wraps media and text, so there is
   no small hit area on a title, and the image carries `alt=""` because the
   title inside the same link is already the accessible name. A second name
   there would just be announced twice.

   `index` DRIVES THE ENTRANCE, and it is the only reason the component knows
   its own position. The grid's cards fade up in sequence on load, staggered
   off `--i` in CSS rather than through a framer reveal, because the first row
   of a card grid is ABOVE THE FOLD on both `/applications` and `/design`: a
   framer reveal would ship it at `opacity: 0` in the server HTML, make the
   first card's `priority` image pointless, and hand the page's LCP to a JS
   chunk. Keyframes run on first paint with nothing hydrated. Same reasoning,
   and the same technique, as the home statement.
   ========================================================================= */

export type CardData = {
  href: string;
  title: string;
  /** One line. A deck or an intro, verbatim, never body copy. */
  description?: string;
  /** A derived count or a status word. Never a written sentence. */
  meta?: string;
  thumb: {
    url: string;
    /** GIF or SVG: served as the file itself. */
    unoptimized: boolean;
  } | null;
};

/** Two densities, and the `sizes` hint has to match or the browser fetches
 *  the wrong file. `lead` is the 2-up grid on /applications and /design, where
 *  a card lands near 600px wide and the 4:3 box near 450px tall. `index` is
 *  the 3-up grid used deeper in, near 380px wide. */
export type CardSize = "lead" | "index";

const CARD_SIZES: Record<CardSize, string> = {
  lead: "(max-width: 34rem) 100vw, (max-width: 62rem) 50vw, 44rem",
  index: "(max-width: 34rem) 100vw, (max-width: 62rem) 50vw, 30rem",
};

export function Card({
  card,
  priority = false,
  index = 0,
  size = "index",
}: {
  card: CardData;
  /** LCP hint for the first card or two of a page's lead grid. */
  priority?: boolean;
  /** Position in its grid. Drives the CSS entrance stagger, nothing else. */
  index?: number;
  /** Which grid density this card is in. Picks the `sizes` hint. */
  size?: CardSize;
}) {
  return (
    <li
      className={styles.cell}
      style={{ "--i": index } as CSSProperties}
    >
      <Link href={card.href} className={styles.card}>
        {card.thumb && (
          <CardMedia>
            <Image
              src={card.thumb.url}
              alt=""
              fill
              sizes={CARD_SIZES[size]}
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              /* An animated GIF thumbnail stays animated: straight from
                 /design/, never through /_next/image. */
              unoptimized={card.thumb.unoptimized}
              className={styles.image}
              /* The magnify is a drag target otherwise, and dragging a
                 thumbnail off a card is nobody's intention. */
              draggable={false}
            />

            {/* The chip that follows the cursor across the crop. A glyph, not
                copy, and `aria-hidden` because the title inside this same
                link is already the accessible name. */}
            <span className={styles.cursor} aria-hidden="true">
              &rarr;
            </span>
          </CardMedia>
        )}

        <span className={styles.text}>
          <span className={styles.title}>{card.title}</span>
          {card.description && (
            <span className={styles.description}>{card.description}</span>
          )}
          {card.meta && <span className={styles.meta}>{card.meta}</span>}
        </span>
      </Link>
    </li>
  );
}

export function CardGrid({
  cards,
  /** Marks the first card as the LCP candidate. Only a page's lead grid. */
  priorityFirst = false,
  label,
  size = "index",
}: {
  cards: CardData[];
  priorityFirst?: boolean;
  label?: string;
  /**
   * `lead` is 2-up and large, for a page whose whole job is this set:
   * /applications and /design. `index` is 3-up, for the denser grids deeper
   * in, where a category's groups can run to eight or nine and 2-up would
   * turn a directory into a scroll.
   */
  size?: CardSize;
}) {
  if (cards.length === 0) return null;

  return (
    <ul
      className={`${styles.grid} ${size === "lead" ? styles.lead : ""}`}
      aria-label={label}
    >
      {cards.map((card, i) => (
        <Card
          key={card.href}
          card={card}
          priority={priorityFirst && i === 0}
          index={i}
          size={size}
        />
      ))}
    </ul>
  );
}
