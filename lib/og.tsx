import { ImageResponse } from "next/og";

/* ============================================================================
   OG IMAGES
   ============================================================================
   Composed rather than templated: the ruled frame, the hanging ordinal, the
   left-weighted type and the single vermilion mark are the same devices the
   site uses, so a shared link reads as this site before anyone clicks it.

   Type note: these render in the renderer's default sans, not Fraunces. next/og
   rasterises with satori, which cannot consume the woff2 files next/font
   produces — it needs a raw ttf/otf buffer. Rather than fetch a font over the
   network during a build, the cards lean on structure and scale. To upgrade
   later: drop a .ttf into lib/fonts/ and pass it via the `fonts` option below.
   ========================================================================= */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const PAPER = "#f4f1e9";
const INK = "#15140f";
const SIGNAL = "#bf3b11";
const RULE = "#cdc8bb";
const MUTED = "#6f6a5d";

export function ogCard({
  ordinal,
  eyebrow,
  title,
  deck,
  footer,
}: {
  /** Mono ordinal in the top-left, e.g. "01". */
  ordinal?: string;
  /** Uppercase mono line above the title — the section, usually. */
  eyebrow: string;
  title: string;
  deck?: string;
  /** Bottom-left line: the domain. */
  footer: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: "64px 72px",
          /* The one decorative element, and it is structural: a hairline
             marking the rail boundary at the 8/12 column. */
          borderTop: `10px solid ${INK}`,
        }}
      >
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
          {ordinal && (
            <div
              style={{
                fontSize: 20,
                letterSpacing: 3,
                color: SIGNAL,
                fontWeight: 600,
                paddingTop: 6,
              }}
            >
              {ordinal}
            </div>
          )}
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: MUTED,
              paddingTop: 6,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: title.length > 44 ? 62 : 78,
              lineHeight: 1.02,
              letterSpacing: -2.5,
              fontWeight: 600,
              maxWidth: 900,
              display: "flex",
            }}
          >
            {title}
          </div>
          {deck && (
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.3,
                color: MUTED,
                maxWidth: 760,
                display: "flex",
              }}
            >
              {deck}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${RULE}`,
            paddingTop: 22,
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          <div>{footer}</div>
          <div style={{ width: 56, height: 8, background: SIGNAL }} />
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
