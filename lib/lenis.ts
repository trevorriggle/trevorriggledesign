import type Lenis from "lenis";

/* ============================================================================
   THE LENIS HANDLE
   ============================================================================
   One module-level slot holding the running Lenis instance, written by
   <SmoothScroll> and read by anything that needs to drive the scroll position
   rather than just observe it.

   WHY THIS EXISTS AT ALL. Lenis takes ownership of scrolling by setting
   `scroll-behavior: auto !important` on <html>, which is how it stops the
   browser's native smooth scroll from fighting its RAF loop for the same
   wheel event. The side effect is that a plain `<a href="#section">` becomes
   an instant jump: the CSS property that would have animated it is
   deliberately switched off.

   So a smooth-scrolling subnav has to ask Lenis to do the scrolling, which
   means something outside <SmoothScroll> has to be able to reach it.

   IT IS A PLAIN MODULE VARIABLE, NOT A CONTEXT. A React context would make
   every consumer a client component under a provider, for one value that is
   set once per page load and read on a click handler. This is genuinely
   global state, it is scoped to the browser, and the null case is already the
   path that has to work: when it is null the caller falls back to the native
   API, which is exactly what happens under reduced motion, where Lenis is
   never constructed at all.
   ========================================================================= */

let instance: Lenis | null = null;

export function setLenis(next: Lenis | null): void {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Scroll to an element by id, smoothly, whichever engine is driving.
 *
 * Three paths, in order: Lenis if it is running, the native API with an
 * explicit `behavior` if it is not, and nothing at all if the id does not
 * resolve. Returns whether it handled the scroll, so a caller can decide
 * whether to prevent the link's default navigation.
 *
 * THE NATIVE FALLBACK PASSES `behavior: "smooth"` EXPLICITLY, and that is
 * load-bearing rather than belt-and-braces: per spec an explicit behavior in
 * the options wins over the `scroll-behavior` CSS property, so this still
 * animates even on a page where something has set that property to `auto`.
 */
export function scrollToId(id: string): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  const lenis = getLenis();
  if (lenis) {
    /* NO OFFSET, AND THAT IS THE FIX. Lenis's own scrollTo ALREADY subtracts
       the scrollport's scroll-padding-top before it animates: see `scrollTo`
       in lenis/dist/lenis.mjs, which reads `scrollPaddingTop` off the root
       element and takes it off the target position.

       This used to read that same property and hand it back as a negative
       offset, so it was applied TWICE and every subnav click landed exactly
       one --sticky-stack short. Measured on /design/american-scientific at
       1440x900, from a fresh load, all five anchors resolved to
       `docTop - 272` against a correct `docTop - 136`, which left 148px of
       the previous section sitting above the divider. Native fragment
       navigation was never affected, which is why this presented as "the
       subnav is broken" rather than as "anchors are broken".

       Nothing replaces it. The one value is scroll-padding-top in reset.css
       and both paths now read it exactly once. */
    lenis.scrollTo(target);
    return true;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}
