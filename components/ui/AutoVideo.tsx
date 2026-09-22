"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Video.module.css";

/* ============================================================================
   AUTOVIDEO
   ============================================================================
   Every moving picture on this site goes through this component: the home
   page hero clip, the thoosie case study, and the motion pieces in the design
   grid. It is mounted only when the file actually exists on disk, so a repo
   with no video ships no JavaScript for it at all.

   ---- WHAT THIS USED TO DO, AND WHY IT DID NOT WORK --------------------
   The element carried no `autoplay` attribute. Playback was started from
   script, and only after a check on `navigator.connection` that was written
   to FAIL CLOSED on an unknown connection:

       if (!conn) return false;

   `navigator.connection` is Chromium-only. It does not exist in Safari, on
   any platform, so that branch returned false on every iPhone and every iPad
   ever to load this site, which meant `play()` was never called there at all.
   The clip sat on its poster frame. And because `controls` was hardcoded on
   the element as a "did not autoplay is never cannot play" fallback, what a
   visitor on an iPad actually got was a still frame wearing native Apple
   media chrome — the one look this site's whole visual argument is against.

   It was not a flaky autoplay policy. It was a feature detection that read
   "this browser will not tell me about the network" as "this browser must not
   play video".

   ---- WHAT IT DOES NOW -------------------------------------------------
   The element declares itself autoplayable the way the platform wants to be
   asked: `autoplay`, `muted`, `playsinline`, `loop`, and NO `controls`. That
   combination is the documented contract for inline autoplay on iOS, and when
   it holds, Safari starts the clip itself with no script involved.

   Script is then belt and braces on top of it, not the mechanism:

     · An IntersectionObserver calls play() when the clip comes into view and
       pause() when it leaves. This is what stops three clips on the design
       grid decoding at once, and it is the retry for the case where the
       attribute alone did not take.
     · `el.muted = true` is set imperatively immediately before play(). Some
       iOS versions have historically dropped the React-rendered `muted`
       property, and a clip that is not muted at the instant of the call is a
       clip whose play() is rejected.

   ---- THE FALLBACK, AND WHY IT IS NOT NATIVE CONTROLS ------------------
   Autoplay can still be refused: Low Power Mode on iOS refuses it outright,
   and so does a reduced-motion preference, which is honoured here rather than
   overridden. Both of those are real and neither is rare.

   When it is refused the clip must not become a dead picture, so the promise
   rejection is caught and a play affordance is rendered over the poster. It
   is the site's own button, not the `controls` attribute: a bordered mono
   label in the house style, one control, no scrubber, no volume slider on a
   silent clip, no Apple chrome. Once it has been pressed the browser has its
   user gesture and everything after that is ordinary playback, so the button
   retires and does not come back.

   REDUCED MOTION NEVER AUTOPLAYS. It goes straight to the poster and the
   button, which is the whole point of the preference: the motion is available
   and it is not imposed.

   `preload="metadata"` STAYS. The hero clip is 14MB. `autoplay` tells the
   browser it may start when it judges the element visible; `preload` governs
   what it pulls down before that. Metadata gives the box its dimensions at no
   meaningful cost, and the body arrives when playback is actually wanted.
   ========================================================================= */

export function AutoVideo({
  src,
  poster,
  width,
  height,
  label,
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  /** Becomes the element's accessible name. The poster's alt text. */
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  /* Null until something is actually known. Rendering the button on the
     server, or on the first client paint, would flash a control over a clip
     that is about to start on its own. */
  const [blocked, setBlocked] = useState<boolean | null>(null);

  /** Ask the element to play, and record whether the browser agreed. */
  const attempt = useCallback((el: HTMLVideoElement) => {
    /* Before the call, every time. See the note above on iOS dropping it. */
    el.muted = true;

    const started = el.play();

    /* Older browsers return undefined rather than a promise. Nothing to
       catch, and nothing has failed, so leave the state alone. */
    if (started === undefined) return;

    started.then(
      () => setBlocked(false),
      () => setBlocked(true),
    );
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* HONOURED, NOT OVERRIDDEN. A looping clip that starts by itself is
       exactly what the preference is set to prevent. The poster and the
       button are the graceful version of that, not a degraded one. */
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    if (reduced) {
      el.autoplay = false;
      setBlocked(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          attempt(el);
        } else if (!el.paused) {
          el.pause();
        }
      },
      /* Low enough that the clip is running by the time it is properly on
         screen, high enough that something barely clipping the fold does not
         start decoding. */
      { threshold: 0.25 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [attempt]);

  return (
    <div className={styles.player}>
      <video
        ref={ref}
        className={styles.video}
        poster={poster || undefined}
        width={width}
        height={height}
        /* THE FOUR THAT MAKE INLINE AUTOPLAY LEGAL ON iOS. All four, or none
           of them work. `controls` is deliberately absent. */
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
      </video>

      {blocked === true && (
        <button
          type="button"
          className={styles.play}
          onClick={() => {
            const el = ref.current;
            if (!el) return;
            /* A click IS the user gesture every autoplay policy is waiting
               for, so this call is allowed even where the automatic one was
               refused. Optimistic: the button goes now rather than after a
               round trip through the promise. */
            setBlocked(false);
            attempt(el);
          }}
        >
          <span aria-hidden="true" className={styles.playMark}>
            ▶
          </span>
          Play
        </button>
      )}
    </div>
  );
}
