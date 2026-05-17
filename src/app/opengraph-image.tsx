import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cakey AI Launchpad — Intelligent trust for token launches";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamic OpenGraph image rendered at the edge.
 *
 * Pure-black floor matches the site theme.  No external fonts (keeps the edge
 * function cold-start under ~50ms).  Linked automatically by the layout's
 * `metadataBase` — no manual `<meta og:image>` needed.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          color: "#fafafa",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle warm ambient blob — restrained, premium */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -120,
            width: 800,
            height: 800,
            borderRadius: 9999,
            background:
              "radial-gradient(closest-side, rgba(214,168,71,0.18), rgba(0,0,0,0))",
            display: "flex",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#d6a847",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: "#d6a847",
              display: "flex",
            }}
          />
          Cakey AI
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: -2,
              color: "#fafafa",
            }}
          >
            Launch tokens with
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: -2,
              color: "#d6a847",
            }}
          >
            intelligent trust.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
            color: "#a3a3a3",
          }}
        >
          <span>AI risk scoring · proof of commitment · insurance pool</span>
          <span style={{ color: "#fafafa", fontWeight: 600 }}>cakey.ai</span>
        </div>
      </div>
    ),
    size,
  );
}
