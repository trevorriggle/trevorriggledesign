"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Video.module.css";

/* ============================================================================
   AUTOVIDEO
   ============================================================================
   The playing half of <VideoSlot />, and the only client component the content
   pages ship. It is mounted only when the mp4 actually exists on disk, so a
   repo with no video file ships no JavaScript for it at all.

   AUTOPLAY POLICY. The element never carries the `autoplay` attribute. It is
   started from script, and only when all four of these hold:

     · the viewer is not on a metered or slow connection
     · the viewer has not asked the OS for reduced motion
     · the element is actually on screen
     · the browser lets a muted play() through

   `navigator.connection` is the only signal a browser gives for "mobile data",
   and it is Chromium-only. So the check is written to FAIL CLOSED: if the API
   is missing, `saveData` is set, the connection reports `cellular`, or the
   effective type is 3g or worse, the clip does not start on its own. On an
   unknown connection nothing autoplays either, a still frame that the viewer
   can start is a much cheaper mistake than a background download on a phone
   plan.

   Controls are always present, so "did not autoplay" is never "cannot play".
   ========================================================================= */

type NetworkInformation = {
  saveData?: boolean;
  type?: string;
  effectiveType?: string;
};

/** True only when the connection is known and known to be fine. */
function connectionAllowsAutoplay(): boolean {
  if (typeof navigator === "undefined") return false;

  const conn = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection;

  // No API: fail closed rather than guess. Safari and Firefox land here.
  if (!conn) return false;
  if (conn.saveData) return false;
  if (conn.type === "cellular") return false;
  if (conn.effectiveType && /^(slow-2g|2g|3g)$/.test(conn.effectiveType)) {
    return false;
  }
  return true;
}

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
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setAutoplay(!reduced && connectionAllowsAutoplay());
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !autoplay) return;

    // Only spend bandwidth and decode time on a clip that is on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Muted playback is allowed without a gesture; a rejection here is a
          // policy decision by the browser and is correctly left alone.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.35 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [autoplay]);

  return (
    <video
      ref={ref}
      className={styles.video}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      controls
      /* metadata, not auto: nothing downloads the clip body until the viewer
         or the autoplay decision above asks for it. */
      preload="metadata"
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
