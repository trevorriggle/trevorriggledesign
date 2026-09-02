/* ============================================================================
   FONTS — two families, self-hosted.
   ============================================================================
   Both are SIL Open Font License 1.1: free for commercial use, embeddable,
   and legal to self-host, which is what next/font does here. No stylesheet is
   fetched from a third party at runtime — the woff2 files are downloaded at
   build time and served from this domain, so there is no font-CDN request in
   the waterfall and no third-party origin in the privacy story.

   Licensing detail lives in DECISIONS.md.

     Fraunces        display  — Undercase Type, OFL 1.1
     IBM Plex Sans   text     — IBM with Bold Monday, OFL 1.1
     IBM Plex Mono   metadata — same superfamily, so it costs no family slot

   To swap in a licensed retail face later: drop .woff2 files in app/fonts/,
   switch these to next/font/local, keep the `variable` names identical, and
   no component or token changes.
   ========================================================================= */

import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

/**
 * Display. Loaded as a true variable font — no `weight` array, which is what
 * lets the SOFT, WONK and opsz axes come along. next/font rejects `axes`
 * alongside fixed weights, and the axes are the reason this face was chosen:
 * WONK is where its personality lives, and it is driven from tokens.css rather
 * than from components.
 *
 * The whole weight range arrives in one file, so this costs one request.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
  preload: true,
});

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-plex-sans",
  display: "swap",
  preload: true,
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: true,
});

/** Joined onto <html> in app/layout.tsx. */
export const fontVariables = [
  fraunces.variable,
  plexSans.variable,
  plexMono.variable,
].join(" ");
