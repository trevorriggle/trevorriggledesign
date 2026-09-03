import { MDXRemote } from "next-mdx-remote/rsc";
import type { ImageRef } from "@/content";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { makeFigure } from "./Figure";
import { Aside, Compare, Column } from "./Blocks";
import styles from "./prose.module.css";

/**
 * Compiles an MDX body on the server. No client JS ships for content.
 *
 * Any absolute link written as plain Markdown is routed through ExternalLink,
 * so the target/rel treatment and the external mark are automatic, and a
 * relative path cannot masquerade as an external link, which is the bug class
 * this whole site is built to prevent.
 */
export function MdxBody({
  source,
  images,
  entryPath,
}: {
  source: string;
  images: ImageRef[];
  entryPath: string;
}) {
  if (!source.trim()) return null;

  const components = {
    Figure: makeFigure(images, entryPath),
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
      <MDXRemote source={source} components={components} />
    </div>
  );
}
