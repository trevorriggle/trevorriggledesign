import Link from "next/link";
import Image from "next/image";
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

/**
 * A 3-up grid at full width, so a card lands near 380px wide and the 4:3 box
 * near 285px tall. That size is what the thumbnail picks in
 * content/design.ts were judged against.
 */
const CARD_SIZES =
  "(max-width: 34rem) 100vw, (max-width: 62rem) 50vw, 30rem";

export function Card({
  card,
  priority = false,
}: {
  card: CardData;
  /** LCP hint for the first card or two of a page's lead grid. */
  priority?: boolean;
}) {
  return (
    <li className={styles.cell}>
      <Link href={card.href} className={styles.card}>
        {card.thumb && (
          <span className={styles.media}>
            <Image
              src={card.thumb.url}
              alt=""
              fill
              sizes={CARD_SIZES}
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              /* An animated GIF thumbnail stays animated: straight from
                 /design/, never through /_next/image. */
              unoptimized={card.thumb.unoptimized}
              className={styles.image}
            />
          </span>
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
}: {
  cards: CardData[];
  priorityFirst?: boolean;
  label?: string;
}) {
  if (cards.length === 0) return null;

  return (
    <ul className={styles.grid} aria-label={label}>
      {cards.map((card, i) => (
        <Card key={card.href} card={card} priority={priorityFirst && i === 0} />
      ))}
    </ul>
  );
}
