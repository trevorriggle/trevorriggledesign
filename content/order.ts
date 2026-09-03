/* ============================================================================
   ENTRY ORDER — the running order *within* each section.
   ============================================================================
   Same contract as content/sections.ts: position decides rank, never a date.
   Keys are section ids from content/sections.ts; values are entry slugs in the
   order they should appear.

   The loader fails the build if a slug listed here has no folder, or if a
   published entry is missing from its section's list — the two cannot silently
   drift apart, which is how a new case study ends up invisible.
   ========================================================================= */

import type { SectionId } from "./sections";

export const entryOrder: Record<string, string[]> = {
  /* TIER 1 — Selected Work. DrawEvolve, thoosie, Lynk, in that order, fixed
     by hand. thoosie sits second, directly after DrawEvolve. Home presents
     these three at descending visual weight in exactly this sequence. Do not
     sort this. */
  "ai-systems": ["drawevolve", "thoosie", "lynk"],

  /* TIER 2 — the archive. Same contract: position decides rank, never a
     date. Empty until gallery entries exist. */
  "3d-graphics": [],
  marketing: [],
  "motion-graphics": [],
  print: [],
  "personal-works": [],
} satisfies Record<SectionId | string, string[]>;
