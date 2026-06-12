/**
 * HeroVisual — lightweight replacement for the Spline WebGL scene.
 *
 * Pure CSS/SVG: no JavaScript runtime, no WebGL, no network fetch. It renders
 * an ambient gold "energy core" — layered radial glows, a faint masked grid,
 * a slow halo ring — animated with GPU-only transform/opacity. Costs ~0 bytes
 * over the wire versus the old 1.35 MB `scene.splinecode` plus the
 * `@splinetool/runtime` + `react-spline` bundles and a live WebGL canvas, and
 * it is identically cheap on mobile and desktop. All motion is disabled under
 * `prefers-reduced-motion`.
 *
 * Presentational only (no hooks), so it stays a server component.
 */
export function HeroVisual({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <div className="cakey-hero">
        <div className="cakey-hero__grid" />
        <div className="cakey-hero__glow cakey-hero__glow--halo" />
        <div className="cakey-hero__glow cakey-hero__glow--cool" />
        <div className="cakey-hero__glow cakey-hero__glow--core" />
        <div className="cakey-hero__ring" />
      </div>
      <style>{heroCss}</style>
    </div>
  );
}

const heroCss = `
.cakey-hero {
  position: absolute;
  inset: 0;
  overflow: hidden;
  contain: strict;
}
.cakey-hero__glow {
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 9999px;
  will-change: transform, opacity;
}
.cakey-hero__glow--core {
  width: min(46vw, 540px);
  height: min(46vw, 540px);
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at 50% 50%,
    oklch(0.86 0.15 85 / 0.55) 0%,
    oklch(0.72 0.16 70 / 0.32) 38%,
    transparent 70%);
  filter: blur(36px);
  animation: cakey-pulse 7s ease-in-out infinite;
}
.cakey-hero__glow--halo {
  width: min(72vw, 820px);
  height: min(72vw, 820px);
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at 50% 50%,
    oklch(0.7 0.13 75 / 0.16) 0%, transparent 65%);
  filter: blur(64px);
  animation: cakey-drift 13s ease-in-out infinite;
}
.cakey-hero__glow--cool {
  left: 60%;
  top: 40%;
  width: min(34vw, 400px);
  height: min(34vw, 400px);
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at 50% 50%,
    oklch(0.62 0.12 250 / 0.20) 0%, transparent 70%);
  filter: blur(56px);
  animation: cakey-drift 17s ease-in-out infinite reverse;
}
.cakey-hero__ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(30vw, 348px);
  height: min(30vw, 348px);
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  border: 1px solid oklch(0.85 0.14 85 / 0.16);
  box-shadow:
    inset 0 0 60px oklch(0.8 0.14 82 / 0.14),
    0 0 44px oklch(0.8 0.14 82 / 0.10);
  will-change: transform;
  animation: cakey-spin 28s linear infinite;
}
.cakey-hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(oklch(1 0 0 / 0.035) 1px, transparent 1px),
    linear-gradient(90deg, oklch(1 0 0 / 0.035) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(circle at 50% 46%, #000 0%, transparent 70%);
  mask-image: radial-gradient(circle at 50% 46%, #000 0%, transparent 70%);
}
@keyframes cakey-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.92; }
  50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
}
@keyframes cakey-drift {
  0%, 100% { transform: translate(-50%, -50%); }
  50% { transform: translate(calc(-50% + 3%), calc(-50% - 4%)); }
}
@keyframes cakey-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .cakey-hero__glow,
  .cakey-hero__ring { animation: none !important; }
}
`;
