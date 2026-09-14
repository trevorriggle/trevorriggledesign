/* ============================================================================
   FONTS
   ============================================================================
   Bricolage Grotesque is gone. It was a deliberately odd face — uneven weight
   distribution, flat-sided bowls, a squared-off `g`, terminals that stop where
   you do not expect them — and that oddness turned out to be the complaint. A
   display face that draws attention to its own drawing competes with the work
   it is supposed to be introducing.

     Archivo          display   Omnibus-Type, OFL 1.1
     DM Sans          text      Colophon Foundry for Google, OFL 1.1
     Instrument Serif quote     Instrument, OFL 1.1
     DM Mono          data      same superfamily, so no extra family slot

   WHY ARCHIVO. It is a neo-grotesque in the American gothic line: even weight
   distribution, closed apertures, no ornament and no jokes. At 129px it reads
   as a shape rather than as a personality, which is the correct behaviour for
   a headline on a portfolio — the page title should frame the work, not
   perform next to it.

   The practical reason it wins over the other neo-grotesques is the axis set.
   Archivo is variable across BOTH weight (100–900) and width (62–125), which
   is rare in this category — Inter, Helvetica Now and friends have no width
   axis at all. This site's headings compress as they get bigger, and that
   behaviour is expressed as `wdth` in the type tokens. Archivo keeps it
   working with no changes to the scale.

   Bricolage's `opsz` axis has no equivalent here and is simply dropped; its
   effect was subtle and the size ramp already does that job explicitly.

   WHY DM SANS UNDER IT. Unchanged, and it matters more now. Archivo is cool
   and engineered, so the text face carries the warmth: DM Sans has low
   contrast, generous apertures and a slightly geometric roundness that keeps
   the page friendly rather than clinical.

   WHY A SERIF, AND WHY ONLY TWO JOBS. Archivo and DM Sans are both
   grotesques, and a page built out of two grotesques has no way to change its
   voice: everything is either big sans or small sans. Instrument Serif is a
   high-contrast display serif with real modelling in the stroke, so a pull
   quote set in it reads as somebody talking rather than as a heading in a
   smaller size.

   IT IS RATIONED TO TWO ROLES, pull quotes and section intros, and the
   rationing is enforced in styles/typography.css, which is the only file
   allowed to assign --font-quote. A third typographic voice used freely is a
   ransom note. Used twice on a page it is a change of register.

   It ships one weight, 400, because that is the entire family. There is no
   bold to reach for, which is a useful constraint rather than a gap: a quote
   that needs bolding is a quote that is too long.

   All four are OFL 1.1 and self-hosted by next/font at build time. No
   font-CDN request at runtime, no third-party origin.
   ========================================================================= */

import { Archivo, DM_Sans, DM_Mono, Instrument_Serif } from "next/font/google";

/** Display. Variable across wght (100–900) and wdth (62–125). */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display-face",
  display: "swap",
  preload: true,
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

/** Text. Variable weight. */
export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-text-face",
  display: "swap",
  preload: true,
});

/** Pull quotes and section intros ONLY. One weight, which is the family. */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-quote-face",
  display: "swap",
  preload: true,
  fallback: ["Iowan Old Style", "Georgia", "serif"],
  adjustFontFallback: true,
});

/** Data only: filenames, dimensions, code spans. */
export const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-face",
  display: "swap",
  preload: false,
});

/** Joined onto <html> in app/layout.tsx. */
export const fontVariables = [
  archivo.variable,
  dmSans.variable,
  instrumentSerif.variable,
  dmMono.variable,
].join(" ");
