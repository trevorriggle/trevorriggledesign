/* ============================================================================
   FONTS
   ============================================================================
   Two families. Both SIL Open Font License 1.1 — free commercially, legal to
   embed and self-host, which is what next/font does: the woff2 files are
   fetched once at BUILD time and served from this domain. No font-CDN request
   in the runtime waterfall, no third-party origin in the privacy story, and no
   flash of a fallback face on a cold cache.

     Instrument Serif   display   Instrument, OFL 1.1
     Geist              text      Vercel, OFL 1.1
     Geist Mono         data      same superfamily — costs no family slot

   THE THIRD CUT IS NOT A THIRD FAMILY. Geist Mono is drawn on Geist's
   skeleton, so using it for genuine tabular data buys monospace alignment
   without spending the second family. It is deliberately scarce — see the
   role assignment in styles/typography.css. Labels and ordinals are NOT mono
   here; they are letterspaced Geist. Mono means "this string is data" —
   a filename, a pixel dimension, a path, a code span — never "this looks
   technical."

   To swap in a licensed retail face later: drop .woff2 files into app/fonts/,
   switch these to next/font/local, keep the `variable` names identical, and
   nothing in tokens.css or any component changes.
   ========================================================================= */

import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";

/**
 * Display. One weight — Instrument Serif ships regular only, and that is the
 * point of it: a high-contrast didone-ish serif that gets its authority from
 * SIZE, not from weight. Every display decision on this site is a scale
 * decision, which is what keeps the hierarchy from leaning on bold.
 */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display-face",
  display: "swap",
  preload: true,
  fallback: ["Iowan Old Style", "Palatino", "Georgia", "serif"],
  /* The serif is large everywhere it appears, so a fallback that sets wider
     would shift layout badly on a slow connection. Adjusting the metrics
     keeps the swap quiet. */
  adjustFontFallback: true,
});

/** Text. Variable, so the whole weight range arrives in one file. */
export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-text-face",
  display: "swap",
  preload: true,
});

/** Data only. Loaded because tabular alignment is functional here — the asset
 *  manifest, placeholder specs and code spans all depend on it. */
export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
  preload: false,
});

/** Joined onto <html> in app/layout.tsx. */
export const fontVariables = [
  instrumentSerif.variable,
  geist.variable,
  geistMono.variable,
].join(" ");
