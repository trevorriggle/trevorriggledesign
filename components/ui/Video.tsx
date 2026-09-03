import type { ResolvedVideo } from "@/content";
import { Frame } from "./Frame";
import { AutoVideo } from "./AutoVideo";
import styles from "./Video.module.css";

/* ============================================================================
   VIDEO SLOT
   ============================================================================
   One declared video, in whichever of its three states the repo is actually in:

     mp4 present        -> <AutoVideo />, poster frame, muted, looped, inline,
                           started from script and never on mobile data.
     mp4 missing        -> the poster frame, as a still, through <Frame />.
     poster missing too -> the same spec <Placeholder /> as any other image.

   The box is the same size in all three, because it is measured from the
   poster's declared aspect ratio. That is what makes a page with no video file
   composition-correct rather than merely non-broken — which matters, because
   that is the state this repo ships in today.

   Server component. The client half mounts only when there is something to
   play, so the missing-file case ships no JavaScript.
   ========================================================================= */

export function VideoSlot({
  video,
  sizes,
  ordinal,
}: {
  video: ResolvedVideo;
  /** Passed to the poster's <Frame /> in the degraded states. */
  sizes: string;
  ordinal?: string;
}) {
  const caption = video.caption ?? video.poster.caption;

  if (!video.exists) {
    return (
      <div className={styles.slot}>
        <Frame
          image={caption ? { ...video.poster, caption } : video.poster}
          role="video poster"
          sizes={sizes}
          ordinal={ordinal}
          priority
        />
        {process.env.NODE_ENV !== "production" && (
          <p className={styles.pending}>
            <span className={styles.pendingTag}>video pending</span>
            <span>
              Showing the poster frame. Save the clip as{" "}
              <code>{video.expectedAt}</code> and it takes over — muted, looped,
              inline, no autoplay on mobile data. No code or frontmatter edit.
            </span>
          </p>
        )}
      </div>
    );
  }

  return (
    <figure className={styles.slot}>
      <AutoVideo
        src={video.url}
        poster={video.poster.exists ? video.poster.url : ""}
        width={video.poster.width}
        height={video.poster.height}
        label={video.poster.alt}
      />
      {caption && (
        <figcaption className={styles.caption}>
          {ordinal && <span className={styles.captionOrdinal}>{ordinal}</span>}
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
