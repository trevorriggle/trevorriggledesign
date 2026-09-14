import type { ElementType, ReactNode } from "react";
import { Container } from "./Container";
import { GridLines } from "./GridLines";
import styles from "./Band.module.css";

/* ============================================================================
   BAND, a full-bleed run of colour.
   ============================================================================
   The main structural element of this direction, and the reason the palette
   in tokens.css is built out of grounds rather than an ink plus an accent.

   A band is edge to edge, sets its own ground, and pads itself vertically. Its
   children sit on the normal container grid inside it, so the page's measure
   and gutters never change just because the colour did.

   COLOUR IS STRUCTURE HERE, NOT DECORATION. The brief asks for ultramarine as
   a dominant used in full-bleed blocks rather than as an accent, and the way
   a colour becomes structural is that it divides the page: a reader scrolling
   past three bands has been told where the sections are without reading a
   word. That is the job. A band used to make one paragraph look special is a
   highlighter.

   THE GROUND CARRIES ITS OWN TEXT COLOUR. `data-ground` rebinds --ground-text,
   --ground-accent, --ground-rule and --ground-mute, all of which were measured
   against that specific background. Nothing inside a band should ever set a
   colour from the page palette: `var(--color-text)` inside an ultramarine
   band is ink on blue at 2.09:1, and it looks plausible to whoever wrote it
   because a dark rectangle with dark text reads as "dark theme" rather than
   as unreadable. See the contrast contract in tokens.css.

   RATION THEM. Two or three per page. A page that is all bands has no bands,
   it has stripes, and the sections stop being findable. Paper is still the
   site's ground and most of the page is still on it.
   ========================================================================= */

export type Ground = "paper" | "ink" | "ultramarine" | "ochre";

export function Band({
  children,
  /** The colour, and with it every legal text colour inside. */
  ground = "ink",
  /** Vertical air. `tight` for a band that belongs to the block above it. */
  pad = "normal",
  /** The container measure for the children. `full` for edge-to-edge media. */
  width = "page",
  /** Draw the hairline column structure behind the content. */
  grid = false,
  as: Tag = "section",
  className,
  id,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  ground?: Ground;
  pad?: "tight" | "normal" | "none";
  width?: "page" | "prose" | "full";
  grid?: boolean;
  as?: ElementType;
  className?: string;
  id?: string;
  "aria-label"?: string;
}) {
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      data-ground={ground}
      className={[styles.band, styles[pad], className].filter(Boolean).join(" ")}
    >
      {grid && <GridLines tone={ground === "paper" ? "ink" : "paper"} />}
      <Container width={width} className={styles.inner}>
        {children}
      </Container>
    </Tag>
  );
}
