import type { ReactNode } from "react";
import styles from "./Needs.module.css";

/* ============================================================================
   NEEDS
   ============================================================================
   The rendered form of a `[[NEEDS: ...]]` marker in portfolio-copy.md.

   These are facts only the author can supply. The rule is that they are never
   guessed at, never filled in, and never quietly dropped — so while one is
   outstanding it renders as this: an inline block that is deliberately ugly,
   hazard-striped, in the signal colour, and impossible to mistake for finished
   copy at any scroll speed.

   It is a development affordance with a production backstop:
   `scripts/check-needs.mjs` runs as `prebuild` and FAILS the production build
   if the string "[[NEEDS" appears anywhere under content/, naming the file and
   line of each. So this component is what the author sees while working, and
   the build is what guarantees no visitor ever does.
   ========================================================================= */

export function Needs({
  text,
  children,
}: {
  /** The marker's inner text. Preferred over `children`: MDX hands a JSX
   *  attribute through reliably, and an expression child does not — a
   *  `<Needs>{"…"}</Needs>` compiled through next-mdx-remote arrives with no
   *  children at all, which rendered an empty hazard block. */
  text?: string;
  children?: ReactNode;
}) {
  return (
    <span className={styles.needs}>
      <span className={styles.tag} aria-hidden="true">
        needs
      </span>
      <span className={styles.text}>
        <span className="visually-hidden">Unfinished — needed from author: </span>
        {text ?? children}
      </span>
    </span>
  );
}

/** Matches a marker and captures its inner text. Global + multiline: a marker
 *  is routinely wrapped across several lines in the source. */
export const NEEDS_PATTERN = /\[\[NEEDS([^\]]*)\]\]/g;

/**
 * Renders a plain frontmatter string that may contain markers.
 *
 * Frontmatter fields are rendered as strings, not as MDX, so a marker sitting
 * in `revisit` or `outcome.evidence` would otherwise print as literal brackets
 * indistinguishable from body copy. This splits the string and wraps each
 * marker, leaving the surrounding text exactly as written.
 */
export function withNeeds(text: string): ReactNode {
  if (!text.includes("[[NEEDS")) return text;

  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(NEEDS_PATTERN.source, "g");

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    out.push(
      <Needs key={match.index}>
        {match[1].replace(/^:\s*/, "").replace(/\s+/g, " ").trim()}
      </Needs>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));

  return out;
}
