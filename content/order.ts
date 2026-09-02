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
  "ai-systems": [
    "drawevolve-metal-renderer",
    "drawevolve-critique-memory",
    "drawevolve-coaching-system",
    "drawevolve-cost-abuse-hardening",
    "parallel-agent-worktrees",
    "lynk-llm-routing",
  ],
  "full-stack": [],
  "3d-graphics": [],
  marketing: [],
  "motion-graphics": [],
  print: [],
  "personal-works": [],
} satisfies Record<SectionId | string, string[]>;
