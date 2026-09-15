"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { scrollToId } from "@/lib/lenis";
import styles from "./SubNav.module.css";

/* ============================================================================
   SUBNAV, the sticky section index for a long page.
   ============================================================================
   A design category is now ONE page with anchored sections instead of a
   browsing tier plus a route per group. This is how you move around it.

   IT IS REAL ANCHOR LINKS FIRST, AND EVERYTHING ELSE IS ENHANCEMENT. The
   markup is `<a href="#print">`. With no JavaScript at all it still navigates
   to the section, because that is what a fragment link does. The click
   handler only intercepts in order to animate the trip, and it explicitly
   hands control back when it cannot: an unresolvable id, or a modified click.

   WHY THE CLICK HANDLER EXISTS. Lenis sets `scroll-behavior: auto !important`
   on <html> to stop the browser fighting its RAF loop, which turns a fragment
   link into an instant jump. Asking Lenis to do the scroll is the only way to
   get the smooth behaviour the brief asks for while it is running. See
   lib/lenis.ts.

   THE ACTIVE STATE IS AN INTERSECTION OBSERVER, NOT A SCROLL HANDLER. A
   scroll listener that measures every section on every frame is the usual
   build of this and it does layout work on the main thread during the one
   interaction it is meant to decorate. The observer fires only on crossings.

   IT DOES NOT HIJACK THE URL. Clicking a section does not push a hash, and
   the observer does not rewrite one as you scroll. A history stack with
   fourteen entries from one page of scrolling makes the back button useless,
   which is a real cost paid for a cosmetic benefit. A hash that ARRIVES in
   the URL still works: the browser handles it natively on load.

   THUMB-FIRST. On a narrow screen the items scroll horizontally inside the
   bar rather than wrapping to three rows or collapsing behind a button. The
   bar keeps a fixed height, the targets stay at least 44px tall, and the
   scroll is a native one-finger swipe.
   ========================================================================= */

export type SubNavItem = { id: string; label: string };

export function SubNav({
  items,
  label = "Sections",
}: {
  items: SubNavItem[];
  label?: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    /* The band is the top of the viewport, under the two sticky bars. A
       section counts as current once its head reaches that line, which is
       what makes the mark change at the moment the heading arrives rather
       than when the section's last pixel leaves. */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-18% 0px -72% 0px", threshold: 0 },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [items]);

  function handle(event: MouseEvent<HTMLAnchorElement>, id: string) {
    /* Let the browser have any click that is trying to do something else:
       open in a tab, open in a window, download. Intercepting those is the
       most common way a custom link handler breaks a page. */
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    if (scrollToId(id)) {
      event.preventDefault();
      setActive(id);
    }
  }

  return (
    <nav className={styles.bar} aria-label={label}>
      {/* NO `data-lenis-prevent`. This bar is sticky across the top of every
          long page, so an attribute that stops Lenis handling the wheel over
          it stopped the page scrolling whenever the pointer crossed it. Lenis
          works the axis out per gesture now; see SmoothScroll.tsx. */}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <a
              href={`#${item.id}`}
              className={[styles.link, active === item.id && styles.current]
                .filter(Boolean)
                .join(" ")}
              aria-current={active === item.id ? "true" : undefined}
              onClick={(event) => handle(event, item.id)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
