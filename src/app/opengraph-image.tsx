import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cakey AI Launchpad. Intelligent trust for token launches";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamic OpenGraph image rendered at the edge — shared design with
 * cakey-platform/src/app/opengraph-image.tsx. Both projects must render the
 * same preview so the brand reads as one product across the marketing site
 * (cakeylaunch.com) and the app (cakey-platform.vercel.app / future app.cakeylaunch.com).
 *
 * Design rules:
 *   - Pure-black floor matches the hero
 *   - NO oversized gold radial — that's what made WhatsApp / Telegram thumbs
 *     read as a "circular gold gradient" instead of a premium product card
 *   - Subtle grid pattern mimics the live site's `.bg-grid` utility
 *   - Brand mark (gold "C" square) mirrors the sidebar BrandMark
 *
 * No external fonts. Linked automatically by the layout's `metadataBase`.
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
          padding: "72px 84px",
          color: "#fafafa",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(250,250,250,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(250,250,250,0.035) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: -160,
            left: 240,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background:
              "radial-gradient(closest-side, rgba(250,250,250,0.06), rgba(0,0,0,0))",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              border: "1.5px solid rgba(214,168,71,0.35)",
              background:
                "linear-gradient(135deg, rgba(214,168,71,0.14), rgba(214,168,71,0.02))",
              color: "#d6a847",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            C
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: "#fafafa",
                letterSpacing: -0.5,
                display: "flex",
              }}
            >
              Cakey<span style={{ color: "#d6a847", display: "flex" }}>.ai</span>
            </div>
            <div
              style={{
                fontSize: 14,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "rgba(250,250,250,0.45)",
                display: "flex",
              }}
            >
              AI Launchpad
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            marginTop: 92,
            maxWidth: 900,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              alignSelf: "flex-start",
              border: "1px solid rgba(214,168,71,0.25)",
              background: "rgba(214,168,71,0.06)",
              borderRadius: 9999,
              padding: "8px 16px",
              color: "#d6a847",
              fontSize: 16,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Intelligent trust layer
          </div>

          <div
            style={{
              fontSize: 92,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: -3,
              color: "#fafafa",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ display: "flex" }}>Launch tokens with</span>
            <span style={{ color: "#d6a847", display: "flex" }}>
              intelligent trust.
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 8,
              fontSize: 18,
              color: "rgba(250,250,250,0.65)",
              fontWeight: 500,
            }}
          >
            <span style={{ display: "flex" }}>Behavioral scoring</span>
            <span style={{ color: "rgba(250,250,250,0.25)", display: "flex" }}>·</span>
            <span style={{ display: "flex" }}>Pre-launch simulation</span>
            <span style={{ color: "rgba(250,250,250,0.25)", display: "flex" }}>·</span>
            <span style={{ display: "flex" }}>Commitment locks</span>
            <span style={{ color: "rgba(250,250,250,0.25)", display: "flex" }}>·</span>
            <span style={{ display: "flex" }}>Insurance pool</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 84,
            right: 84,
            bottom: 64,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            zIndex: 1,
          }}
        >
          <div
            style={{
              height: 1,
              width: "100%",
              background:
                "linear-gradient(to right, rgba(250,250,250,0.18), rgba(250,250,250,0.04), transparent)",
              display: "flex",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 18,
              color: "rgba(250,250,250,0.55)",
            }}
          >
            <span style={{ display: "flex" }}>
              End rug pulls. Replace launchpad hype with verifiable evidence.
            </span>
            <span
              style={{
                color: "#fafafa",
                fontWeight: 600,
                letterSpacing: 0.3,
                display: "flex",
              }}
            >
              cakeylaunch.com
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
