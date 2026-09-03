import { MDXRemote } from "next-mdx-remote/rsc";
import type { ResolvedImage } from "@/content";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { makeFigure } from "./Figure";
import { Aside, Compare, Column } from "./Blocks";
import { Needs } from "@/components/ui/Needs";
import styles from "./prose.module.css";

/**
 * Turns `[[NEEDS: ...]]` in an MDX source into a <Needs> block.
 *
 * MDX would otherwise render the marker as literal square brackets in a
 * paragraph, which is exactly the "looks like copy" failure the marker exists
 * to avoid.
 *
 * The inner text goes in as a PLAIN QUOTED ATTRIBUTE — not as children, and
 * not as an expression. Both of the other two were tried and both silently
 * produced an empty marker: a correctly-styled hazard block with no text in
 * it, which is worse than no marker at all. Compiled through
 * next-mdx-remote's RSC entry, `<Needs>{"…"}</Needs>` arrives with no
 * children and `<Needs text={"…"} />` arrives with no props. A quoted
 * attribute arrives intact.
 *
 * So the text is entity-escaped rather than JSON-quoted: `"` would close the
 * attribute, `<` and `>` would open a tag, and `{` would start an expression.
 * Escaping all four means a marker can say anything at all — and this copy's
 * markers are full of quotes, dashes and question marks.
 *
 * A marker routinely wraps across several source lines; the whitespace is
 * collapsed so it sets as one run of text.
 */
function liftNeeds(source: string): string {
  return source.replace(/\[\[NEEDS([^\]]*)\]\]/g, (_all, inner: string) => {
    const text = inner.replace(/^:\s*/, "").replace(/\s+/g, " ").trim();
    const attr = text
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\{/g, "&#123;")
      .replace(/\}/g, "&#125;");
    return `<Needs text="${attr}" />`;
  });
}

/**
 * Compiles an MDX body on the server. No client JS ships for content.
 *
 * Any absolute link written as plain Markdown is routed through ExternalLink,
 * so the target/rel treatment and the external mark are automatic — and a
 * relative path cannot masquerade as an external link, which is the bug class
 * this whole site is built to prevent.
 */
export function MdxBody({
  source,
  images,
  entryPath,
}: {
  source: string;
  images: ResolvedImage[];
  entryPath: string;
}) {
  if (!source.trim()) return null;

  const components = {
    Figure: makeFigure(images, entryPath),
    Needs,
    Aside,
    Compare,
    Column,
    a: ({ href = "", children, ...rest }: React.ComponentProps<"a">) =>
      /^https:\/\//i.test(href) ? (
        <ExternalLink href={href}>{children}</ExternalLink>
      ) : (
        <a href={href} {...rest}>
          {children}
        </a>
      ),
  };

  return (
    <div className={styles.prose}>
      <MDXRemote source={liftNeeds(source)} components={components} />
    </div>
  );
}
