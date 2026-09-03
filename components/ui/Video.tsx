import type { VideoRef } from "@/content";
import { Frame } from "./Frame";
import { AutoVideo } from "./AutoVideo";
import styles from "./Video.module.css";

/* ============================================================================
   VIDEO SLOT
   ============================================================================
   Three states, and the third is silence:

     mp4 present        <AutoVideo /> — poster, muted, looped, inline, started
                        from script and never on mobile data
     mp4 missing        the poster frame, as a still
     neither present    nothing at all

   The client half mounts only when there is something to play, so a repo with
   no video file ships no JavaScript for it.
   ========================================================================= */

export function VideoSlot({
  video,
  sizes,
}: {
  video: VideoRef;
  sizes: string;
}) {
  const caption = video.caption ?? video.poster?.caption;

  if (!video.exists) {
    if (!video.poster?.exists) return null;
    return (
      <div className={styles.slot}>
        <Frame
          image={caption ? { ...video.poster, caption } : video.poster}
          sizes={sizes}
          priority
        />
      </div>
    );
  }

  return (
    <figure className={styles.slot}>
      <AutoVideo
        src={video.url}
        poster={video.poster?.exists ? video.poster.url : ""}
        width={video.poster?.width ?? 1600}
        height={video.poster?.height ?? 900}
        label={video.poster?.alt ?? ""}
      />
      {caption && (
        <figcaption className={styles.caption}>
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
