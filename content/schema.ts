import { z } from "zod";
import { sectionIds } from "./sections";

/* ============================================================================
   CONTENT SCHEMA
   ============================================================================
   The schema is an editorial instrument, not just type safety. Three
   mechanisms do the work:

   1. THE SPINE IS COMPOUND AND HONEST WHEN USED. `constraint`, `attempts`,
      `tradeoff`, `outcome` and `revisit` are optional now that the site has
      real prose — see the note on the shape below — but their shapes are
      unchanged, so an entry that fills them still cannot ship the flattering
      half: a tradeoff without its cost, or an attempt without its failure,
      does not validate.

   2. CHARACTER CAPS. Every narrative field is capped. A feature list does not
      fit in 200 characters; a claim does. The long version belongs in the MDX
      body where prose and links work.

   3. COMPOUND FIELDS. `tradeoff` is three strings because one string lets you
      write what you chose and stop. `attempts` pairs each dead end with why it
      failed, or it does not validate.

   BANNED KEYS. `roadmap`, `features`, `problem`, `solution` and `challenge`
   are rejected by name with an explanatory error. The old site was
   problem → solution → features → stack → roadmap, which reads as a product
   landing page and leaves an interviewer nothing to ask about. There is no
   roadmap field. Do not add one.
   ========================================================================= */

const BANNED_KEYS: Record<string, string> = {
  roadmap:
    "there is no roadmap field, by design — what you plan to build is not evidence of what you can build",
  features:
    "no feature lists — describe the decision that produced the feature instead (see `tradeoff`)",
  problem: "use `constraint`: what specifically limited you, not a framing",
  solution: "use `tradeoff`: what you chose, over what, at what cost",
  challenge: "use `constraint` and `attempts`",
  highlights: "no highlight reels — use `outcome`",
};

/**
 * Checks the RAW frontmatter for banned keys, before Zod sees it.
 *
 * This has to run on the raw object: Zod strips unknown keys during parsing,
 * so a refinement attached to the schema is handed an object with `roadmap`
 * already removed and reports nothing. The schemas below are `strictObject`,
 * which does reject unknown keys — but with a generic "Unrecognized key"
 * message. Running this first means the banned keys get the message that
 * explains what to write instead, and anything else unrecognised still fails
 * on strictness.
 *
 * Called by the loader for every entry. See content/index.ts.
 */
export function assertNoBannedKeys(data: unknown, file: string): void {
  if (!data || typeof data !== "object") return;

  const found = Object.keys(BANNED_KEYS).filter((key) => key in data);
  if (found.length === 0) return;

  throw new Error(
    `\n\n  ── Content error ──────────────────────────────\n  ${file}\n` +
      found
        .map(
          (key) =>
            `    \u00b7 \`${key}\` is not a field on this content type:\n` +
            `      ${BANNED_KEYS[key]}`,
        )
        .join("\n") +
      `\n`,
  );
}

/* -------------------------------------------------------------------------- */
/* Primitives                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * External links only.
 *
 * A relative path, a protocol-relative path, a bare domain and an
 * `http://` URL all fail validation. This is the fix for the old site's
 * broken "Live demo" links — every one of which was a relative path that
 * resolved against the portfolio's own domain and 404'd. Enforced here at
 * build time so it cannot regress.
 */
export const linkSchema = z.object({
  label: z.string().min(1).max(40),
  href: z
    .string()
    .min(1)
    .refine((v) => v !== "TODO", {
      message:
        "replace TODO with a real https:// URL, or delete the link entry — a TODO href ships as a broken link",
    })
    .refine((v) => /^https:\/\/[^\s/$.?#].[^\s]*$/i.test(v), {
      message:
        "must be an absolute https:// URL with a hostname (relative paths resolve against this domain and 404)",
    })
    .refine((v) => {
      try {
        const u = new URL(v);
        return u.hostname.includes(".") && !u.hostname.endsWith(".");
      } catch {
        return false;
      }
    }, { message: "hostname is malformed" }),
  kind: z.enum(["live", "repo", "writing", "press", "video", "other"]).default("other"),
});

/** "3:2", "16:9", "1:1" — parsed for the placeholder box and for next/image
 *  intrinsic sizing, so layout is stable before any file exists. */
const aspectSchema = z
  .string()
  .regex(/^\d{1,4}:\d{1,4}$/, 'aspect must look like "3:2" or "16:9"')
  .refine((v) => v.split(":").every((n) => Number(n) > 0), {
    message: "aspect components must be greater than zero",
  });

/**
 * An image the site expects to exist.
 *
 * `src` is a bare filename; the file belongs at public/media/<slug>/<src>.
 * Nothing here requires the file to be present — a declared image with no file
 * renders as a <Placeholder /> carrying this metadata, which is what makes the
 * whole site composition-reviewable with zero assets. Drop the real file in at
 * that path and it takes over with no other edit.
 */
export const imageSchema = z.object({
  src: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9][a-z0-9._-]*\.(png|jpe?g|webp|avif|svg)$/,
      "src must be a lowercase filename with an image extension, e.g. 01-hero.png (no paths, no spaces)",
    ),
  /** Required, always. Alt text is content, not an accessibility afterthought. */
  alt: z.string().min(1, "alt text is required on every image"),
  aspect: aspectSchema,
  /** Minimum pixel width to shoot/export at. Drives the asset manifest. */
  minWidth: z.number().int().min(320).max(8000).default(1600),
  /** What the image must show. Printed on the placeholder, so the composition
   *  can be reviewed and the asset shot from the same description. */
  label: z.string().min(1, "say what this image must show").max(120),
  caption: z.string().max(280).optional(),
  /** Break the content column and run to the wide measure. */
  bleed: z.boolean().default(false),
});

/**
 * A self-hosted video slot.
 *
 * Self-hosted mp4 only: no embed, no third-party player, no tracking iframe on
 * a page whose whole argument is that the author owns the stack.
 *
 * `poster` is a full image declaration rather than a bare filename, and it is
 * REQUIRED. That is the degradation contract: when the mp4 is not on disk the
 * slot renders the poster through <Frame />, and when the poster is not on disk
 * either it renders the same spec <Placeholder /> every other image does. The
 * layout box is identical in all three states, because it is sized from the
 * poster's declared aspect — so a page composes correctly with no video file,
 * which is the state this repo is in.
 */
export const videoSchema = z.object({
  src: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9][a-z0-9._-]*\.mp4$/,
      "src must be a lowercase .mp4 filename, e.g. 01-gameplay.mp4 (no paths, no spaces)",
    ),
  poster: imageSchema,
  caption: z.string().max(280).optional(),
  /** Break the content column and run to the wide measure. */
  bleed: z.boolean().default(false),
});

const yearSchema = z.union([
  z.number().int().min(1990).max(2100),
  z
    .string()
    .regex(/^\d{4}(–\d{2,4})?$/, 'year must be 2025 or a range like "2025–26"'),
]);

/* -------------------------------------------------------------------------- */
/* AI-shaped optional structure                                               */
/* -------------------------------------------------------------------------- */

/**
 * Architecture as content.
 *
 * `stages` renders as a typographic system diagram — mono, ruled, real
 * information — so the architecture is legible with zero images. `diagram` is
 * the optional slot for a drawn version when one exists; when both are
 * present the drawing leads and the stages caption it.
 */
export const architectureSchema = z.object({
  /** TODO: one line naming what the diagram is of. */
  caption: z.string().min(1).max(200),
  diagram: imageSchema.optional(),
  stages: z
    .array(
      z.object({
        /** Short mono identifier — "worker", "vlm", "cache". */
        id: z.string().min(1).max(24),
        label: z.string().min(1).max(60),
        detail: z.string().max(160).optional(),
        /** Drives the visual weight of the node. */
        kind: z
          .enum(["client", "edge", "service", "model", "store", "job"])
          .default("service"),
      }),
    )
    .default([]),
  /** "client -> edge", by stage id. Rendered as the flow spine. */
  flow: z.array(z.string().max(60)).default([]),
});

/** The model/provider row. Mono table, sits in the metadata rail. */
export const modelRowSchema = z.object({
  /** What this model is for in the system — "critique", "summarize", "route". */
  role: z.string().min(1).max(40),
  provider: z.string().min(1).max(40),
  model: z.string().min(1).max(60),
  /** Why this one. A model choice without a reason is trivia. */
  why: z.string().max(160).optional(),
});

/** The latency-or-cost constraint the system was actually built against. */
export const budgetSchema = z.object({
  metric: z.enum(["latency", "cost", "throughput", "memory", "frame-time"]),
  /** The number you had to hit, with its unit. Free text so the unit is yours. */
  target: z.string().min(1).max(60),
  /** Where it actually landed. Optional — omit rather than invent it. */
  measured: z.string().max(60).optional(),
  /** How it was measured. An unqualified number is not evidence. */
  method: z.string().max(200).optional(),
});

/**
 * What the system does when the model is wrong.
 *
 * The question technical interviewers actually ask, and the one most AI
 * portfolio writing has no answer to. Each entry pairs a specific failure with
 * the specific behaviour, so "graceful degradation" cannot stand alone.
 */
export const failureModeSchema = z.object({
  /** The failure. "Model returns malformed JSON", "critique contradicts prior". */
  when: z.string().min(1).max(160),
  /** What the system does about it — mechanism, not intent. */
  then: z.string().min(1).max(240),
  /** Who finds out, and how. Silent recovery is a design decision too. */
  surfaced: z.string().max(160).optional(),
});

/* -------------------------------------------------------------------------- */
/* Case study                                                                 */
/* -------------------------------------------------------------------------- */

/* strictObject, not object: a misspelled field name (`tradeof:`, `reviist:`)
   would otherwise be silently dropped and the entry would render with the
   field missing. On a content model this tightly specified, an unknown key is
   always a mistake. */
const caseStudyShape = z.strictObject({
  // ---- identity -----------------------------------------------------------
  title: z.string().min(1).max(70),
  /** One line under the title. A claim about what was built, not a tagline.
   *  Sourced from the **Subtitle:** line of the case study copy. */
  deck: z.string().min(1).max(150),
  section: z.enum(sectionIds as [string, ...string[]]),
  /** Optional: a project with no date in the copy gets no invented one.
   *  Every template that prints it already handles its absence. */
  year: yearSchema.optional(),
  /** One entry per line of the **Role:** copy, verbatim. The cap is 120 rather
   *  than 40 so a written role line survives without being chopped into chips
   *  it was not written as. */
  role: z.array(z.string().max(120)).min(1),
  context: z.enum([
    "client",
    "self-initiated",
    "team",
    "freelance",
    "academic",
    "shelved",
  ]),
  collaborators: z.string().max(200).optional(),

  /** The **Status:** line, verbatim. Free text, not an enum: "Shipped to
   *  TestFlight; approved for external testing" is a sentence, and flattening
   *  it to a keyword is exactly the editorialising this site avoids. It is
   *  also the field that keeps a shelved project labelled shelved. */
  state: z.string().max(120).optional(),
  /** The **Timeline:** line, verbatim. */
  timeline: z.string().max(80).optional(),

  // ---- the spine: optional, still capped, still compound -------------------
  /* These five were required when the site was structure-without-copy: the
     schema was the editorial instrument that forced a decision log to exist.
     The copy now exists and is written as prose with its own headings, and
     requiring a 220-character restatement of a paragraph would mean writing
     new copy to satisfy a validator. So they are optional.

     Everything else about them is unchanged — the caps, the three-legged
     tradeoff, the tried/failed pairing. An entry that fills them still cannot
     fill them dishonestly, and <Argument /> renders exactly the movements that
     are present. See DECISIONS.md. */

  /** What limited you. External and specific: a frame budget, a token cost, a
   *  platform API, a device class. Not "users found it confusing". */
  constraint: z.string().min(1).max(220).optional(),

  /** Dead ends. Each must say what was tried AND why it failed. */
  attempts: z
    .array(
      z.object({
        tried: z.string().min(1).max(180),
        failed: z.string().min(1).max(220),
      }),
    )
    .default([]),

  /** Split three ways so the cost cannot be quietly omitted. */
  tradeoff: z
    .object({
      chose: z.string().min(1).max(220),
      instead_of: z.string().min(1).max(220),
      cost: z
        .string()
        .min(1, "every tradeoff cost something — name it")
        .max(220),
    })
    .optional(),

  /** `evidence` is optional on purpose: an absent metric is defensible in an
   *  interview and a fabricated one is not. */
  outcome: z
    .object({
      what: z.string().min(1).max(300),
      evidence: z.string().max(220).optional(),
    })
    .optional(),

  /** What you would do differently. */
  revisit: z.string().min(1).max(300).optional(),

  // ---- AI-shaped structure, all optional ----------------------------------
  architecture: architectureSchema.optional(),
  models: z.array(modelRowSchema).default([]),
  budget: budgetSchema.optional(),
  failureModes: z.array(failureModeSchema).default([]),

  // ---- media + links ------------------------------------------------------
  /** Renders first, above the cover. A case study whose strongest asset moves
   *  should lead with it. */
  video: videoSchema.optional(),
  cover: imageSchema.optional(),
  images: z.array(imageSchema).default([]),
  links: z.array(linkSchema).default([]),

  // ---- rail metadata: chips, never a section ------------------------------
  stack: z.array(z.string().max(30)).default([]),

  status: z.enum(["draft", "published"]).default("draft"),
});

export const caseStudySchema = caseStudyShape;

/* -------------------------------------------------------------------------- */
/* Gallery — deliberately thin. No spine, no required narrative.              */
/* -------------------------------------------------------------------------- */

const galleryShape = z.strictObject({
  title: z.string().min(1).max(90),
  section: z.enum(sectionIds as [string, ...string[]]),
  year: yearSchema,
  /** Free text, not an enum: the medium list across 3D, motion, print,
   *  marketing and personal work is open-ended, and an enum here would mean
   *  editing code to add a technique. */
  medium: z.string().min(1).max(80),
  /** A sentence or two, or nothing. Never a paragraph. */
  caption: z.string().max(280).optional(),
  /** Mixed aspect ratios are the norm here and are preserved, not cropped to
   *  a uniform tile — see components/ui/GallerySet. */
  images: z.array(imageSchema).min(1, "a gallery item needs at least one image"),
  links: z.array(linkSchema).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const gallerySchema = galleryShape;

/* -------------------------------------------------------------------------- */

export type CaseStudyFrontmatter = z.infer<typeof caseStudyShape>;
export type GalleryFrontmatter = z.infer<typeof galleryShape>;
export type ImageRef = z.infer<typeof imageSchema>;
export type VideoRef = z.infer<typeof videoSchema>;
export type ExternalLinkRef = z.infer<typeof linkSchema>;
export type Architecture = z.infer<typeof architectureSchema>;
export type ModelRow = z.infer<typeof modelRowSchema>;
export type Budget = z.infer<typeof budgetSchema>;
export type FailureMode = z.infer<typeof failureModeSchema>;

/** Aspect string -> numeric ratio, for placeholder boxes and next/image. */
export function aspectRatio(aspect: string): number {
  const [w, h] = aspect.split(":").map(Number);
  return w / h;
}

/** Declared aspect + minWidth -> the intrinsic dimensions next/image needs. */
export function intrinsicSize(img: ImageRef): { width: number; height: number } {
  return {
    width: img.minWidth,
    height: Math.round(img.minWidth / aspectRatio(img.aspect)),
  };
}
