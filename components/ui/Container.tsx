import type { ElementType, ReactNode } from "react";
import styles from "./Container.module.css";

/** Horizontal measure + gutters. The only element allowed to own page-edge
 *  padding, so the gutter is consistent and defined in exactly one place. */
export function Container({
  children,
  width = "page",
  as: Tag = "div",
  className,
  id,
}: {
  children: ReactNode;
  width?: "page" | "prose" | "full";
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={[styles.container, styles[width], className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
