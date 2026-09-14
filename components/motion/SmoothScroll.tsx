"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";

/* ============================================================================
   SMOOTH SCROLL
   ============================================================================
   Lenis, mounted once in the root layout. It renders nothing.

   IT NEVER INITIALISES UNDER REDUCED MOTION. Smooth scroll is the single most
   aggressive thing on this list for a vestibular system, because unlike a
   reveal it affects EVERY interaction rather than one block, and it cannot be
   escaped by not scrolling. When the preference is set, Lenis is never
   constructed at all, so the page keeps the browser's own native scrolling
   with nothing intercepting the wheel.

   The preference is read live: `change` on the media query tears the instance
   down or builds it, so a visitor who flips the OS setting does not have to
   reload to get native scrolling back.

   IT IS NOT LOAD-BLOCKING AND IT IS NOT A DEPENDENCY OF READING. The page is
   fully scrollable server-rendered HTML; this replaces the scrolling it
   already had. If the chunk never arrives, the site scrolls natively and
   nothing else about it changes.

   `autoRaf: true` lets Lenis own its own rAF loop rather than this component
   hand-rolling one, which is the only supported way to get the loop torn down
   cleanly on unmount.

   THE INSTANCE IS PUBLISHED TO lib/lenis.ts. Lenis switches off the browser's
   native smooth scroll, which turns every `<a href="#section">` into an
   instant jump, so the design subnav has to ask Lenis to do the scrolling
   instead. Publishing the handle is how it reaches it. The slot is set back
   to null on teardown and whenever the reduced-motion preference turns Lenis
   off, so a caller reading it never gets a destroyed instance.
   ========================================================================= */

export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    function sync() {
      if (query.matches) {
        lenis?.destroy();
        lenis = null;
        setLenis(null);
        return;
      }
      if (lenis) return;

      lenis = new Lenis({
        /* Just past native. 1.2s of glide is the tell of a site that values
           its own scroll feel over the visitor's ability to get somewhere. */
        duration: 0.9,
        autoRaf: true,
        /* Touch devices keep their native momentum, which is already better
           than anything a library does and is what the OS gesture expects. */
        smoothWheel: true,
        syncTouch: false,
      });

      setLenis(lenis);
    }

    sync();
    query.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
