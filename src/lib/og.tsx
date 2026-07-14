import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

/**
 * The shared social card. Every route's `opengraph-image` renders through this.
 *
 * The site's own OG image used to be the logo file — 213x46, so every share
 * rendered a tiny letterboxed strip in a 1200x630 slot. This draws a real card
 * at the size the platforms actually crop to.
 *
 * Satori (what next/og renders with) is not a browser: any element with more
 * than one child must declare `display: flex`, and only inline styles apply.
 * No custom font is loaded on purpose — a webfont fetch at build would be one
 * more thing that can fail, and the built-in sans is close enough at this size.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const RED = "#E3001B";
const INK = "#0B0B0C";

export function ogImage({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
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
          background: INK,
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Red rule across the top — the one brand mark that survives at any crop.
            Pinned left AND right: `width:100%` on an absolute child resolves
            against the parent's content box, so the 80px padding would leave the
            bar short of the right edge. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            background: RED,
          }}
        />

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: 2,
            }}
          >
            {SITE.name.toUpperCase()}
          </div>
          {/* The red full stop is part of the wordmark — it sits tight to the
              final letter, so no gap between the two. */}
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: RED,
              marginLeft: -2,
            }}
          >
            .
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: RED,
              letterSpacing: 6,
            }}
          >
            {eyebrow.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: title.length > 60 ? 60 : 74,
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.1,
              letterSpacing: -1,
              // Long post titles must not push the footer off the card.
              display: "flex",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#8A8A8E",
            borderTop: "1px solid #2A2A2C",
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex" }}>{SITE.tagline}</div>
          <div style={{ display: "flex", color: "#FFFFFF" }}>admirate.in</div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
