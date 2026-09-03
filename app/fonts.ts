/* ============================================================================
   FONTS
   ============================================================================
   Instrument Serif is gone. It was elegant and it was safe, and "safe" is the
   complaint: a high-contrast didone reads as tasteful editorial, which is the
   house style of roughly every portfolio built this year.

     Bricolage Grotesque   display   Mathieu Triay, OFL 1.1
     DM Sans               text      Colophon Foundry for Google, OFL 1.1
     DM Mono               data      same superfamily, so no extra family slot

   WHY BRICOLAGE. It is a genuinely odd face: deliberately uneven weight
   distribution, flat-sided bowls, a squared-off `g`, terminals that stop where
   you do not expect them. It was drawn as a "bricolage" of grotesque
   conventions that do not normally sit together, and at display size that
   awkwardness is the whole point. It is also fully variable across weight,
   width AND optical size, so one file gives the range this site needs to be
   loud at 130px and still legible at 24px.

   The width axis is the fun part and it is used: headings compress slightly as
   they get bigger, which is what stops a huge line from reading as merely
   "large text".

   WHY DM SANS UNDER IT. Bricolage is doing all the shouting, so the text face
   has to be quiet and warm without being characterless. DM Sans has low
   contrast, generous apertures and slightly geometric roundness that keeps the
   page friendly rather than corporate.

   All three are OFL 1.1 and self-hosted by next/font at build time. No
   font-CDN request at runtime, no third-party origin.
   ========================================================================= */

import { Bricolage_Grotesque, DM_Sans, DM_Mono } from "next/font/google";

/** Display. Variable across wght, wdth and opsz. */
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
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
  bricolage.variable,
  dmSans.variable,
  dmMono.variable,
].join(" ");
