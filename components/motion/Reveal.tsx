"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import type { ReactNode, ElementType } from "react";

/* ============================================================================
   REVEAL, the one scroll-triggered pattern on the site.
   ============================================================================
   Fade plus a short translate up, once, when the block enters the viewport.
   Declared here and nowhere else: every scroll reveal on every page is this
   component with a `delay`, so the motion vocabulary cannot drift per page the
   way copy-pasted `whileInView` props do.

   `m` AND `LazyMotion`, NOT `motion`. This is a bundle decision and it is
   worth the two extra lines. The full `motion` component pulls every feature
   framer has (drag, layout projection, pan, scroll linkage) into the first
   chunk that touches it, and this site uses exactly one of them. `m` is the
   same component with no features compiled in, and `domAnimation` adds back
   only animations, exit and the gestures, which is where `InViewFeature`, the
   thing that actually implements `whileInView`, lives. Measured on this build:
   38.0 KB gz for `motion`, 25.1 KB gz for this. `strict` makes the saving
   permanent by throwing if anyone imports the full `motion` later.

   ONCE, NEVER AGAIN. `viewport.once` is true. A block that re-animates every
   time it scrolls back into view turns a page into a slideshow and makes the
   second read of it worse than the first.

   THE MARGIN IS NEGATIVE ON THE BOTTOM. `-12%` fires the reveal slightly
   BEFORE the element's top edge reaches the fold, which is what makes it read
   as the section arriving rather than as the section catching up: a reveal
   that starts exactly at the boundary is always a frame late.

   REDUCED MOTION IS A DIFFERENT COMPONENT, not a shorter one. `useReducedMotion`
   returns the OS preference and this then renders a plain element: no
   variants, no initial state, no observer, and no framer runtime attached to
   it at all. Not a 0ms animation, which still ships an invisible starting
   state, and not a fade-only variant, which is still motion.

   IT MUST NOT HIDE CONTENT THAT CANNOT BE REVEALED. Framer renders `initial`
   into the server HTML, so every revealed block ships as `opacity: 0` and only
   the motion runtime brings it back. `@media (scripting: none)` in global.css
   forces all of it visible when there is no JS at all, and NOTHING ABOVE THE
   FOLD USES THIS COMPONENT: the home statement animates in CSS and the case
   study head does not animate, so no page's LCP element waits on hydration.
   ========================================================================= */

/** The distance a block travels. Small on purpose: 16px reads as arrival, 60px
 *  reads as a slide transition, and this site is not a deck. */
const RISE = 16;

export function Reveal({
  children,
  /** Seconds. Used to stagger siblings that should read as one movement. */
  delay = 0,
  as = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = m[as as keyof typeof m] as typeof m.div;

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionTag
        data-reveal
        className={className}
        initial={{ opacity: 0, y: RISE }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{
          duration: 0.55,
          delay,
          /* The same curve as --ease-out in tokens.css. The motion and the CSS
             transitions on this site must not ease differently. */
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </MotionTag>
    </LazyMotion>
  );
}
