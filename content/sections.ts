/* ============================================================================
   SECTIONS — the running order of the entire site.
   ============================================================================
   This array is the spine. Position in it decides position on /work, and
   nothing anywhere in this codebase sorts content by date. That is deliberate
   and it is the whole point: the old site date-sorted, which buried 2025 AI
   systems work under 2021 illustration and told a visitor the wrong story
   about what this person does now.

   To reorder the site: move a line in this array.

   `kind` picks the content model and therefore the page template:
     "case"     long-form case study, held to the decision schema
     "gallery"  titled visual set, held to the thin schema

   `years` is a display label only. It is never parsed, compared or sorted on.

   COPY. Every `standfirst` below is the section intro from portfolio-copy.md,
   verbatim. Nothing here is written, paraphrased or extended.
   ========================================================================= */

export type SectionKind = "case" | "gallery";

export type Section = {
  /** URL fragment on /work, and the folder name under content/<kind>/. */
  id: string;
  title: string;
  /** Display-only. Not a sort key. */
  years: string;
  kind: SectionKind;
  /** Section intro, verbatim from portfolio-copy.md. Shown under the heading. */
  standfirst: string;
};

export const sections: Section[] = [
  {
    id: "ai-systems",
    title: "AI Systems & Development",
    years: "2025–26",
    kind: "case",
    standfirst:
      "Products I designed and built end to end. Interface through infrastructure.",
  },
  {
    id: "3d-graphics",
    title: "3D Graphics",
    years: "2025",
    kind: "gallery",
    standfirst:
      "Product visualization and 3D work. Modeling, lighting, and render passes for commercial use.",
  },
  {
    id: "marketing",
    title: "Marketing",
    years: "2022",
    kind: "gallery",
    standfirst:
      "Campaign work at American Scientific — animated product flyers, web banners, and social assets, produced at volume across hundreds of client accounts.",
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics",
    years: "2021",
    kind: "gallery",
    standfirst:
      "Animation and motion work. Titles, product motion, and short-form pieces.",
  },
  {
    id: "print",
    title: "Print",
    years: "2021",
    kind: "gallery",
    standfirst:
      "Catalog spreads and print layout. Long documents, tight grids, and the kind of typographic discipline that only shows up when it's missing.",
  },
  {
    id: "personal-works",
    title: "Personal Works",
    years: "2021",
    kind: "gallery",
    standfirst:
      "Illustration and comics, mostly made for myself. One of them ended up on the front page of Reddit, which was not the plan.",
  },
];

export const sectionIds = sections.map((s) => s.id);
export type SectionId = (typeof sections)[number]["id"];

export function getSection(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}

/** Zero-padded display ordinal — 01 … 06. */
export function sectionOrdinal(id: string): string {
  const i = sections.findIndex((s) => s.id === id);
  return i < 0 ? "--" : String(i + 1).padStart(2, "0");
}

/** How many entries, from the top of the running order, the home page shows. */
export const HOME_FEATURED_COUNT = 3;
