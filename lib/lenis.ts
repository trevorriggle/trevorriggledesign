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
    /* `offset` is read from the element's own scroll-margin-top, so the
       anchor offset lives in CSS beside the sticky bars that cause it,
       rather than as a number duplicated in here. */
    const margin = parseFloat(
      getComputedStyle(target).scrollMarginTop || "0",
    );
    lenis.scrollTo(target, { offset: -margin });
    return true;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}
