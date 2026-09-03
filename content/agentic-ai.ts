/* ============================================================================
   AGENTIC AI
   ============================================================================
   Its own section, from the nav down.

   NO COPY EXISTS FOR THIS PAGE. Neither portfolio-copy.md nor any other file
   in the repository contains copy written for an Agentic AI section, and none
   was invented here.

   The one thing the site does have, verbatim and already published, is the
   "How I worked" passage inside the DrawEvolve case study, which is about
   exactly this: parallel agents across git worktrees, bounded scopes per
   branch, integration and review done by hand. That passage stays where its
   author put it. This page links to it rather than restating it, which is why
   `related` exists.

   Fill `body` and the page grows a lead. Until then it renders its heading and
   the pointer, and nothing else.
   ========================================================================= */

export type AgenticContent = {
  /** Paragraphs. Empty renders nothing. */
  body: string[];
  /** A case study whose published copy already covers this ground. */
  related: { slug: string; heading: string } | null;
};

export const agenticAI: AgenticContent = {
  body: [],
  related: { slug: "drawevolve", heading: "How I worked" },
};
